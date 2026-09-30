'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { returnApi, SaleReturn, CreateSaleReturnRequest } from '@/lib/return-api';
import { saleApi, Sale } from '@/lib/sale-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  RotateCcw, Plus, Search, ChevronDown, ChevronUp, AlertCircle,
  X
} from 'lucide-react';

export default function ReturnsPage() {
  const { t } = useTranslation();
  const [returns, setReturns] = useState<SaleReturn[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState('');
  const [reason, setReason] = useState('');
  const [returnItems, setReturnItems] = useState<{ productId: string; productName: string; maxQty: number; quantity: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rets, allSales] = await Promise.all([
        returnApi.getAll(),
        saleApi.getAll(),
      ]);
      setReturns(rets);
      setSales(allSales.filter(s => s.status !== 'CANCELLED'));
    } catch (err) {
      console.error('Failed to load returns', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaleSelect = (saleId: string) => {
    setSelectedSaleId(saleId);
    const sale = sales.find(s => s.id === saleId);
    if (sale && sale.items) {
      setReturnItems(
        sale.items.map(i => ({
          productId: i.productId,
          productName: i.productName || 'Product',
          maxQty: i.quantity,
          quantity: 1,
        }))
      );
    } else {
      setReturnItems([]);
    }
  };

  const handleItemQtyChange = (productId: string, qty: number) => {
    setReturnItems(prev =>
      prev.map(item => item.productId === productId ? { ...item, quantity: Math.max(0, Math.min(item.maxQty, qty)) } : item)
    );
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleId) {
      setError('Please select a sale to return items from');
      return;
    }

    const itemsToReturn = returnItems
      .filter(i => i.quantity > 0)
      .map(i => ({ productId: i.productId, quantity: i.quantity }));

    if (itemsToReturn.length === 0) {
      setError('Please specify at least one item quantity to return');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await returnApi.create({
        saleId: selectedSaleId,
        reason: reason.trim() || undefined,
        items: itemsToReturn,
      });
      setShowModal(false);
      setSelectedSaleId('');
      setReason('');
      setReturnItems([]);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to process return');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const filteredReturns = returns.filter(r =>
    r.reason?.toLowerCase().includes(search.toLowerCase()) ||
    r.saleId.toLowerCase().includes(search.toLowerCase())
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
            <RotateCcw size={24} color="#ec4899" />
            {t('saleReturns')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            {t('returnsSubtitle')}
          </p>
        </div>

        <button
          onClick={() => { setShowModal(true); setError(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ec4899, #db2777)',
            color: '#ffffff', fontSize: '13px', fontWeight: '600',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
          }}
        >
          <Plus size={16} />
          {t('processReturn')}
        </button>
      </div>

      {/* Search / Filter bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={t('searchReturnsPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Returns Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 18px' }}>{t('colReturnDate')}</th>
                <th style={{ padding: '14px 18px' }}>{t('colSaleRef')}</th>
                <th style={{ padding: '14px 18px' }}>{t('colReason')}</th>
                <th style={{ padding: '14px 18px' }}>{t('colTotalRefund')}</th>
                <th style={{ padding: '14px 18px' }}>{t('status')}</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>{t('items')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {t('loadingReturns')}
                  </td>
                </tr>
              ) : filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>
                    <RotateCcw size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{t('noReturnsRecorded')}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{t('noReturnsSubtitle')}</p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map(r => {
                  const sale = sales.find(s => s.id === r.saleId);
                  const isExpanded = expandedId === r.id;

                  return (
                    <Fragment key={r.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          background: isExpanded ? 'var(--bg-subtle)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '14px 18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {r.returnDate}
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                          {sale?.invoiceCode || r.saleId.slice(0, 8)}
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                          {r.reason || t('noReasonProvided')}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: '#f87171' }}>
                          {formatCurrency(r.totalRefund)}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px',
                            background: 'rgba(16,185,129,0.15)', color: '#34d399',
                          }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            style={{
                              background: 'none', border: 'none', color: 'var(--text-muted)',
                              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
                              fontSize: '12px',
                            }}
                          >
                            {r.items?.length || 0} {t('items')}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Items Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} style={{ padding: '12px 24px 16px', background: 'var(--bg-subtle)' }}>
                            <div style={{ borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-base)', padding: '12px' }}>
                              <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                {t('returnedProducts')}:
                              </p>
                              <table style={{ width: '100%', fontSize: '12px' }}>
                                <thead>
                                  <tr style={{ color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <th style={{ padding: '6px 8px' }}>{t('colProduct')}</th>
                                    <th style={{ padding: '6px 8px' }}>{t('quantityReturned')}</th>
                                    <th style={{ padding: '6px 8px' }}>{t('refundUnitPrice')}</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('colTotalRefund')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.items?.map((item, idx) => (
                                    <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                      <td style={{ padding: '6px 8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {item.productName || item.productId}
                                      </td>
                                      <td style={{ padding: '6px 8px' }}>
                                        {item.quantity}
                                      </td>
                                      <td style={{ padding: '6px 8px' }}>
                                        {formatCurrency(item.unitPrice)}
                                      </td>
                                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: '600', color: '#f87171' }}>
                                        {formatCurrency(item.refundAmount)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Process Sale Return */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div className="glass-card animate-scale-up" style={{
            width: '100%', maxWidth: '580px', padding: '24px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#ec4899" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {t('processReturn')}
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

            <form onSubmit={handleSubmitReturn}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('selectSaleInvoice')}
                </label>
                <select
                  value={selectedSaleId}
                  onChange={e => handleSaleSelect(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                >
                  <option value="">{t('chooseSaleInvoice')}</option>
                  {sales.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.invoiceCode || s.id.slice(0, 8)} • {s.saleDate} • {s.customerName || t('walkInCustomer')} • {formatCurrency(s.totalAmount)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items from selected sale */}
              {returnItems.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {t('itemsToReturnAndQty')}
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {returnItems.map(item => (
                      <div
                        key={item.productId}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.productName}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('soldQuantity')}: {item.maxQty}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('qtyToReturn')}</label>
                          <input
                            type="number"
                            min="0"
                            max={item.maxQty}
                            value={item.quantity}
                            onChange={e => handleItemQtyChange(item.productId, Number(e.target.value))}
                            style={{
                              width: '65px', padding: '6px 8px', borderRadius: '6px',
                              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)', fontSize: '13px', textAlign: 'center', outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('returnReason')}
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder={t('returnReasonPlaceholder')}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'vertical',
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
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving || !selectedSaleId}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    color: '#ffffff', fontSize: '13px', fontWeight: '600',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {saving ? t('submitting') : t('confirmReturn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
