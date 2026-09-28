'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentApi, Payment, CreatePaymentRequest } from '@/lib/payment-api';
import { saleApi, Sale } from '@/lib/sale-api';
import { purchaseApi, Purchase } from '@/lib/purchase-api';
import { useAuthStore } from '@/store/auth-store';
import {
  CreditCard, Plus, Search, Filter, Trash2, CheckCircle2,
  AlertCircle, X, DollarSign, ArrowDownLeft, ArrowUpRight
} from 'lucide-react';

export default function PaymentsPage() {
  const { hasRole } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'SALE' | 'PURCHASE'>('ALL');
  const [search, setSearch] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [refType, setRefType] = useState<'SALE' | 'PURCHASE'>('SALE');
  const [selectedRefId, setSelectedRefId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pmts, allSales, allPurchases] = await Promise.all([
        paymentApi.getAll(),
        saleApi.getAll(),
        purchaseApi.getAll(),
      ]);
      setPayments(pmts);
      setSales(allSales);
      setPurchases(allPurchases);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTransactionChange = (id: string) => {
    setSelectedRefId(id);
    if (refType === 'SALE') {
      const s = sales.find(item => item.id === id);
      if (s?.totalAmount) setAmount(s.totalAmount);
    } else {
      const p = purchases.find(item => item.id === id);
      if (p?.totalAmount) setAmount(p.totalAmount);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefId) {
      setError('Please select a transaction to attach payment to');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Payment amount must be greater than zero');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await paymentApi.create({
        referenceType: refType,
        referenceId: selectedRefId,
        amount: Number(amount),
        paymentMethod,
        paymentDate,
        note: note.trim() || undefined,
      });
      setShowModal(false);
      setSelectedRefId('');
      setAmount('');
      setNote('');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      await paymentApi.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete payment');
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const totalSalePayments = payments
    .filter(p => p.referenceType === 'SALE')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPurchasePayments = payments
    .filter(p => p.referenceType === 'PURCHASE')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredPayments = payments
    .filter(p => filterType === 'ALL' || p.referenceType === filterType)
    .filter(p =>
      p.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
      (p.note && p.note.toLowerCase().includes(search.toLowerCase())) ||
      p.referenceId.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} color="#6366f1" />
            Payment Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            Record and track inflows from sales and outflows to supplier purchases.
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setError(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#ffffff', fontSize: '13px', fontWeight: '600',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px', marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#10b981' }}>
            <ArrowDownLeft size={18} />
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Inflow (Customer Sales)</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(totalSalePayments)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {payments.filter(p => p.referenceType === 'SALE').length} customer payments
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f59e0b' }}>
            <ArrowUpRight size={18} />
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Outflow (Supplier Orders)</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(totalPurchasePayments)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {payments.filter(p => p.referenceType === 'PURCHASE').length} supplier payments
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-light)' }}>
            <DollarSign size={18} />
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Net Recorded Cashflow</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: totalSalePayments - totalPurchasePayments >= 0 ? '#10b981' : '#f87171' }}>
            {formatCurrency(totalSalePayments - totalPurchasePayments)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Net liquidity from settled invoices
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search payments by method, note, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ALL', 'SALE', 'PURCHASE'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', border: '1px solid',
                background: filterType === type ? 'var(--primary)' : 'var(--bg-subtle)',
                color: filterType === type ? '#ffffff' : 'var(--text-secondary)',
                borderColor: filterType === type ? 'var(--primary)' : 'var(--border-subtle)',
              }}
            >
              {type === 'ALL' ? 'All Transactions' : type === 'SALE' ? 'Sales (Customer)' : 'Purchases (Supplier)'}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 18px' }}>Date</th>
                <th style={{ padding: '14px 18px' }}>Type</th>
                <th style={{ padding: '14px 18px' }}>Reference</th>
                <th style={{ padding: '14px 18px' }}>Method</th>
                <th style={{ padding: '14px 18px' }}>Amount</th>
                <th style={{ padding: '14px 18px' }}>Note</th>
                {hasRole('ADMIN') && <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                    <CreditCard size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>No payments found</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Recorded payments will be listed here.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => {
                  const saleRef = p.referenceType === 'SALE' ? sales.find(s => s.id === p.referenceId) : null;
                  const purchaseRef = p.referenceType === 'PURCHASE' ? purchases.find(pr => pr.id === p.referenceId) : null;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {p.paymentDate}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px',
                          background: p.referenceType === 'SALE' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: p.referenceType === 'SALE' ? '#34d399' : '#fbbf24',
                        }}>
                          {p.referenceType === 'SALE' ? 'Customer Sale' : 'Supplier Purchase'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                        {saleRef?.invoiceCode || purchaseRef?.referenceCode || p.referenceId.slice(0, 8)}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: '600', padding: '2px 7px', borderRadius: '4px',
                          background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
                        }}>
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td style={{
                        padding: '14px 18px', fontWeight: '700',
                        color: p.referenceType === 'SALE' ? '#10b981' : '#f59e0b',
                      }}>
                        {p.referenceType === 'SALE' ? '+' : '-'}{formatCurrency(p.amount)}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                        {p.note || '—'}
                      </td>
                      {hasRole('ADMIN') && (
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(p.id)}
                            style={{
                              background: 'none', border: 'none', color: '#f87171',
                              cursor: 'pointer', padding: '4px', borderRadius: '4px',
                            }}
                            title="Delete payment"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div className="glass-card animate-scale-up" style={{
            width: '100%', maxWidth: '540px', padding: '24px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--primary-light)" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Record Payment
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePayment}>
              {/* Reference Type Toggle */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Payment For *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setRefType('SALE'); setSelectedRefId(''); }}
                    style={{
                      padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', border: '1px solid',
                      background: refType === 'SALE' ? 'rgba(16,185,129,0.15)' : 'var(--bg-subtle)',
                      color: refType === 'SALE' ? '#34d399' : 'var(--text-secondary)',
                      borderColor: refType === 'SALE' ? '#10b981' : 'var(--border-subtle)',
                    }}
                  >
                    Customer Sale (Inflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRefType('PURCHASE'); setSelectedRefId(''); }}
                    style={{
                      padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', border: '1px solid',
                      background: refType === 'PURCHASE' ? 'rgba(245,158,11,0.15)' : 'var(--bg-subtle)',
                      color: refType === 'PURCHASE' ? '#fbbf24' : 'var(--text-secondary)',
                      borderColor: refType === 'PURCHASE' ? '#f59e0b' : 'var(--border-subtle)',
                    }}
                  >
                    Supplier Purchase (Outflow)
                  </button>
                </div>
              </div>

              {/* Transaction Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Select {refType === 'SALE' ? 'Sale Invoice' : 'Purchase Order'} *
                </label>
                <select
                  value={selectedRefId}
                  onChange={e => handleTransactionChange(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                >
                  <option value="">-- Choose transaction --</option>
                  {refType === 'SALE' ? (
                    sales.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.invoiceCode || s.id.slice(0, 8)} • {s.saleDate} • {s.customerName || 'Walk-in'} • {formatCurrency(s.totalAmount)}
                      </option>
                    ))
                  ) : (
                    purchases.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.referenceCode || p.id.slice(0, 8)} • {p.purchaseDate} • {p.supplierName || 'Supplier'} • {formatCurrency(p.totalAmount)}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Amount and Method */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Payment Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0.00"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer (ABA / Wire)</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>

              {/* Note */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Reference Note / Transaction Ref
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Receipt #4092, ABA transfer ref..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '9px 16px', borderRadius: '8px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !selectedRefId}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#ffffff', fontSize: '13px', fontWeight: '600',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {saving ? 'Recording...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
