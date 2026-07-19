import { useState, useMemo, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import {
  Category,
  Pagination,
  Product,
  ProductFormState,
  ProductsResponse,
  emptyForm,
} from '@/lib/types/inventory';
import type { ToastState } from '../components/Toast';

type ModalMode = 'add' | 'edit';

const DEFAULT_PAGINATION: Pagination = { page: 1, limit: 20, total: 0, totalPages: 1 };

interface UseInventoryOptions {
  storeId?: string;
}

export function useInventory({ storeId }: UseInventoryOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // modal add/edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [digits, setDigits] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // confirm add / delete
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // toast
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', type: 'success' });
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, type });
    window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
  }, []);
  const closeToast = useCallback(() => setToast((t) => ({ ...t, open: false })), []);

  // ---- Fetch products ----
  // Bentuk respons: { success, data: { data: RawProduct[], pagination } }
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams();
      if (storeId) params.set('storeId', storeId);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await fetch(`/api/v1/products?${params.toString()}`);
      const json: ProductsResponse = await res.json();
      if (!json.success) throw new Error(json.message || 'Gagal memuat data produk');

      const { data: rawProducts, pagination: pageInfo } = json.data;

      setProducts(
        rawProducts.map((p) => ({
          ...p,
          price: Number(p.price),
          last_updated: new Date(p.last_updated).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        }))
      );
      setPagination(pageInfo ?? DEFAULT_PAGINATION);
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }, [storeId, page, limit]);

  // ---- Fetch categories (untuk dropdown) ----
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/category');
      const json = await res.json();
      if (json.success) setCategories(json.data as Category[]);
    } catch {
      // kalau endpoint kategori belum ada, dropdown akan kosong—tidak fatal
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category?.category_name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const lowStockCount = useMemo(
    () => filteredProducts.filter((p) => p.status === 'low_stock').length,
    [filteredProducts]
  );
  const outOfStockCount = useMemo(
    () => filteredProducts.filter((p) => p.status === 'out_of_stock').length,
    [filteredProducts]
  );

  const resetForm = useCallback(() => {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' });
    setDigits('');
    setImageFile(null);
    setImagePreview(null);
  }, [categories]);

  const openAddModal = useCallback(() => {
    setModalMode('add');
    setEditingId(null);
    resetForm();
    setShowAddModal(true);
  }, [resetForm]);

  const openEditModal = useCallback((product: Product) => {
    setModalMode('edit');
    setEditingId(product.id);
    setForm({
      product_name: product.product_name,
      categoryId: product.categoryId,
      stock: String(product.stock),
      unit: product.unit,
      reorder_level: String(product.reorder_level),
    });
    setDigits(String(product.price));
    setImageFile(null);
    setImagePreview(product.image || null);
    setShowAddModal(true);
  }, []);

  const closeModal = useCallback(() => setShowAddModal(false), []);

  const handleImageChange = useCallback((file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }, []);

  const buildFormData = useCallback(() => {
    const fd = new FormData();
    fd.append('product_name', form.product_name.trim());
    fd.append('categoryId', form.categoryId);
    fd.append('stock', String(Number(form.stock || 0)));
    fd.append('reorder_level', String(Number(form.reorder_level || 0)));
    fd.append('price', String(Number(digits || 0)));
    fd.append('unit', form.unit.trim() || 'pcs');
    if (storeId) fd.append('storeId', storeId);
    if (imageFile) fd.append('image', imageFile);
    return fd;
  }, [form, digits, storeId, imageFile]);

  const handleConfirmAdd = useCallback(async () => {
    setSubmitting(true);
    try {
      const fd = buildFormData();
      const res = await fetch('/api/v1/products', { method: 'POST', body: fd });
      const json = await res.json();

      if (!json.success) {
        showToast(json.message || 'Gagal menambahkan item', 'error');
        return;
      }

      setShowConfirmAdd(false);
      setShowAddModal(false);
      resetForm();
      showToast('Item berhasil ditambahkan!');
      fetchProducts();
    } catch {
      showToast('Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [buildFormData, resetForm, showToast, fetchProducts]);

  const handleUpdate = useCallback(async () => {
    if (editingId == null) return;
    setSubmitting(true);
    try {
      const fd = buildFormData();
      const res = await fetch(`/api/v1/products/${editingId}`, { method: 'PATCH', body: fd });
      const json = await res.json();

      if (!json.success) {
        showToast(json.message || 'Gagal memperbarui item', 'error');
        return;
      }

      setShowAddModal(false);
      showToast('Item berhasil diperbarui');
      fetchProducts();
    } catch {
      showToast('Terjadi kesalahan saat memperbarui', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [editingId, buildFormData, showToast, fetchProducts]);

  // submit: ADD -> buka confirm dulu, EDIT -> langsung PATCH
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!form.product_name.trim()) {
        showToast('Nama produk wajib diisi', 'error');
        return;
      }
      if (!form.categoryId) {
        showToast('Kategori wajib dipilih', 'error');
        return;
      }
      if (modalMode === 'add' && !imageFile) {
        showToast('Gambar produk wajib diunggah', 'error');
        return;
      }

      if (modalMode === 'add') {
        setShowConfirmAdd(true);
        return;
      }

      handleUpdate();
    },
    [form, modalMode, imageFile, showToast, handleUpdate]
  );

  const askDelete = useCallback((id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const cancelDelete = useCallback(() => setShowDeleteConfirm(false), []);
  const cancelConfirmAdd = useCallback(() => setShowConfirmAdd(false), []);

  const confirmDelete = useCallback(async () => {
    if (deleteId == null) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/products/${deleteId}`, { method: 'DELETE' });
      const json = await res.json();

      if (!json.success) {
        showToast(json.message || 'Gagal menghapus item', 'error');
        return;
      }

      setShowDeleteConfirm(false);
      setDeleteId(null);
      showToast('Item berhasil dihapus');
      fetchProducts();
    } catch {
      showToast('Terjadi kesalahan saat menghapus', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [deleteId, showToast, fetchProducts]);

  return {
    // data
    filteredProducts,
    categories,
    pagination,
    lowStockCount,
    outOfStockCount,
    loading,
    errorMsg,
    submitting,
    searchQuery,
    setSearchQuery,
    setPage,

    // add/edit modal
    showAddModal,
    modalMode,
    form,
    setForm,
    digits,
    setDigits,
    imagePreview,
    openAddModal,
    openEditModal,
    closeModal,
    handleImageChange,
    handleSubmit,

    // confirm add
    showConfirmAdd,
    cancelConfirmAdd,
    handleConfirmAdd,

    // delete
    showDeleteConfirm,
    askDelete,
    cancelDelete,
    confirmDelete,

    // toast
    toast,
    closeToast,
  };
}