
import { Prisma } from "@/app/generated/prisma/client";
import { ForbiddenError as AuthForbiddenError, AuthUser } from "@/lib/auth";
import { CreateOrderInput, ListOrderQuery, UpdateOrderStatusInput } from "@/lib/order.schema";
import { prisma } from "@/lib/prisma";

export class NotFoundError extends Error{
    constructor(msg = "Data not available"){
        super(msg);
        this.name = "NotFoundError";
    }
}

export class ForbiddenError extends AuthForbiddenError{}
export class BadRequestError extends Error{
    constructor(msg="Invalid Request"){
        super(msg);
        this.name = "BadRequestError";
    }
}

function GenerateOrderNumber(){
    const now = new Date();
    const ymd = now.toISOString().slice(0,10).replace(/-/g, "");
    const rand = Math.random().toString().slice(2,8).toUpperCase();
    return `ORD-${ymd}-${rand}`
}

function resolveStoreId(user:AuthUser, requestStoreId?:string):string{
    if(user.role === "cashier"){
        if(!user.storeId){
            throw new ForbiddenError("cashier didnt have storeId")
        }
        return user.storeId;
    }

    if(!requestStoreId){
        throw new ForbiddenError("admin must have storeId");
    }

    return requestStoreId;
}

export async function CreateOrder(user:AuthUser, input:CreateOrderInput){
    const storeId = resolveStoreId(user, input.storeId);

    return prisma.$transaction( async(tx)=> {
        const store = await tx.store.findUnique({ where: { id: storeId }, select: { id: true }});
        if(!store) throw new NotFoundError("store not found");

        const productIds = input.items.map((i) => i.productId)
        
        const products = await tx.product.findMany({
            where: { id: { in: productIds}, storeId}
        })

        if(products.length !== productIds.length){
            throw new BadRequestError("Some product not found")
        }

        const productMap = new Map(products.map((i) => [i.id, i]));

        let total = new Prisma.Decimal(0);

        const itemsData: { productId: string; quantity: string; price_at_sale: string}[] =[];

        for (const item of input.items){
            const product = productMap.get(item.productId)!;
            const qty = Number(item.quantity);

            if(product.stock < qty ) {
                throw new BadRequestError(`quantity of ${product.product_name} not enough, stock left${product.stock}`)
            };

            const lineTotal = product.price.mul(qty);

            total = total.add(lineTotal);

            itemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price_at_sale: product.price.toString()
            });

            const newStock = product.stock - qty;
            const newStatus = newStock <= 0 ? "out_of_stock" : newStock <= product.reorder_level ? "low_stock" : "in_stock";


            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: newStock,
                    status: newStatus
                }
            })
        }

        const order = await tx.order.create({
            data:{
                order_number: GenerateOrderNumber(),
                customer_name: input.customer_name,
                payment_method: input.payment_method,
                total_amount: total.toString(),
                userId: user.id,
                storeId,
                orderItem:{
                    createMany:{ data:itemsData }
                }
            },
            include:{ orderItem: { include: { product: true } } }
        });

        return order;
    })
}

export async function GetOrderById(user:AuthUser, orderNumber: string){
    const order = await prisma.order.findUnique({
        where: { order_number: orderNumber},
        include: { 
            orderItem: { include: { product: true } }, 
            store: true, 
            user: {
                select: { id: true, fullName: true}
            },
        }
    });

    if(!order) throw new NotFoundError();

    if(user.role === "cashier" && order.storeId !== user.storeId){
        throw new ForbiddenError()
    };
    return order;
}

export async function ListOrders(user: AuthUser, query: ListOrderQuery){
    const storeId = user.role === "cashier" ? user.storeId : query.storeId;

    if(!storeId && user.role !== "cashier"){
        throw new ForbiddenError("storeId not found")
    }

    const where: Prisma.OrderWhereInput = {
        ...(storeId ? { storeId } : {} ),
        ...(query.status ? { status: query.status }: {}),
        ...(query.search ? {
            OR:[
                { order_number: { contains: query.search, mode: "insensitive" } },
                { customer_name: { contains: query.search, mode: "insensitive" } }
            ]
        }: {})
    }

    const [items, total ] = await prisma.$transaction([
        prisma.order.findMany({
            where,
            include:{ orderItem: true },
            orderBy: { order_date: "desc"},
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
        }),
        prisma.order.count({ where })
    ])

    return {
        items, 
        pagination:{
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPage: Math.ceil( total/query.pageSize ),
        }
    }

}

export async function UpdateOrderStatus(user: AuthUser, orderId: string, input: UpdateOrderStatusInput){
    return prisma.$transaction(async(tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId }, include:{ orderItem: true } });
        if(!order) throw new NotFoundError();

        if(user.role === "cashier" && order.storeId !== user.storeId){
            throw new ForbiddenError();
        }

        if(order.status !== "pending"){
            throw new BadRequestError(`status order with ${order.status} cannot changed`)
        };

        if(input.status === "cancelled"){
            for(const item of order.orderItem ){
                const qty = Number(item.quantity);
                const product = await tx.product.findUnique({ where: {id: item.productId}})
                if(!product) continue;
                const newStock = product.stock + qty;
                const newStatus = newStock <= 0 ? "out_of_stock" : newStock <= product.reorder_level ? "low_stock" : "in_stock"
                await tx.product.update({ where: {id: product.id}, data:{stock: newStock, status: newStatus} })
            }
        }

        return tx.order.update( { where: { id: orderId }, data:{ status: input.status } } );
    })
}


export async function DeleteOrder(user:AuthUser, orderId:string){
    const order = await prisma.order.findUnique({ where: {id: orderId } });
    if(!order) throw new NotFoundError();
    if(user.role === "cashier" && order.storeId !== user.storeId) throw new ForbiddenError();

    await prisma.order.delete({ where: {id: orderId } });
}