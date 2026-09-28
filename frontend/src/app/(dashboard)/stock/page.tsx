'use client';

import { useState, useEffect, useCallback } from 'react';
import { stockApi, StockItem } from '@/lib/stock-api';
import {
  Warehouse, AlertTriangle, RefreshCw, Search,
  TrendingDown, Package, CheckCircle, Sliders
} from 'lucide-react';

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try { setStock(await stockApi.getAll()); }
    catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = stock.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q
      || (s.productName ?? '').toLowerCase().includes(q)
      || (s.barcode ?? '').toLowerCase().includes(q);
    const matchLow = !showLowOnly || s.lowStock;
    return matchQ && matchLow;
  });

  const handleAdjust = async (productId: string) => {
    const delta = parseFloat(adjustDelta[productId] ?? '0');
    if (isNaN(delta) || delta === 0) return;
    setAdjusting(productId);
    try {
      await stockApi.adjust(productId, delta);
      await load();
      setAdjustDelta(p => ({ ...p, [productId]: '' }));
    } catch {
      alert('Adjustment failed');
    } finally {
      setAdjusting(null);
    }
  };

  const totalItems = stock.length;
  const lowStockCount = stock.filter(s => s.lowStock).length;
  const totalQty = stock.reduce((acc, s) => acc + s.quantity, 0);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Stock Levels</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Monitor inventory quantities and adjust stock on-hand</p>
        </div>
        <button className="btn-secondary" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Products Tracked', value: totalItems, icon: Package, color: '#6366f1' },
          { label: 'Low Stock Alerts',  value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? '#ef4444' : '#10b981' },
          { label: 'Total Units',       value: totalQty.toFixed(0), icon: Warehouse, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder="Search by product name or barcode..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button
          className={showLowOnly ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setShowLowOnly(p => !p)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <AlertTriangle size={14} /> {showLowOnly ? 'All Items' : 'Low Stock Only'}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          Loading stock...
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Barcode</th>
                <th>In Stock</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Reorder At</th>
                <th>Status</th>
                <th>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No stock records found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.productId} style={{ background: s.lowStock ? 'rgba(239,68,68,0.04)' : undefined }}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{s.productName ?? s.productId}</div>
                    {s.categoryName && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.categoryName}</div>}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.barcode ?? '—'}</td>
                  <td style={{ fontSize: 14, fontWeight: 600, color: s.lowStock ? '#ef4444' : 'var(--text-primary)' }}>
                    {s.quantity.toFixed(2)}
                  </td>
                  <td style={{ fontSize: 13 }}>{(s.reservedQty ?? 0).toFixed(2)}</td>
                  <td style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>{(s.availableQty ?? s.quantity).toFixed(2)}</td>
                  <td style={{ fontSize: 12 }}>{s.reorderLevel ?? 0}</td>
                  <td>
                    {s.lowStock
                      ? <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <AlertTriangle size={11} /> Low Stock
                        </span>
                      : <span className="badge badge-active"><CheckCircle size={11} /> OK</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        type="number"
                        step="1"
                        placeholder="±qty"
                        value={adjustDelta[s.productId] ?? ''}
                        onChange={e => setAdjustDelta(p => ({ ...p, [s.productId]: e.target.value }))}
                        style={{ width: 70, padding: '4px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }}
                      />
                      <button
                        id={`adjust-stock-${s.productId}`}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', opacity: adjusting === s.productId ? 0.5 : 1 }}
                        onClick={() => handleAdjust(s.productId)}
                        disabled={adjusting === s.productId}
                        title="Apply adjustment"
                      >
                        <Sliders size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
