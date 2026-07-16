import { prisma } from "@/lib/prisma"


export const CategoryService = {
    async create(data:{
        category_name:string
    }){
        const existing = await prisma.category.findUnique({
            where: { category_name : data.category_name}
        });

        if(existing){
            throw new Error("Category name already exist")
        }

        return prisma.category.create({
            data:{ category_name: data.category_name}
        })
    },

    async findAll(){
        return prisma.category.findMany({
            include:{
                product:true,
            },
            orderBy:{ category_name: "asc"}
        });
    },

    async findById(id:string){
        return prisma.category.findUnique({
            where: { id },
            include: {
                product: true,
            }
        });
    },

    async findByName(category_name:string){
        return prisma.category.findUnique({
            where: { category_name },
            include: {
                product: true,
            }
        });
    },

    async update(id:string, data: Partial< { category_name:string }>){
        if (data.category_name){
            const existing = await this.findByName(data.category_name);

            if(existing && existing.id !== id){
                throw new Error("category name already existed");
            };
        };

        return prisma.category.update({
            where: { id },
            data,
        });
    },

    async delete(id:string){
        const category = await this.findById(id);
        if(!category) throw new Error("category not found");
        if(category.product.length > 0){
            throw new Error("cannot delete category with existing products")
        }

        return prisma.category.delete({ where: { id }});
    }
}