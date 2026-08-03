import { Product } from "../interface/inventory";

export interface PosProduct {
    id: string;
    name: string;
    description:string;
    price: number;
    image:string;
    category: string;
    soldOut: boolean;
    stock: number;
}

export interface CartItem {
    product: PosProduct;
    quantity:number;
}

export function toPosProduct (product: Product) {
    return {
        id: product.id,
        name: product.product_name,
        description: product.category?.category_name ?? ' ',
        price: product.price,
        image: product.image,
        category: product.category?.category_name.toLowerCase() ?? "uncategorized",
        soldOut: product.status === 'out_of_stock' || product.stock <= 0,
        stock: product.stock
    }
}