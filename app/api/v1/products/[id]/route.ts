import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
import { product_status } from "@/app/generated/prisma/enums";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

interface Params {
    params: Promise<{id: string}>;
}

// GET /api/products/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await ProductService.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[GET /api/products/:id]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const cookiesStore = await cookies()
    const token = cookiesStore.get("access_token")?.value;

    if(!token) return NextResponse.json(
      { success : false, message: "unauthorized"}, { status: 401 }
    )

    const payload = verifyAccessToken(token)

    if(!payload.storeId){
      return NextResponse.json({
        success: false, message: "user dont have a store"
      }, { status: 500 })
    }

    const formData = await req.formData();
    const product_name = formData.get("product_name") as string;
    const categoryId = formData.get("categoryId") as string;
    const stock = Number(formData.get("stock"));
    const reorder_level = Number(formData.get("reorder_level"));
    const price = Number(formData.get("price"));
    const unit = formData.get("unit") as string;
    const rawStatus = formData.get("status");
    const imageFile = formData.get("image") as File | null;

    const status =
    rawStatus != null
      ? (rawStatus as product_status)
      : undefined;

    let imageBase64: string | undefined;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      imageBase64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }

    const product = await ProductService.update(id, {
      product_name,
      categoryId,
      stock: stock !== undefined ? Number(stock) : undefined,
      reorder_level: reorder_level !== undefined ? Number(reorder_level) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      unit,
      status,
      image:imageBase64,
      storeId:payload.storeId,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("[PATCH /api/products/:id]", error);

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ProductService.delete(id);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("[DELETE /api/products/:id]", error);

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}