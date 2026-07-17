import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";

interface Params {
  params: { id: string };
}

// POST /api/products/:id/adjust-stock  body: { delta: number }
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { delta } = await req.json();

    if (typeof delta !== "number") {
      return NextResponse.json({ success: false, message: "delta must be a number" }, { status: 400 });
    }

    const product = await ProductService.adjustStock(params.id, delta);
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("[POST /api/products/:id/adjust-stock]", error);

    if (error.message === "Product not found") {
      return NextResponse.json({ success: false, message: error.message }, { status: 404 });
    }
    if (error.message === "Insufficient stock") {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to adjust stock" },
      { status: 500 }
    );
  }
}