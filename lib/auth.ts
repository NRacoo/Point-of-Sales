import * as bcrypt from "bcrypt";
import jwt, { SignOptions }   from "jsonwebtoken";
import { NextRequest } from "next/server";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXP;
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXP;

if(!ACCESS_SECRET || !REFRESH_SECRET || !ACCESS_EXPIRATION || !REFRESH_EXPIRATION === undefined ) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in environment variables")
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10)
export const comparePassword = (password: string, hash:string) => bcrypt.compare(password, hash);

export const signAccessToken = (payload : { id : string, role: string, storeId?: string}) => jwt.sign(payload, ACCESS_SECRET, {expiresIn: ACCESS_EXPIRATION as SignOptions["expiresIn"]});
export const signRefreshToken = (payload: {id: string}) => jwt.sign(payload, REFRESH_SECRET, {expiresIn: REFRESH_EXPIRATION as SignOptions["expiresIn"]});

export const verifyAccessToken = (token:string) => jwt.verify(token, ACCESS_SECRET) as { id: string, role:string, storeId: string };
export const verifyRefreshToken = (token:string) => jwt.verify(token, REFRESH_SECRET) as { id: string }; 



export class UnauthorizedError extends Error {
  constructor(msg = "Unauthorized") {
    super(msg);
    this.name = "UnauthorizedError";
  }
}
export class ForbiddenError extends Error {
  constructor(msg = "Kamu tidak punya akses untuk aksi ini") {
    super(msg);
    this.name = "ForbiddenError";
  }
}
 
export type AuthUser = {
  id: string;
  role: string; // "cashier" | "admin"
  storeId?: string;
};
 
/**
 * Ambil user dari access_token cookie (httpOnly), sama seperti route /me kamu.
 * role & storeId dipercaya dari payload JWT karena access token umurnya pendek (15 menit)
 * dan di-generate ulang tiap refresh, jadi cukup fresh untuk RBAC ini.
 */
export function getAuthUser(req: NextRequest): AuthUser {
  const token = req.cookies.get("access_token")?.value;
  if (!token) throw new UnauthorizedError();
 
  try {
    const payload = verifyAccessToken(token);
    return { id: payload.id, role: payload.role, storeId: payload.storeId };
  } catch {
    throw new UnauthorizedError("Token tidak valid atau kadaluarsa");
  }
}
 
/** Cuma cashier & admin yang boleh bikin/kelola order */
export function requireOrderAccess(user: AuthUser) {
  if (user.role !== "cashier" && user.role !== "admin") {
    throw new ForbiddenError("Role kamu tidak diizinkan mengelola order");
  }
}