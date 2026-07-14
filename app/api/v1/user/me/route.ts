import { verifyAccessToken } from "@/lib/auth";
import { UserService } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try {
        const token = req.cookies.get("access_token")?.value;
        if(!token) {
            return NextResponse.json({ success: false, message:"Unauthorized" }, { status: 401})
        }

        const payload= verifyAccessToken(token)

        const user = await UserService.findById(payload.id);

        if(!user){
            return NextResponse.json({ success: false, message: "user not found"}, { status: 400 })
        };

        return NextResponse.json(
            {success: true, message: "user fetched successfully", data:user},
            { status: 200 }
        )
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Internal server error" }, { status: 500})
    }
}