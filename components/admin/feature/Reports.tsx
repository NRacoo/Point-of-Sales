'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, type PieLabelRenderProps } from 'recharts';

const salesData = [
  { name: 'Mon', sales: 4200000 },
  { name: 'Tue', sales: 3800000 },
  { name: 'Wed', sales: 5200000 },
  { name: 'Thu', sales: 4600000 },
  { name: 'Fri', sales: 6100000 },
  { name: 'Sat', sales: 7300000 },
  { name: 'Sun', sales: 6800000 },
];

const categoryData = [
  { name: 'Croissant', value: 45, color: '#FF6B35' },
  { name: 'Coffee', value: 25, color: '#F7931E' },
  { name: 'Waffle', value: 15, color: '#FDC830' },
  { name: 'Ice Cream', value: 10, color: '#37B7C3' },
  { name: 'Others', value: 5, color: '#088395' },
];

const topProducts = [
  { name: 'Almond Brown Croissant', sold: 145, revenue: 4930000 },
  { name: 'Sweet Chocolate Croissant', sold: 132, revenue: 4488000 },
  { name: 'Coffee Latte', sold: 198, revenue: 4950000 },
  { name: 'Basic Croissant A La Pierre', sold: 128, revenue: 4096000 },
  { name: 'Strawberry Jam Croissant', sold: 115, revenue: 3680000 },
];

type TimeRange = 'today' | 'week' | 'month' | 'year';

export function Reports() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const formatCurrency = (value: number) => value.toLocaleString('id-ID');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Sales Reports & Analytics</h1>
        <p className="text-gray-500">Track your business performance and insights</p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setTimeRange('today')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'today'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'week'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'month'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeRange('year')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'year'
              ? 'bg-orange-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          This Year
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>12.5%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <h3 className="text-gray-900">Rp. 38,200,000</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>8.2%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <h3 className="text-gray-900">1,245</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>3.1%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Customers</p>
          <h3 className="text-gray-900">892</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>15.3%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Avg. Order Value</p>
          <h3 className="text-gray-900">Rp. 30,680</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-6">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => `Rp. ${formatCurrency(value)}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="sales" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-6">Sales by Category</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => `${props.name ?? ''}: ${props.value ?? 0}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Sales Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <h3 className="text-gray-900 mb-6">Daily Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
              <Tooltip
              formatter={(value: number) => `Rp. ${formatCurrency(value)}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="sales" fill="#FF6B35" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Rank</th>
                <th className="px-6 py-3 text-left text-gray-700">Product Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Units Sold</th>
                <th className="px-6 py-3 text-left text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">{product.sold} units</td>
                  <td className="px-6 py-4 text-gray-900">Rp. {formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
