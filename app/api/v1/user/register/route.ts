import { UserService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:Request){
    try {
          console.log("1. Request masuk");
        const body = await req.json();
        if (!body.fullName || !body.email || !body.password) {
            return NextResponse.json(
                {
                success: false,
                message: "Missing required fields",
                },
                { status: 400 }
        );}
        console.log("2. Body:", body);
        const user = await UserService.create({
            fullName:body.fullName,
            email:body.email,
            password:body.password,
            phoneNumber:body.phoneNumber,
            image:body.image
        } );
        console.log("3. User berhasil dibuat:", user);
        return NextResponse.json({
            success:true,
            message:"User created sucessfully",
            data:user,
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
            },
            { status: 400 }
        );
    }
}