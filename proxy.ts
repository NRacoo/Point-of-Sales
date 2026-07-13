// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload = verifyAccessToken(token); 
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (path.startsWith("/cashier") && payload.role !== "cashier") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: ['/admin/:path*', '/cashier/:path*', "/api/protected/:path*"],
};
