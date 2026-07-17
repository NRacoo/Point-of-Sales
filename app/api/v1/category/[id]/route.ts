import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";

interface Params {
  params: { id: string };
}

// GET /api/products/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const product = await ProductService.findById(params.id);

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
    const body = await req.json();

    const {
      product_name,
      categoryId,
      stock,
      reorder_level,
      price,
      status,
      storeId,
    } = body;

    const product = await ProductService.update(params.id, {
      product_name,
      categoryId,
      stock: stock !== undefined ? Number(stock) : undefined,
      reorder_level: reorder_level !== undefined ? Number(reorder_level) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      status,
      storeId,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("[PATCH /api/products/:id]", error);

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await ProductService.delete(params.id);
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