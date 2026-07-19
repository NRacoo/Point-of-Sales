// services/product.services.ts
import { prisma } from "@/lib/prisma";
import { product_status, Prisma } from "@/app/generated/prisma/client";
import { ImageKitService } from "./imageKit.service";

export const ProductService = {
  async create(data: {
    product_name: string;
    categoryId: string;
    stock: number;
    reorder_level: number;
    price: number;
    image: string;
    unit: string;
    status?: product_status;
    storeId?: string;
  }) {
    const existing = await prisma.product.findUnique({
      where: { product_name: data.product_name },
    });
    if (existing) throw new Error("Product name already exists");

    let imageUrl = ""
    if(data.image){
        const uploaded = await ImageKitService.upload(data.image, `product-${Date.now()}`);
        imageUrl = uploaded.url 
    }

    return prisma.product.create({
      data: {
        product_name: data.product_name,
        categoryId: data.categoryId,
        stock: data.stock,
        reorder_level: data.reorder_level,
        price: new Prisma.Decimal(data.price),
        unit: data.unit,
        image:imageUrl,
        status: data.status ?? "in_stock",
        storeId: data.storeId,
      },
    });
  },

  async findAll(params?: { storeId?: string; categoryId?: string; status?: product_status; page?:number; limit?:number }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;

    const where = {
      storeId: params?.storeId,
      categoryId: params?.categoryId,
      status: params?.status,
    }

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          select: {
            id: true,
            product_name: true,
            stock: true,
            reorder_level: true,
            image: true,
            price: true,
            status: true,
            last_updated: true,
            unit: true,
            categoryId: true,
            category: {
              select: {
                id: true,
                category_name: true
              }
            }
          },
          orderBy: { price: "asc" }, 
          take: limit,
          skip: (page - 1) * limit,
        }),
        prisma.product.count({
          where,
        }),
    ]);

    return {
      data: products,
      pagination:{
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        store: true,
      },
    });
  },

  async findByName(product_name: string) {
    return prisma.product.findUnique({
      where: { product_name },
    });
  },

  async update(
    id: string,
    data: Partial<{
      product_name: string;
      categoryId: string;
      stock: number;
      reorder_level: number;
      price: number;
      status: product_status;
      unit:string;
      image:string;
      storeId: string;
    }>
  ) {
    const updateData: Prisma.ProductUpdateInput = {
      last_updated: new Date(),
    };

    if (data.product_name !== undefined)
      updateData.product_name = data.product_name;

    if (data.stock !== undefined)
      updateData.stock = data.stock;

    if (data.reorder_level !== undefined)
      updateData.reorder_level = data.reorder_level;

    if (data.unit !== undefined)
      updateData.unit = data.unit;

    if (data.price !== undefined)
      updateData.price = new Prisma.Decimal(data.price);

    if (data.status !== undefined)
      updateData.status = data.status;

    if (data.categoryId) {
      updateData.category = {
        connect: {
          id: data.categoryId,
        },
      };
    }

    if (data.storeId) {
      updateData.store = {
        connect: {
          id: data.storeId,
        },
      };
    }

    if (data.image) {
      const uploaded = await ImageKitService.upload(
        data.image,
        `${id}-${Date.now()}`
      );

      updateData.image = uploaded.url;
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  async adjustStock(id: string, delta: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    const newStock = product.stock + delta;
    if (newStock < 0) throw new Error("Insufficient stock");

    const newStatus: product_status =
      newStock === 0
        ? "out_of_stock"
        : newStock <= product.reorder_level
        ? "low_stock"
        : "in_stock";

    return prisma.product.update({
      where: { id },
      data: {
        stock: newStock,
        status: newStatus,
        last_updated: new Date(),
      },
    });
  },
};