import { getAuthUser, requireOrderAccess } from "@/lib/auth";
import { handleError } from "@/lib/handlers/error";
import { createOrderSchema, listOrderQuerySchema } from "@/lib/order.schema";
import { CreateOrder, ListOrders } from "@/services/order.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    try {
        const user = getAuthUser(req);
        requireOrderAccess(user);
        
        const { searchParams } = new URL(req.url);
        const query = listOrderQuerySchema.parse(Object.fromEntries(searchParams));

        const result = await ListOrders(user, query);
        return NextResponse.json(result)
        
    } catch (error) {
        return handleError(error);
    }
}

export async function POST (req:NextRequest){
    try {
        const user = getAuthUser(req);
        requireOrderAccess(user);

        const body = await req.json();
        const input = createOrderSchema.parse(body);
        const order = await CreateOrder(user, input);

        return NextResponse.json(order, { status: 201 })
        
    } catch (error) {
        return handleError(error)
    }
}