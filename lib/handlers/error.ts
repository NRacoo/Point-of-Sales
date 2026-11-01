import { ZodError } from "zod";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/services/order.service";
import { UnauthorizedError, ForbiddenError as AuthForbiddenError } from "../auth"
import { NextResponse } from "next/server";

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json({ error: "Validasi gagal", details: err.flatten() }, { status: 400 });
  }
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
  if (err instanceof ForbiddenError || err instanceof AuthForbiddenError) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
  if (err instanceof BadRequestError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
  console.error(err); // detail lengkap cukup di server log, jangan dibocorkan ke client
  return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
}