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
    console.error("[GET /api/v1/products]", error);
    return NextResponse.json({ success: false, message: "failed fetch to products"});
  }
}

export async function POST(req: NextRequest){
  try {
     const formData = await req.formData();

    const product_name = formData.get("product_name") as string;
    const categoryId = formData.get("categoryId") as string;
    const stock = formData.get("stock") as string;
    const reorder_level = formData.get("reorder_level") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const storeId = formData.get("storeId") as string | null;
    const imageFile = formData.get("image") as File | null;

     if (!product_name || !categoryId || price === undefined) {
      return NextResponse.json(
        { success: false, message: "product_name, categoryId, and price are required" },
        { status: 400 }
      );
    }

    let imageBase64 = "";
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageBase64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }

    const product = await ProductService.create({
      product_name,
      categoryId,
      stock: Number(stock ?? 0),
      reorder_level: Number(reorder_level ?? 0),
      price: Number(price ?? 0),
      image:imageBase64,
      unit: unit ?? "pcs",
      storeId: storeId ?? undefined
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 });
    
  } catch (error:any) {
    console.log("[POST /api/v1/product]", error)

    if (error.message === "Product name already exists") {
      return NextResponse.json({ success: false, message: error.message }, { status: 409 });
    }
    return NextResponse.json({ success: false, message:"failed to create product"}, { status: 500 })
  }
}