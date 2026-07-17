interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  price: number;
  lastUpdated: string;
}

interface ApiProduct {
  id: string;
  product_name: string;
  category?: { id: string; name: string } | null;
  categoryId: string;
  stock: number;
  unit: string;
  reorder_level: number;
  price: number;
  image?: string;
  updatedAt: string;
}

// mapping API -> shape yang dipakai tabel
function mapApiToInventory(p: ApiProduct): InventoryItem {
  return {
    id: Number(p.id) || p.id as any, // sesuaikan kalau id kamu string (cuid), ubah InventoryItem.id jadi string
    name: p.product_name,
    category: p.category?.name ?? p.categoryId,
    stock: p.stock,
    unit: p.unit,
    reorderLevel: p.reorder_level,
    price: p.price,
    lastUpdated: new Date(p.updatedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }),
  };
}