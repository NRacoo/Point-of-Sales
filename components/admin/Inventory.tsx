'use client';

import { InventoryStats } from './components/InventoryStats';
import { InventoryTable } from './components/InventoryTable';
import { ProductFormModal } from './components/ProductFormModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { useInventory } from './hooks/UseInventory';

interface InventoryProps {
  storeId?: string;
}

export function Inventory({ storeId }: InventoryProps) {
  const inv = useInventory({ storeId });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Inventory Management</h1>
        <p className="text-gray-500">Track and manage your product stock levels</p>
      </div>

      {inv.errorMsg && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <span className="text-sm">{inv.errorMsg}</span>
        </div>
      )}

      <InventoryStats total={inv.pagination.total} lowStock={inv.lowStockCount} outOfStock={inv.outOfStockCount} />

      <InventoryTable
        products={inv.filteredProducts}
        loading={inv.loading}
        searchQuery={inv.searchQuery}
        pagination={inv.pagination}
        onSearchChange={inv.setSearchQuery}
        onAddClick={inv.openAddModal}
        onEditClick={inv.openEditModal}
        onDeleteClick={inv.askDelete}
        onPageChange={inv.setPage}
      />

      <ProductFormModal
        open={inv.showAddModal}
        mode={inv.modalMode}
        form={inv.form}
        digits={inv.digits}
        categories={inv.categories}
        imagePreview={inv.imagePreview}
        submitting={inv.submitting}
        onClose={inv.closeModal}
        onFormChange={inv.setForm}
        onDigitsChange={inv.setDigits}
        onImageChange={inv.handleImageChange}
        onSubmit={inv.handleSubmit}
      />

      <ConfirmDialog
        open={inv.showConfirmAdd}
        title="Konfirmasi"
        description="Apakah Anda yakin ingin menambahkan barang ini?"
        confirmLabel="Ya, Tambahkan"
        confirmingLabel="Menyimpan..."
        cancelLabel="Tidak"
        submitting={inv.submitting}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
        confirmColor="bg-green-500 hover:bg-green-600"
        zIndexClass="z-[60]"
        onCancel={inv.cancelConfirmAdd}
        onConfirm={inv.handleConfirmAdd}
      />

      <ConfirmDialog
        open={inv.showDeleteConfirm}
        title="Hapus Item"
        description="Yakin ingin menghapus item ini?"
        confirmLabel="Ya, Hapus"
        confirmingLabel="Menghapus..."
        cancelLabel="Batal"
        submitting={inv.submitting}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        confirmColor="bg-red-600 hover:bg-red-700"
        zIndexClass="z-[70]"
        onCancel={inv.cancelDelete}
        onConfirm={inv.confirmDelete}
      />

      <Toast toast={inv.toast} onClose={inv.closeToast} />
    </div>
  );
}