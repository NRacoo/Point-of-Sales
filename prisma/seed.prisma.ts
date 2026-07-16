import "dotenv/config"
import { PrismaClient, Role } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient({
    adapter: new PrismaPg({connectionString: process.env.DATABASE_URL})
})

async function main(){
        const name = process.env.FULLNAME;
        const phone = process.env.PHONE;
        const email = process.env.EMAIL;
        const pass = process.env.PASS_ADMIN;

        if (!name || !phone || !email || !pass) {
            throw new Error("Missing environment variables")
        }


        const hashPass = await bcrypt.hash(pass, 10)
        await prisma.user.create({
            data:{
                fullName:name,
                password:hashPass,
                role:Role.admin,
                phoneNumber:phone,
                email:email,
                image:"",
                token: "",
                access_token:"",
                store:{
                    create:{
                        name:"Anugerah Jaya",
                        address:"Jl. Sukabirus",
                        phoneNumber:"0812345678"
                    }
                }
            }
        })
        console.log("admin seeded successfully")
}

main()
.catch(console.error).finally(async () => {await prisma.$disconnect()})