"use client"

import { FetchProducts } from "@/lib/api/product";
import { Product } from "@/lib/interface/inventory"
import { useCallback, useEffect, useState } from "react";

interface UseProductResult {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProducts() : UseProductResult {
    const [ products, setProducts ] = useState<Product[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<string| null>(null);
    const [ reloadKey, setReloadkey ] = useState(0);

    const refetch = useCallback(() => setReloadkey((key) => key + 1), []);

    useEffect(() => {
        let isMounted = true;

        async function load(){
            setIsLoading(true)
            setError(null)

            try {
                const{ products } = await FetchProducts({limit: 100})
                if(isMounted) setProducts(products);
                
            } catch (error) {
                if(isMounted){
                    setError(error instanceof Error ? error.message : "failed to fetch products")
                }
            }finally{
                if(isMounted) setIsLoading(false)
            }

        }

        load()
        return () => {
            isMounted = false;
        }
    }, [reloadKey]);

    return { products, isLoading, error, refetch }

}