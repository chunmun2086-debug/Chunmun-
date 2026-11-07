import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceBooking, closeInvoice, lang } = useApp();

  if (!activeInvoiceBooking) return null;

  const b = activeInvoiceBooking;
  const halfGst = Math.round((b.gstAmount / 2) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Modal Controls Top Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tax Invoice & Receipt
            </span>
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
              {b.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={closeInvoice}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Invoice Paper Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200 text-xs">
          {/* Header Brand & GSTIN */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xl font-black tracking-tight text-blue-900 dark:text-white flex items-center gap-1.5">
                GHAR <span className="text-orange-600">SEVA</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ghar Seva Technologies India Pvt. Ltd.
              </p>
              <p className="text-[10px] text-slate-500">
                Tower 3, Global Tech Park, Bengaluru, Karnataka - 560103
              </p>
              <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-1">
                GSTIN: <span className="font-bold">29AAACG8912P1ZK</span> · SAC: <span className="font-bold">9987</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {b.paymentStatus === 'paid' ? 'PAID & VERIFIED' : 'PAYMENT DUE'}
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-2">
                Invoice #: {b.invoiceNumber}
              </p>
              <p className="text-[11px] text-slate-500">
                Date: {new Date(b.createdAt).toLocaleDateString()}
              </p>
              <p className="text-[11px] text-slate-500">
                Booking ID: {b.id}
              </p>
            </div>
          </div>

          {/* Billed To / Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Customer)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {b.customerName}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">{b.customerPhone}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {b.address.street}, {b.address.landmark}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {b.address.city} - {b.address.pincode}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Service Provider (Partner)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {b.assignedProviderName || 'Certified Ghar Seva Pro'}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Phone: {b.assignedProviderPhone || '+91 98765 43210'}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Payment Mode: <span className="font-bold uppercase font-mono">{b.paymentMethod}</span>
              </p>
              {b.paymentTransactionId && (
                <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  Txn ID: {b.paymentTransactionId}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="pb-2 font-bold">Service Description</th>
                  <th className="pb-2 font-bold text-center">SAC Code</th>
                  <th className="pb-2 font-bold text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5">
                    <span className="font-bold block text-slate-900 dark:text-white">
                      {b.serviceNameEn}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard labor & professional repair work
                    </span>
                  </td>
                  <td className="py-2.5 text-center font-mono">9987</td>
                  <td className="py-2.5 text-right font-mono font-semibold">₹{b.basePrice}</td>
                </tr>

                {b.extraCharges > 0 && (
                  <tr>
                    <td className="py-2.5">
                      <span className="font-semibold block text-slate-900 dark:text-white">
                        {b.isEmergency ? 'Emergency Priority Dispatch Surcharge' : 'Safety Inspection & Sanitation Fee'}
                      </span>
                    </td>
                    <td className="py-2.5 text-center font-mono">9987</td>
                    <td className="py-2.5 text-right font-mono font-semibold">₹{b.extraCharges}</td>
                  </tr>
                )}

                {b.discount > 0 && (
                  <tr>
                    <td className="py-2.5 text-emerald-600">
                      <span className="font-semibold block">
                        Promotional Discount ({b.couponCode || 'PROMO'})
                      </span>
                    </td>
                    <td className="py-2.5 text-center font-mono text-emerald-600">-</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">
                      -₹{b.discount}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tax Calculations */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (Net):</span>
                <span className="font-mono">
                  ₹{Math.max(0, b.basePrice + b.extraCharges - b.discount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST (9%):</span>
                <span className="font-mono">₹{halfGst}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST (9%):</span>
                <span className="font-mono">₹{halfGst}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-blue-700 dark:text-blue-400">
                  ₹{b.totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee & Terms */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] text-slate-500 leading-relaxed border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-slate-700 dark:text-slate-300 mb-0.5">
              GHAR SEVA 30-DAY WARRANTY CLAUSE:
            </p>
            This service comes with a 30-day comprehensive rework guarantee. If any defect reoccurs within 30 days of completion, Ghar Seva will dispatch a certified technician for a complimentary inspection and rework. For disputes, contact support@gharseva.in.
          </div>
        </div>

      </div>
    </div>
  );
};
