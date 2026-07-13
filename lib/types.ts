export type UserRole = 'admin' | 'cashier';

export interface AppUser {
  [x: string]: string;
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export type PaymentMethod = 'CASH' | 'EWALLET' | 'QRIS';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isActive: boolean;
  
}

export interface TransactionItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  cashierId: string;
  cashierName: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;            // input kasir
  paymentMethodDetected?: PaymentMethod;   // dari IoT/AI
  iotImageUrl?: string;                    // URL gambar kamera
  createdAt: string;                       // ISO string
  items: TransactionItem[];
}
