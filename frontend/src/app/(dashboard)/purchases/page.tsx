'use client';

import { useState, useEffect, useCallback } from 'react';
import { purchaseApi, Purchase, CreatePurchaseRequest } from '@/lib/purchase-api';
import { supplierApi, Supplier } from '@/lib/supplier-api';
import { productApi, Product } from '@/lib/product-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  ShoppingCart, Plus, X, AlertCircle, Search, RefreshCw,
  Trash2, DollarSign, Ban, CheckCircle2, ClipboardList, Truck, PackageCheck
} from 'lucide-react';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const map: Record<string, { color: string; bg: string; border: string; label: string }> = {
    RECEIVED:           { color: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.3)', label: t('received') },
    PARTIALLY_RECEIVED: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)', label: 'Partially Received' },
    ORDERED:            { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)', label: 'Ordered' },
    PENDING:            { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)', label: t('pending') },
    PARTIAL:            { color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.3)', label: t('partial') },
    CANCELLED:          { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)',  label: t('cancelled') },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────
function CreatePurchaseModal({
  suppliers,
  products,
  onClose,
  onSaved,
}: {
  suppliers: Supplier[];
  products: Product[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('RECEIVED');
  const [supplierId, setSupplierId] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [discount, setDiscount] = useState('0');
  const [note, setNote] = useState('');
  const [lines, setLines] = useState([{ productId: '', quantity: 1, unitCost: 0, discount: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addLine = () => setLines(l => [...l, { productId: '', quantity: 1, unitCost: 0, discount: 0 }]);
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, key: string, val: unknown) =>
    setLines(l => l.map((line, idx) => idx === i ? { ...line, [key]: val } : line));

  const onProductChange = (i: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    setLines(l => l.map((line, idx) => idx === i
      ? { ...line, productId, unitCost: prod?.cost ?? 0 }
      : line));
  };

  const subtotal = lines.reduce((acc, l) => acc + (l.unitCost * l.quantity - l.discount), 0);
  const total = Math.max(0, subtotal - parseFloat(discount || '0'));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.some(l => !l.productId)) { setError('Please select a product for all lines'); return; }
    setSaving(true); setError('');
    try {
      await purchaseApi.create({
        referenceCode: referenceCode || undefined,
        purchaseDate,
        deliveryDate: deliveryDate || undefined,
        paymentDueDate: paymentDueDate || undefined,
        deliveryStatus,
        supplierId: supplierId || undefined,
        currency,
        discount: parseFloat(discount || '0'),
        note: note || undefined,
        items: lines.map(l => ({
          productId: l.productId,
          quantity: l.quantity,
          receivedQuantity: deliveryStatus === 'RECEIVED' ? l.quantity : 0,
          unitCost: l.unitCost,
          discount: l.discount,
        })),
      });
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to create purchase');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{t('newPurchaseOrder')}</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ef44441a', border: '1px solid #ef444444', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#ef4444', fontSize: 13 }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-grid-3">
            <div><label className="label">{t('poReference')}</label><input className="input-field" value={referenceCode} onChange={e => setReferenceCode(e.target.value)} placeholder="Auto-generated if blank" /></div>
            <div><label className="label">{t('purchaseDate')}</label><input className="input-field" type="date" required value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} /></div>
            <div><label className="label">{t('expectedDelivery')}</label><input className="input-field" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} /></div>
            <div><label className="label">{t('selectSupplier')}</label>
              <select className="input-field" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                <option value="">{t('noSupplier')}</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div><label className="label">Receiving Status</label>
              <select className="input-field" value={deliveryStatus} onChange={e => setDeliveryStatus(e.target.value)}>
                <option value="RECEIVED">Received (Add to stock now)</option>
                <option value="ORDERED">Ordered (Receive later)</option>
              </select>
            </div>
            <div><label className="label">{t('currency')}</label>
              <select className="input-field" value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="KHR">KHR (៛)</option>
              </select>
            </div>
            <div><label className="label">Payment Due Date</label><input className="input-field" type="date" value={paymentDueDate} onChange={e => setPaymentDueDate(e.target.value)} /></div>
            <div><label className="label">{t('overallDiscount')}</label><input className="input-field" type="number" step="0.01" min="0" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label className="label">{t('note')}</label><input className="input-field" value={note} onChange={e => setNote(e.target.value)} /></div>
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
                  {[t('colProduct'), t('quantity'), t('unitCost'), t('discount'), t('subtotal'), ''].map((h, idx) => (
                    <th key={idx} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {lines.map((line, i) => {
                    const sub = line.unitCost * line.quantity - line.discount;
                    return (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <select className="input-field" style={{ padding: '5px 8px', fontSize: 12 }} value={line.productId} onChange={e => onProductChange(i, e.target.value)} required>
                            <option value="">{t('selectProduct')}</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '8px 6px' }}><input type="number" step="1" min="1" style={{ width: 70, padding: '5px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }} value={line.quantity} onChange={e => updateLine(i, 'quantity', Number(e.target.value))} /></td>
                        <td style={{ padding: '8px 6px' }}><input type="number" step="0.01" min="0" style={{ width: 90, padding: '5px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }} value={line.unitCost} onChange={e => updateLine(i, 'unitCost', Number(e.target.value))} /></td>
                        <td style={{ padding: '8px 6px' }}><input type="number" step="0.01" min="0" style={{ width: 80, padding: '5px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }} value={line.discount} onChange={e => updateLine(i, 'discount', Number(e.target.value))} /></td>
                        <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: '#6366f1' }}>${sub.toFixed(2)}</td>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#6366f1', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                <span>{t('total')}</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? t('saving') : t('createPurchase')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Receive Goods Modal ──────────────────────────────────────────────────────
function ReceiveModal({
  purchase,
  onClose,
  onSaved,
}: {
  purchase: Purchase;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [itemsToReceive, setItemsToReceive] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    purchase.items?.forEach(i => {
      const ordered = i.orderedQuantity ?? i.quantity;
      const received = i.receivedQuantity ?? 0;
      const pending = Math.max(0, ordered - received);
      initial[i.id || i.productId] = pending;
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = Object.entries(itemsToReceive).map(([key, qty]) => {
        const item = purchase.items?.find(i => (i.id === key || i.productId === key));
        return {
          itemId: item?.id,
          productId: item?.productId,
          quantityReceived: Number(qty) || 0,
        };
      }).filter(p => p.quantityReceived > 0);

      if (payload.length === 0) {
        setError('Please specify at least one quantity to receive');
        setSaving(false);
        return;
      }

      await purchaseApi.receive(purchase.id, payload, deliveryDate);
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to record received items');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <PackageCheck size={20} color="#10b981" />
            Receive Items — {purchase.referenceCode || purchase.id.slice(0, 8)}
          </h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ef44441a', border: '1px solid #ef444444', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: 13 }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Actual Delivery Date *</label>
            <input
              type="date"
              className="input-field"
              required
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
            />
          </div>

          <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--bg-card)' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Ordered</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Received</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Receive Now</th>
                </tr>
              </thead>
              <tbody>
                {purchase.items?.map((item, idx) => {
                  const key = item.id || item.productId;
                  const ordered = item.orderedQuantity ?? item.quantity;
                  const received = item.receivedQuantity ?? 0;
                  const pending = Math.max(0, ordered - received);

                  return (
                    <tr key={idx} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>{item.productName || item.productId}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{ordered}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: received > 0 ? '#10b981' : 'var(--text-muted)' }}>
                        {received}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max={pending}
                          style={{
                            width: 80, padding: '5px 8px', borderRadius: 6,
                            background: 'var(--bg-base)', border: '1px solid var(--border)',
                            color: 'var(--text-primary)', textAlign: 'center',
                          }}
                          value={itemsToReceive[key] ?? 0}
                          onChange={e => setItemsToReceive({ ...itemsToReceive, [key]: Number(e.target.value) })}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Updating Stock...' : 'Confirm Receipt & Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PurchasesPage() {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [receivingPurchase, setReceivingPurchase] = useState<Purchase | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [purData, supData, proData] = await Promise.all([
        purchaseApi.getAll(),
        supplierApi.getAll(),
        productApi.getAll(),
      ]);
      setPurchases(purData);
      setSuppliers(supData);
      setProducts(proData);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = purchases.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q
      || (p.referenceCode?.toLowerCase().includes(q))
      || (p.supplierName?.toLowerCase().includes(q))
      || p.id.toLowerCase().includes(q);
    const matchS = !filterStatus || p.status === filterStatus;
    return matchQ && matchS;
  });

  const handleCancel = async (id: string) => {
    if (!confirm(t('cancelPurchaseConfirm'))) return;
    setCancelling(id);
    try { await purchaseApi.cancel(id); await load(); }
    catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message ?? 'Cannot cancel purchase');
    } finally { setCancelling(null); }
  };

  const stats = {
    total: purchases.length,
    received: purchases.filter(p => p.status === 'RECEIVED').length,
    totalSpend: purchases.filter(p => p.status === 'RECEIVED' || p.status === 'PARTIALLY_RECEIVED').reduce((acc, p) => acc + (p.totalAmount ?? 0), 0),
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('purchases')}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('purchasesSubtitle')}</p>
        </div>
        <button id="create-purchase-btn" className="btn-primary" onClick={() => setModalOpen(true)}><Plus size={16} /> {t('newPurchase')}</button>
      </div>

      {/* Stats */}
      <div className="grid-stats-3">
        {[
          { label: t('totalOrders'),   value: stats.total,    icon: ShoppingCart,  color: '#6366f1' },
          { label: t('received'),       value: stats.received, icon: CheckCircle2,  color: '#10b981' },
          { label: t('totalSpend'),    value: `$${stats.totalSpend.toFixed(2)}`, icon: DollarSign, color: '#f59e0b' },
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
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder={t('searchPurchasesPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t('allStatus')}</option>
          <option value="RECEIVED">{t('received')}</option>
          <option value="PARTIALLY_RECEIVED">Partially Received</option>
          <option value="ORDERED">Ordered</option>
          <option value="PENDING">{t('pending')}</option>
          <option value="CANCELLED">{t('cancelled')}</option>
        </select>
        <button className="btn-secondary" onClick={load} title={t('refresh')}><RefreshCw size={15} /></button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          {t('loadingPurchases')}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('colPoRef')}</th>
                <th>{t('colDate')}</th>
                <th>{t('colSupplier')}</th>
                <th>{t('colDelivery')}</th>
                <th>Items (Rcvd/Ord)</th>
                <th>{t('colTotal')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noPurchasesFound')}</td></tr>
              ) : filtered.map(p => {
                const totalOrd = p.items?.reduce((s, i) => s + (i.orderedQuantity ?? i.quantity ?? 0), 0) ?? 0;
                const totalRcv = p.items?.reduce((s, i) => s + (i.receivedQuantity ?? 0), 0) ?? 0;

                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{p.referenceCode ?? p.id.slice(0, 8)}</td>
                    <td style={{ fontSize: 12 }}>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                    <td style={{ fontSize: 13 }}>
                      {p.supplierName
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={12} />{p.supplierName}</span>
                        : <span style={{ color: 'var(--text-muted)' }}>{t('noSupplier')}</span>}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {p.actualDeliveryDate
                        ? <span style={{ color: '#10b981' }}>{new Date(p.actualDeliveryDate).toLocaleDateString()}</span>
                        : (p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString() : '—')}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600 }}>{totalRcv} / {totalOrd} pcs</span>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.items?.length ?? 0} {t('items')}</div>
                    </td>
                    <td style={{ fontSize: 14, fontWeight: 700, color: '#6366f1' }}>${(p.totalAmount ?? 0).toFixed(2)} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.currency}</span></td>
                    <td><StatusBadge status={p.deliveryStatus || p.status} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {p.status !== 'CANCELLED' && p.status !== 'RECEIVED' && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '5px 9px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, color: '#10b981' }}
                            onClick={() => setReceivingPurchase(p)}
                            title="Receive goods and increment stock"
                          >
                            <PackageCheck size={13} />
                            Receive
                          </button>
                        )}
                        {p.status !== 'CANCELLED' && (
                          <button id={`cancel-purchase-${p.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: cancelling === p.id ? 0.5 : 1 }} onClick={() => handleCancel(p.id)} disabled={cancelling === p.id} title={t('cancelPurchase')}>
                            <Ban size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <CreatePurchaseModal
          suppliers={suppliers}
          products={products}
          onClose={() => setModalOpen(false)}
          onSaved={async () => { setModalOpen(false); await load(); }}
        />
      )}

      {receivingPurchase && (
        <ReceiveModal
          purchase={receivingPurchase}
          onClose={() => setReceivingPurchase(null)}
          onSaved={async () => { setReceivingPurchase(null); await load(); }}
        />
      )}
    </div>
  );
}
