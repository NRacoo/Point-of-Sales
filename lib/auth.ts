import * as bcrypt from "bcrypt";
import jwt, { SignOptions }   from "jsonwebtoken";

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
