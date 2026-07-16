import { verifyRefreshToken } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if(!refreshToken) return NextResponse.json({ error: "no token"}, { status : 401})

    try {
        const payload = verifyRefreshToken(refreshToken);
        const user = await UserService.refresh(payload.id, refreshToken);

        const res = NextResponse.json({ ok: true });
        res.cookies.set("access_token", user.access_token, {
            httpOnly:true,
            sameSite:"lax",
            maxAge: 15 * 60,
            path:"/",
        });
        return res
    } catch {
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }
}