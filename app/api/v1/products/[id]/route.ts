import { product_status } from "@/app/generated/prisma/enums";
import { ProductService } from "@/services/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest){
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId") ?? undefined;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const status = ( searchParams.get("status") as product_status ) ?? undefined;

    const products = await ProductService.findAll({storeId, categoryId, status});

    return NextResponse.json( { success: true, data: products } )
  } catch (error) {
    console.error("[ GET /api/v1/products ")
  }
}