import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { OrderService } from '../../services/order.service.js';
import { PaymentService } from '../../services/payment.service.js';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pickupOption, setPickupOption] = useState<number>(20); // 20 mins default
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MOCK' | 'UPI' | 'CARD'>('MOCK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock Payment Gateway Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentSession, setActivePaymentSession] = useState<any>(null);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  if (items.length === 0 && !createdOrder) {
    navigate('/student/menu');
    return null;
  }

  const handleCreateOrder = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const pickupTime = new Date(Date.now() + pickupOption * 60000).toISOString();

      // Step 1: Create Order in DB
      const order = await OrderService.create({
        items: items.map((i) => ({ foodItemId: i.food.id, quantity: i.quantity })),
        pickupTime,
        paymentMethod,
        notes: notes.trim() || undefined,
      });

      setCreatedOrder(order);

      // Step 2: Initiate Payment session via PaymentService abstraction
      const paymentSession = await PaymentService.initiate(order.id, paymentMethod);
      setActivePaymentSession(paymentSession);
      setPaymentModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPayment = async (simulateFailure = false) => {
    if (!createdOrder || !activePaymentSession) return;
    setVerifying(true);
    setError(null);

    try {
      // Server-side verification request
      const verifyRes = await PaymentService.verify({
        orderId: createdOrder.id,
        transactionReference: activePaymentSession.transactionReference,
        signature: activePaymentSession.verificationPayload?.token,
        simulatedStatus: simulateFailure ? 'FAILED' : 'SUCCESS',
      });

      if (verifyRes.success) {
        clearCart();
        navigate(`/student/order-success/${createdOrder.id}`);
      } else {
        setError(verifyRes.message || 'Payment verification rejected');
        setPaymentModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      setPaymentModalOpen(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Complete Your Order</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Canteen Checkout</h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form: Pickup & Notes */}
        <div className="md:col-span-7 space-y-6">
          {/* Pickup Timing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" /> Choose Pickup Time
            </h3>
            <p className="text-xs text-slate-500">When would you like to collect your order at the counter?</p>

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {[
                { mins: 15, label: 'In 15 Mins' },
                { mins: 25, label: 'In 25 Mins' },
                { mins: 40, label: 'In 40 Mins' },
              ].map((opt) => (
                <button
                  key={opt.mins}
                  type="button"
                  onClick={() => setPickupOption(opt.mins)}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all ${
                    pickupOption === opt.mins
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Digital Payment Method
            </h3>
            <p className="text-xs text-slate-500">Secure digital transaction (simulated for academic project viva)</p>

            <div className="space-y-2 pt-2">
              {[
                { id: 'MOCK', name: 'Mock Fast Payment Sandbox', desc: '1-Click instant payment simulation', icon: <ShieldCheck className="w-4 h-4 text-brand-500" /> },
                { id: 'UPI', name: 'UPI Gateway Simulation', desc: 'GooglePay / PhonePe / Paytm mock QR', icon: <QrCode className="w-4 h-4 text-emerald-500" /> },
                { id: 'CARD', name: 'Debit / Credit Card Simulation', desc: 'Secure test card mock verification', icon: <CreditCard className="w-4 h-4 text-blue-500" /> },
              ].map((m) => (
                <label
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as any)}
                    className="mt-1 text-brand-500 focus:ring-brand-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {m.icon}
                      <span className="text-xs font-bold text-slate-800">{m.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Kitchen Special Notes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Special Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Less spicy, extra chutney, separate packing"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Right Order Review & CTA */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Review
            </h3>

            <div className="divide-y divide-slate-50 max-h-56 overflow-y-auto space-y-2">
              {items.map((i) => (
                <div key={i.food.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{i.food.name}</p>
                    <span className="text-[11px] text-slate-400">Qty: {i.quantity} × ₹{i.food.price}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{i.food.price * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Canteen Pickup</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                <span>Total Due</span>
                <span className="text-xl font-black text-brand-600">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Creating Order...' : `Pay ₹${totalAmount} Now`} <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Student: <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      {paymentModalOpen && activePaymentSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">CampusBite Digital Payment Gateway</h3>
              <p className="text-xs text-slate-500">Transaction Ref: {activePaymentSession.transactionReference}</p>
            </div>

            {/* Payment Details Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount to Pay</span>
              <div className="text-3xl font-black text-brand-600">₹{activePaymentSession.amount}</div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-block">
                Provider: {activePaymentSession.provider}
              </span>
            </div>

            {/* Simulation controls */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleVerifyPayment(false)}
                disabled={verifying}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                {verifying ? 'Verifying Signature on Server...' : 'Confirm & Authorize Payment (Success)'}
              </button>

              <button
                onClick={() => handleVerifyPayment(true)}
                disabled={verifying}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Test Payment Failure Simulation
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Server-side cryptographic token verification guarantees payment integrity.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
