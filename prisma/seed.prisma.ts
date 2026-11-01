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

        const cashierName = process.env.CASHIER_FULLNAME ?? "Kasir Satu";
        const cashierPhone = process.env.CASHIER_PHONE ?? "0812345679";
        const cashierEmail = process.env.CASHIER_EMAIL ?? "kasir@example.com";
        const cashierPass = process.env.PASS_CASHIER ?? pass;

        const hashPass = await bcrypt.hash(pass, 10)

        const store = await prisma.store.upsert({
            where: { phoneNumber: "0812345678" },
            update: {},
            create: {
                name: "Anugerah Jaya",
                address: "Jl. Sukabirus",
                phoneNumber: "0812345678"
            }
        })

        await prisma.user.upsert({
            where: { email },
            update: { storeId: store.id, role: Role.admin },
            create:{
                fullName:name,
                password:hashPass,
                role:Role.admin,
                phoneNumber:phone,
                email:email,
                image:"",
                token: "",
                access_token:"",
                storeId: store.id
            }
        })
        console.log("admin seeded successfully")

        const hashCashierPass = await bcrypt.hash(cashierPass, 10)
        await prisma.user.upsert({
            where: { email: cashierEmail },
            update: { storeId: store.id, role: Role.cashier },
            create: {
                fullName: cashierName,
                password: hashCashierPass,
                role: Role.cashier,
                phoneNumber: cashierPhone,
                email: cashierEmail,
                image: "",
                token: "",
                access_token: "",
                storeId: store.id
            }
        })
        console.log(`cashier seeded successfully (store: ${store.id})`)
}

main()
.catch(console.error).finally(async () => {await prisma.$disconnect()})
