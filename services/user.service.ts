import { comparePassword, hashPassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import { ImageKitService } from "./imageKit.service";

export const UserService = {
    async create(data:{
        fullName:string,
        email:string,
        password:string,
        phoneNumber:string,
        image?:string,
        storeId?:string
    }){
        const existUser = await prisma.user.findUnique({
            where: {email : data.email}
        });
        if(existUser) {
            throw new Error("Email already Exist")
        };
        const hashed = await hashPassword(data.password);

        let imageUrl = ""
        if(data.image) {
            const uploaded = await ImageKitService.upload(data.image, `${data.email}-${Date.now()}`);
            imageUrl = uploaded.url;
        }

        const user = prisma.user.create({
            data:{
                fullName:data.fullName,
                email:data.email,
                password:hashed,
                phoneNumber:data.phoneNumber,
                image:imageUrl,
                storeId:data.storeId,
                token:"",
                access_token:""
            }
        })
        return user;
    },

    async findByEmail(email:string){
        return prisma.user.findUnique({
            where:{ email }
        })
    },

    async findById(id:string){
        return prisma.user.findUnique({where: { id }, select:{
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            image: true,
            role: true,
            store: true,
            storeId: true,
        }})
    },

    async update(id:string, data: Partial<{
        fullName:string,
        phoneNumber:string,
        image:string,
        storeId:string,
    }>){
        const updatedData: typeof data = {...data};
        if(data.image){
            const uploaded = await ImageKitService.upload(data.image, `${id}-${Date.now()}`)
            updatedData.image = uploaded.url
        }
        return prisma.user.update({ where: { id }, data: updatedData })
    },

    async delete(id:string){
        return prisma.user.delete({ where: { id }})
    },

    async Login(email:string, password:string){
        const user = await this.findByEmail(email);

        if(!user) throw new Error("invalid credentials");

        const valid = await comparePassword(password, user.password);
        
        if(!valid) throw new Error("invalid credentials");

        const access_token = signAccessToken( { id: user.id, role: user.role });
        const token = signRefreshToken( { id: user.id });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { access_token, token }
        })
        
        return updated;
    },

    async refresh(userId: string, oldRefreshToken: string){
        const user = await prisma.user.findUnique({ where: { id: userId }});
        if(!user || user.token !== oldRefreshToken){
            throw new Error("invalid refresh token")
        };

        const access_token = signAccessToken({ id: user.id, role: user.role });
        const token = signRefreshToken({ id: user.id });

        return prisma.user.update({
            where: { id: user.id },
            data: { access_token, token }
        })
    },

    async logout(id: string){
        return prisma.user.update(
            {
                where: { id },
                data: { access_token: "", token:""}
            }
        )
    }
}