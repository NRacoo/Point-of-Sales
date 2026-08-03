'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Printer, CheckCircle2, Clock, XCircle } from 'lucide-react';

type OrderStatus = 'completed' | 'pending' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#ORD-2024-001',
    date: 'Dec 8, 2024',
    time: '10:30 AM',
    customerName: 'John Doe',
    items: [
      { name: 'Almond Brown Croissant', quantity: 2, price: 34000 },
      { name: 'Coffee Latte', quantity: 1, price: 25000 },
    ],
    total: 93000,
    status: 'completed',
    paymentMethod: 'Cash',
  },
  {
    id: '2',
    orderNumber: '#ORD-2024-002',
    date: 'Dec 8, 2024',
    time: '11:15 AM',
    customerName: 'Jane Smith',
    items: [
      { name: 'Basic Croissant A La Pierre', quantity: 3, price: 32000 },
      { name: 'Sweet Granulated Sugar Croissant', quantity: 1, price: 38000 },
    ],
    total: 134000,
    status: 'pending',
    paymentMethod: 'Card',
  },
  {
    id: '3',
    orderNumber: '#ORD-2024-003',
    date: 'Dec 8, 2024',
    time: '09:45 AM',
    customerName: 'Mike Johnson',
    items: [
      { name: 'Blueberry Jam Croissant', quantity: 2, price: 32000 },
    ],
    total: 64000,
    status: 'completed',
    paymentMethod: 'Cash',
  },
  {
    id: '4',
    orderNumber: '#ORD-2024-004',
    date: 'Dec 8, 2024',
    time: '10:00 AM',
    customerName: 'Sarah Williams',
    items: [
      { name: 'Sweet Chocolate Croissant', quantity: 1, price: 34000 },
    ],
    total: 34000,
    status: 'cancelled',
    paymentMethod: 'Cash',
  },
  {
    id: '5',
    orderNumber: '#ORD-2024-005',
    date: 'Dec 8, 2024',
    time: '11:30 AM',
    customerName: 'Robert Brown',
    items: [
      { name: 'Strawberry Jam Croissant', quantity: 4, price: 32000 },
      { name: 'Coffee Latte', quantity: 2, price: 25000 },
    ],
    total: 178000,
    status: 'pending',
    paymentMethod: 'Card',
  },
];

export function Orders() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const formatCurrency = (value: number) => value.toLocaleString('id-ID');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Orders</h1>
        <p className="text-gray-500">Manage and track all customer orders</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedStatus === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedStatus === 'completed'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedStatus === 'pending'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setSelectedStatus('cancelled')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedStatus === 'cancelled'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cancelled
        </button>
      </div>


      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Order Number</th>
                <th className="px-6 py-3 text-left text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-gray-700">Date & Time</th>
                <th className="px-6 py-3 text-left text-gray-700">Items</th>
                <th className="px-6 py-3 text-left text-gray-700">Total</th>
                <th className="px-6 py-3 text-left text-gray-700">Payment</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>{order.date}</div>
                    <div className="text-sm text-gray-500">{order.time}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.items.length} items</td>
                <td className="px-6 py-4 text-gray-900">Rp. {formatCurrency(order.total)}</td>
                <td className="px-6 py-4 text-gray-600">{order.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="text-gray-900">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="text-gray-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="text-gray-900">{selectedOrder.date} at {selectedOrder.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="text-gray-900">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <div className="text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-gray-900">Rp. {formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">Rp. {formatCurrency(selectedOrder.total)}</span>
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
