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
        const uploaded = await ImageKitService.upload(data.image, `${data.image}-${Date.now()}`);
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

  async findAll(params?: { storeId?: string; categoryId?: string; status?: product_status }) {
    return prisma.product.findMany({
      where: {
        storeId: params?.storeId,
        categoryId: params?.categoryId,
        status: params?.status,
      },
      include: {
        category: true,
        store: true,
      },
      orderBy: { price: "asc" }, // now sorts correctly, numerically
    });
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
      image:string;
      storeId: string;
    }>
  ) {
    const updatedData : typeof data = { ...data };
    if(data.image){
        const uploaded = await ImageKitService.upload(data.image, `${id}-${Date.now()}`)
        updatedData.image = uploaded.url 
    }
    return prisma.product.update({
      where: { id },
      data: {
        updatedData,
        price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
        last_updated: new Date(),
      },
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