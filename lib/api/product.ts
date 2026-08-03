import { Pagination, Product, ProductsResponse, RawProduct } from "../interface/inventory";


const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

function normalizeProduct(raw: RawProduct) : Product {
    return{
        ...raw,
        price: Number(raw.price)
    }
}

export interface FetchProductParams {
    page?:number;
    limit?:number;
    search?:string;
    categoryId?:string;
}

export interface FetchProductResult {
    products: Product[],
    pagination: Pagination,
}


export async function FetchProducts(params: FetchProductParams = {} ) : Promise<FetchProductResult> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', String(params.search))
    if (params.categoryId) query.set('categoryId', String(params.categoryId))
    

    const res = await fetch(`${BASE_URL}/api/v1/products?${query.toString()}`, { cache: 'no-store'})

    if (!res.ok){
        throw new Error("url not found")
    }

    const json : ProductsResponse = await res.json();

    if(!json.success){
        throw new Error(json.message ?? "API response (success: false)")
    }

    return {
        products: json.data.data.map(normalizeProduct),
        pagination: json.data.pagination
    }
}