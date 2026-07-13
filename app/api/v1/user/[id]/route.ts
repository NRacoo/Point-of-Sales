import { UserService } from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest, 
    { params } : { params: Promise<{ id: string }>}
){
    try {
        const { id } = await params
        if(!id) {
            return NextResponse.json({
                success:false, message: "missing field"
            }, { status: 400 });
        }

        const user = await UserService.findById(id);

        if(!user){
            return NextResponse.json({ success: false, message: "user not found"}, { status: 400 })
        };

        return NextResponse.json(
            {success: true, message: "user fetched successfully", data:user},
            { status: 200 }
        )
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Internal server error" }, { status: 400})
    }
}