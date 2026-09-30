'use client';

import { useState, useEffect, useCallback } from 'react';
import { saleApi, Sale } from '@/lib/sale-api';
import { customerApi, Customer } from '@/lib/customer-api';
import { productApi, Product } from '@/lib/product-api';
import { lookupApi, Currency } from '@/lib/lookup-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Receipt, Plus, X, AlertCircle, Search, RefreshCw,
  Trash2, DollarSign, Ban, CheckCircle2, ClipboardList
} from 'lucide-react';

// ─── Sale Form (Create Sale) ──────────────────────────────────────────────────
function CreateSaleModal({
  customers,
  products,
  onClose,
  onSaved,
}: {
  customers: Customer[];
  products: Product[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [customerId, setCustomerId] = useState('');
  const [invoiceCode, setInvoiceCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [discount, setDiscount] = useState('0');
  const [note, setNote] = useState('');
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [lines, setLines] = useState([{ productId: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    lookupApi.getCurrencies().then(setAvailableCurrencies).catch(() => {});
  }, []);

  const addLine = () => setLines(l => [...l, { productId: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, key: string, val: unknown) =>
    setLines(l => l.map((line, idx) => idx === i ? { ...line, [key]: val } : line));

  const onProductChange = (i: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    setLines(l => l.map((line, idx) => idx === i
      ? { ...line, productId, unitPrice: prod?.price ?? 0 }
      : line));
  };

  const subtotal = lines.reduce((acc, l) => acc + (l.unitPrice * l.quantity - l.discount), 0);
  const total = Math.max(0, subtotal - parseFloat(discount || '0'));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.some(l => !l.productId)) { setError('Please select a product for all lines'); return; }
    setSaving(true); setError('');
    try {
      await saleApi.create({
        invoiceCode: invoiceCode || undefined,
        saleDate,
        customerId: customerId || undefined,
        currency,
        discount: parseFloat(discount || '0'),
        note: note || undefined,
        items: lines.map(l => ({ productId: l.productId, quantity: l.quantity, unitPrice: l.unitPrice, discount: l.discount })),
      });
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to create sale');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{t('newSaleInvoice')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        {error && <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, marginBottom: 16, color: '#f87171', fontSize: 13 }}><AlertCircle size={15} />{error}</div>}
        <form onSubmit={submit}>
          {/* Header fields */}
          <div className="form-grid-3">
            <div><label className="label">{t('invoiceNumber')}</label><input className="input-field" value={invoiceCode} onChange={e => setInvoiceCode(e.target.value)} placeholder="Auto-generated if blank" /></div>
            <div><label className="label">{t('date')} *</label><input className="input-field" type="date" required value={saleDate} onChange={e => setSaleDate(e.target.value)} /></div>
            <div><label className="label">{t('selectCustomer')}</label>
              <select className="input-field" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">{t('walkInOption')}</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="label">{t('currency')}</label>
              <select className="input-field" value={currency} onChange={e => setCurrency(e.target.value)}>
                {availableCurrencies.length > 0 ? (
                  availableCurrencies.map(c => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))
                ) : (
                  <>
                    <option value="USD">USD ($)</option>
                    <option value="KHR">KHR (៛)</option>
                  </>
                )}
              </select>
            </div>
            <div><label className="label">{t('overallDiscount')}</label><input className="input-field" type="number" step="0.01" min="0" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
            <div><label className="label">{t('note')}</label><input className="input-field" value={note} onChange={e => setNote(e.target.value)} /></div>
          </div>

          {/* Line items */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{t('lineItems')}</span>
              <button type="button" className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={addLine}><Plus size={13} /> {t('addLine')}</button>
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'var(--bg-card)' }}>
                  {[t('colProduct'), t('quantity'), t('unitPrice'), t('discount'), t('subtotal'), ''].map((h, idx) => (
                    <th key={idx} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {lines.map((line, i) => {
                    const sub = line.unitPrice * line.quantity - line.discount;
                    return (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <select className="input-field" style={{ padding: '5px 8px', fontSize: 12 }} value={line.productId} onChange={e => onProductChange(i, e.target.value)} required>
                            <option value="">{t('selectProduct')}</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '8px 6px' }}><input type="number" step="1" min="1" style={{ width: 70, padding: '5px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }} value={line.quantity} onChange={e => updateLine(i, 'quantity', Number(e.target.value))} /></td>
                        <td style={{ padding: '8px 6px' }}><input type="number" step="0.01" min="0" style={{ width: 90, padding: '5px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }} value={line.unitPrice} onChange={e => updateLine(i, 'unitPrice', Number(e.target.value))} /></td>
                        <td style={{ padding: '8px 6px' }}><input type="number" step="0.01" min="0" style={{ width: 80, padding: '5px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }} value={line.discount} onChange={e => updateLine(i, 'discount', Number(e.target.value))} /></td>
                        <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: '#10b981' }}>${sub.toFixed(2)}</td>
                        <td style={{ padding: '8px 6px' }}>
                          {lines.length > 1 && <button type="button" onClick={() => removeLine(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}><Trash2 size={13} /></button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', minWidth: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>{t('subtotal')}</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>{t('discount')}</span><span>-${parseFloat(discount || '0').toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#10b981', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                <span>{t('total')}</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? t('saving') : t('createSale')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const map: Record<string, { color: string; bg: string; border: string; label: string; icon: React.ReactNode }> = {
    COMPLETED: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: t('completed'), icon: <CheckCircle2 size={11} /> },
    PENDING:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  label: t('pending'),   icon: <ClipboardList size={11} /> },
    CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   label: t('cancelled'), icon: <Ban size={11} /> },
    RETURNED:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)',  label: t('returned'),  icon: <X size={11} /> },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.icon}{s.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const { t } = useTranslation();
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, p] = await Promise.all([saleApi.getAll(), customerApi.getAll(), productApi.getAll()]);
      setSales(s); setCustomers(c); setProducts(p);
    } catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = sales.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || (s.invoiceCode ?? '').toLowerCase().includes(q) || (s.customerName ?? '').toLowerCase().includes(q);
    const matchS = !filterStatus || s.status === filterStatus;
    return matchQ && matchS;
  });

  const handleCancel = async (id: string) => {
    if (!confirm(t('cancelSaleConfirm'))) return;
    setCancelling(id);
    try { await saleApi.cancel(id); await load(); }
    catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message ?? 'Cannot cancel sale');
    } finally { setCancelling(null); }
  };

  const stats = {
    total: sales.length,
    completed: sales.filter(s => s.status === 'COMPLETED').length,
    totalRevenue: sales.filter(s => s.status === 'COMPLETED').reduce((acc, s) => acc + (s.totalAmount ?? 0), 0),
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('sales')}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('salesSubtitle')}</p>
        </div>
        <button id="create-sale-btn" className="btn-primary" onClick={() => setModalOpen(true)}><Plus size={16} /> {t('newSale')}</button>
      </div>

      {/* Stats */}
      <div className="grid-stats-3">
        {[
          { label: t('totalSales'),   value: stats.total,     icon: Receipt,      color: '#6366f1' },
          { label: t('completed'),     value: stats.completed, icon: CheckCircle2, color: '#10b981' },
          { label: t('totalRevenue'), value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={20} color={s.color} /></div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="toolbar-container">
        <div className="toolbar-search">
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder={t('searchSalesPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t('allStatus')}</option>
          <option value="COMPLETED">{t('completed')}</option>
          <option value="PENDING">{t('pending')}</option>
          <option value="CANCELLED">{t('cancelled')}</option>
          <option value="RETURNED">{t('returned')}</option>
        </select>
        <button className="btn-secondary" onClick={load} title={t('refresh')}><RefreshCw size={15} /></button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          {t('loadingSales')}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('colInvoice')}</th>
                <th>{t('colDate')}</th>
                <th>{t('colCustomer')}</th>
                <th>{t('colItems')}</th>
                <th>{t('colTotal')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noSalesFound')}</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{s.invoiceCode ?? s.id.slice(0, 8)}</td>
                  <td style={{ fontSize: 12 }}>{new Date(s.saleDate).toLocaleDateString()}</td>
                  <td style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{s.customerName ?? <span style={{ color: 'var(--text-muted)' }}>{t('walkInCustomer')}</span>}</div>
                    {s.employeeName && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {s.employeeName}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{s.items?.length ?? 0} {t('items')}</td>
                  <td style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>${(s.totalAmount ?? 0).toFixed(2)} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.currency}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <StatusBadge status={s.status} />
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: s.paid ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: s.paid ? '#10b981' : '#f59e0b',
                        border: `1px solid ${s.paid ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`
                      }}>
                        {s.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </td>
                  <td>
                    {s.status !== 'CANCELLED' && (
                      <button id={`cancel-sale-${s.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: cancelling === s.id ? 0.5 : 1 }} onClick={() => handleCancel(s.id)} disabled={cancelling === s.id} title={t('cancelSale')}>
                        <Ban size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <CreateSaleModal
          customers={customers}
          products={products}
          onClose={() => setModalOpen(false)}
          onSaved={async () => { setModalOpen(false); await load(); }}
        />
      )}
    </div>
  );
}
