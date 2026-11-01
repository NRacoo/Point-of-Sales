"use client";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Banknote,
  QrCode,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import { METHOD_LABEL, UI_METHOD_TO_DB } from "@/lib/api/iot";
import { createOrder, updateOrderStatus } from "@/lib/api/order";
import { IotDetectionPanel } from "@/components/cashier/IotDetectionPanel";
import { useIotDetection } from "@/components/cashier/useIotDetection";

type PaymentMethod = "cash" | "card" | "e-wallet" | "qris";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProcessPaymentProps {
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  onBack: () => void;
  onPaymentComplete: () => void;
}

export function ProcessPayment({
  orderItems,
  subtotal,
  tax,
  total,
  customerName = "Walk-in Customer",
  onBack,
  onPaymentComplete,
}: ProcessPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [cashReceived, setCashReceived] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [walletPhone, setWalletPhone] = useState("");
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detection = useIotDetection();

  const cashAmount = Number(cashReceived) || 0;
  const change = cashAmount - total;

  const quickCashAmounts = [50000, 100000, 150000, 200000, 500000];

  /**
   * Memilih metode akan membuat order (status pending) lalu meminta
   * Raspberry Pi mulai mendeteksi pembayaran. Order dibuat sekali saja,
   * ganti metode cukup mengirim ulang trigger deteksi.
   */
  const handleSelectMethod = async (method: PaymentMethod) => {
    setSelectedMethod(method);
    setSubmitError(null);
    detection.reset();

    if (!orderItems.length) return;

    const dbMethod = UI_METHOD_TO_DB[method];

    try {
      let id = orderId;

      if (!id) {
        const order = await createOrder({
          customer_name: customerName,
          payment_method: dbMethod,
          items: orderItems.map((item) => ({
            productId: item.id,
            quantity: String(item.quantity),
          })),
        });
        id = order.id;
        setOrderId(id);
      }

      await detection.arm(id, dbMethod);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyiapkan pembayaran"
      );
    }
  };

  const handlePayment = async () => {
    if (selectedMethod === "cash" && cashAmount < total) {
      alert("Insufficient cash amount");
      return;
    }

    // Metode terdeteksi berbeda dari pilihan kasir: minta konfirmasi dulu.
    if (detection.log?.status === "mismatch") {
      const proceed = confirm(
        "Metode pembayaran yang terdeteksi perangkat berbeda dengan pilihan kasir. Lanjutkan menyelesaikan transaksi?"
      );
      if (!proceed) return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (orderId) {
        await updateOrderStatus(orderId, "completed");
      }
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyelesaikan pembayaran"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickCash = (amount: number) => {
    setCashReceived(amount.toString());
  };

  const formatRupiahInput = (value: string) => {
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) return "";
    return `Rp. ${numericValue.toLocaleString("id-ID")}`;
  };

  const handleCashReceivedChange = (value: string) => {
    const numericOnly = value.replace(/\D/g, "");
    setCashReceived(numericOnly);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md w-full shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">
            Transaction completed successfully
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Paid</span>
              <span className="text-gray-900">
                Rp. {total.toLocaleString()}
              </span>
            </div>
            {selectedMethod === "cash" && change > 0 && (
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Change</span>
                <span className="text-green-600">
                  Rp. {change.toLocaleString()}
                </span>
              </div>
            )}
            {detection.log?.method_detected && (
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Detected (IoT)</span>
                <span
                  className={
                    detection.log.matched ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {METHOD_LABEL[detection.log.method_detected]}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onPaymentComplete}
            className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setShowBackConfirm(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-gray-900">Process Payment</h1>
            <p className="text-gray-500">
              Select payment method and complete transaction
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-gray-900 mb-4">Select Payment Method</h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectMethod("cash")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === "cash"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Banknote
                    className={`w-8 h-8 mb-2 ${
                      selectedMethod === "cash"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-gray-900">Cash</div>
                  <div className="text-sm text-gray-500">Physical money</div>
                </button>

                <button
                  onClick={() => handleSelectMethod("card")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === "card"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard
                    className={`w-8 h-8 mb-2 ${
                      selectedMethod === "card"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-gray-900">Debit/Credit Card</div>
                  <div className="text-sm text-gray-500">Card payment</div>
                </button>

                <button
                  onClick={() => handleSelectMethod("e-wallet")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === "e-wallet"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Wallet
                    className={`w-8 h-8 mb-2 ${
                      selectedMethod === "e-wallet"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-gray-900">E-Wallet</div>
                  <div className="text-sm text-gray-500">OVO, GoPay, Dana</div>
                </button>

                <button
                  onClick={() => handleSelectMethod("qris")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === "qris"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <QrCode
                    className={`w-8 h-8 mb-2 ${
                      selectedMethod === "qris"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-gray-900">QRIS</div>
                  <div className="text-sm text-gray-500">Scan QR code</div>
                </button>
              </div>

              {selectedMethod && (
                <div className="mt-4 space-y-3">
                  {detection.isArming && (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                      <p className="text-sm text-gray-700">
                        Menyiapkan deteksi pembayaran...
                      </p>
                    </div>
                  )}

                  {!detection.isArming && (
                    <IotDetectionPanel
                      log={detection.log}
                      error={detection.error}
                      onRetry={() => handleSelectMethod(selectedMethod)}
                    />
                  )}
                </div>
              )}
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {submitError}
              </div>
            )}

            {/* Payment Details Based on Method */}
            {selectedMethod === "cash" && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-gray-900 mb-4">Cash Payment</h3>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Cash Received
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatRupiahInput(cashReceived)}
                    onChange={(e) => handleCashReceivedChange(e.target.value)}
                    placeholder="Rp. 0"
                    className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Quick Amount
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {quickCashAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleQuickCash(amount)}
                        className="py-2 px-3 text-gray-500 border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-sm"
                      >
                        {(amount / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {cashAmount > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-gray-900">
                        Rp. {total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cash Received</span>
                      <span className="text-gray-900">
                        Rp. {cashAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Change</span>
                      <span
                        className={`${
                          change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        Rp. {change >= 0 ? change.toLocaleString() : "0"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedMethod === "card" && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-gray-900 mb-4">Card Payment</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="**** **** **** ****"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="***"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    💳 Insert or tap card on the card reader to process payment
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "e-wallet" && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-gray-900 mb-4">E-Wallet Payment</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="08xx xxxx xxxx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors">
                      <div className="text-purple-600 mb-1">OVO</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors">
                      <div className="text-green-600 mb-1">GoPay</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors">
                      <div className="text-blue-600 mb-1">Dana</div>
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    📱 Customer will receive a payment notification on their
                    phone
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "qris" && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-gray-900 mb-4">QRIS Payment</h3>

                <div className="text-center">
                  <div className="w-64 h-64 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    Scan QR code with any e-wallet app
                  </p>
                  <p className="text-sm text-gray-500">
                    OVO, GoPay, Dana, LinkAja, ShopeePay, etc.
                  </p>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    📱 Waiting for customer to scan and confirm payment...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-8">
              <h3 className="text-gray-900 mb-4">Order Summary</h3>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="text-gray-900 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity}x Rp. {item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-gray-900 text-sm">
                      Rp. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>Rp. {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    Rp. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Process Payment Button */}
              <button
                onClick={handlePayment}
                disabled={
                  !selectedMethod ||
                  isSubmitting ||
                  (selectedMethod === "cash" && cashAmount < total)
                }
                className="w-full mt-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? "Processing..."
                  : selectedMethod === "cash" && cashAmount < total
                  ? "Insufficient Amount"
                  : "Complete Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-gray-900 mb-1">Konfirmasi</h3>
                <p className="text-gray-600 text-sm">
                  Apakah anda yakin ingin kembali?
                </p>
              </div>
              <button
                onClick={() => setShowBackConfirm(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowBackConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                Ya, kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
