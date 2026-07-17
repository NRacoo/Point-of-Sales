import { CategoryService } from "@/services/category.service";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        const body = await req.json()
        if(!body.category_name){
            return NextResponse.json(
                { success: false, message: " missing required filled "},
                { status: 400 }
            )
        };

        const category = await CategoryService.create(body)
       
            return NextResponse.json(
                { success: true, messsage: "category created successfully", data: category}
            
            )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "internal service error"}, 
            { status: 500 }
        )
    }
}

export async function GET(){
    try {

        const categories = await CategoryService.findAll();
        return NextResponse.json(
            { success: true, data:categories },
            { status: 200 }
        )

    } catch (error) {
         return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "internal service error"}, 
            { status: 500 }
        )
    }
}