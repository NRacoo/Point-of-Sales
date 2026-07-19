export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Category {
  id: string;
  category_name: string;
}

export interface Product {
  id: string;
  product_name: string;
  categoryId: string;
  category: Category;
  stock: number;
  reorder_level: number;
  image: string;
  price: number;
  status: ProductStatus;
  last_updated: string;
  unit: string;
  storeId?: string | null;
}

// Bentuk mentah produk dari API (sebelum price di-Number()-kan / tanggal diformat)
export interface RawProduct extends Omit<Product, 'price'> {
  price: string | number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// GET /api/v1/products -> { success, data: { data: RawProduct[], pagination } }
export interface ProductsResponse {
  success: boolean;
  message?: string;
  data: {
    data: RawProduct[];
    pagination: Pagination;
  };
}

export const STATUS_META: Record<ProductStatus, { label: string; color: string }> = {
  in_stock: { label: 'In Stock', color: 'bg-green-100 text-green-700' },
  low_stock: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-700' },
};

export interface ProductFormState {
  product_name: string;
  categoryId: string;
  stock: string;
  unit: string;
  reorder_level: string;
}

export const emptyForm: ProductFormState = {
  product_name: '',
  categoryId: '',
  stock: '',
  unit: 'pcs',
  reorder_level: '',
};