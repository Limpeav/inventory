'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { saleApi, Sale } from '@/lib/sale-api';
import { customerApi, Customer } from '@/lib/customer-api';
import { productApi, Product } from '@/lib/product-api';
import { lookupApi, Currency } from '@/lib/lookup-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Receipt, Plus, X, AlertCircle, Search, RefreshCw,
  Trash2, DollarSign, Ban, CheckCircle2, ClipboardList,
  Printer, ShieldCheck, Tag
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

interface SaleLineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  serialNumber: string;
  warrantyMonths: number;
}

// ─── Printable Invoice / Warranty Modal ──────────────────────────────────────
function InvoiceModal({
  sale,
  products,
  onClose,
}: {
  sale: Sale;
  products: Product[];
  onClose: () => void;
}) {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const productMap = new Map(products.map(p => [p.id, p]));

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-content print-container"
        style={{ maxWidth: 780, maxHeight: '92vh', overflowY: 'auto', background: 'var(--bg-card)', padding: '32px 36px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
            {t('warrantyCertificate')} / Receipt Preview
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Printer size={16} /> {t('printInvoice')}
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── Printable Document Area ─── */}
        <div id="printable-invoice" style={{ color: 'var(--text-primary)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
              {t('sewingMachineShopKh')}
            </h1>
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 6px', color: 'var(--text-secondary)' }}>
              SEWING MACHINE TRADING, IMPORT & SERVICE CENTER
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              Industrial & Domestic Sewing Machines • Spare Parts • Maintenance & Warranties
            </p>
          </div>

          {/* Invoice Info Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20, fontSize: 13 }}>
            <div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('invoiceNumber')}: </span>
                <strong style={{ fontFamily: 'monospace', fontSize: 14 }}>{sale.invoiceCode || sale.id.slice(0, 8)}</strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('date')}: </span>
                <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                <span style={{
                  fontWeight: 700,
                  color: sale.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                  textTransform: 'uppercase',
                  fontSize: 11
                }}>
                  {sale.status}
                </span>
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: sale.paid ? '#10b981' : '#f59e0b' }}>
                  ({sale.paid ? 'PAID' : 'UNPAID'})
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Customer: </span>
                <strong>{sale.customerName || t('walkInCustomer')}</strong>
              </div>
              {sale.employeeName && (
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Salesperson: </span>
                  <span>{sale.employeeName}</span>
                </div>
              )}
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Currency: </span>
                <span>{sale.currency || 'USD'}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>Machine / Product</th>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>Serial # (S/N)</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Warranty</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(sale.items ?? []).map((item, idx) => {
                const prod = productMap.get(item.productId);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <div style={{ fontWeight: 600 }}>{item.productName}</div>
                      {prod?.nameKh && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{prod.nameKh}</div>
                      )}
                      <div style={{ display: 'flex', gap: 6, marginTop: 2, fontSize: 10, color: 'var(--text-muted)' }}>
                        {prod?.brand && <span>Brand: {prod.brand}</span>}
                        {prod?.model && <span>• Mod: {prod.model}</span>}
                        {prod?.packageUnit && <span>• ({prod.packageUnit})</span>}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                      {item.serialNumber || '—'}
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                      {item.warrantyMonths && item.warrantyMonths > 0 ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          background: 'rgba(16,185,129,0.12)',
                          color: '#10b981',
                          padding: '2px 7px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600
                        }}>
                          <ShieldCheck size={12} /> {item.warrantyMonths}M
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 600 }}>
                      ${(item.subtotal ?? (item.unitPrice * item.quantity)).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <div style={{ minWidth: 240, fontSize: 13 }}>
              {sale.discount && sale.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-muted)' }}>
                  <span>{t('overallDiscount')}:</span>
                  <span>-${sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 800,
                borderTop: '2px solid var(--border)',
                paddingTop: 8,
                color: '#10b981'
              }}>
                <span>{t('grandTotal')}:</span>
                <span>${(sale.totalAmount ?? 0).toFixed(2)} USD</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                ≈ {((sale.totalAmount ?? 0) * 4100).toLocaleString()} KHR (៛)
              </div>
            </div>
          </div>

          {/* Official Sewing Machine Warranty Card Terms */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 11,
            color: 'var(--text-secondary)',
            marginBottom: 32
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              <ShieldCheck size={14} color="#10b981" />
              {t('warrantyTerms')} (Official Sewing Equipment Warranty Certificate)
            </div>
            <p style={{ margin: '0 0 4px', lineHeight: 1.5 }}>
              • {t('warrantyNoticeKh')}
            </p>
            <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-muted)' }}>
              • {t('warrantyNotice')}
            </p>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', paddingTop: 16 }}>
            <div style={{ width: 180 }}>
              <div style={{ height: 50 }}></div>
              <div style={{ borderTop: '1px dashed var(--text-muted)', paddingTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                ហត្ថលេខាអតិថិជន (Customer)
              </div>
            </div>
            <div style={{ width: 180 }}>
              <div style={{ height: 50 }}></div>
              <div style={{ borderTop: '1px dashed var(--text-muted)', paddingTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                ហត្ថលេខា និងត្រាហាង (Authorized Signatory)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [lines, setLines] = useState<SaleLineItem[]>([
    { productId: '', quantity: 1, unitPrice: 0, discount: 0, serialNumber: '', warrantyMonths: 12 }
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    lookupApi.getCurrencies().then(setAvailableCurrencies).catch(() => {});
  }, []);

  const addLine = () =>
    setLines(l => [...l, { productId: '', quantity: 1, unitPrice: 0, discount: 0, serialNumber: '', warrantyMonths: 12 }]);

  const removeLine = (i: number) =>
    setLines(l => l.filter((_, idx) => idx !== i));

  const updateLine = (i: number, key: keyof SaleLineItem, val: unknown) =>
    setLines(l => l.map((line, idx) => idx === i ? { ...line, [key]: val } : line));

  const onProductChange = (i: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    const isMachine = (prod?.productType ?? 'MACHINE').toUpperCase() === 'MACHINE';
    const isUsed = (prod?.condition ?? 'NEW') === 'USED';
    const defaultWarranty = isMachine ? (isUsed ? 6 : 12) : 0;

    setLines(l => l.map((line, idx) => idx === i
      ? {
          ...line,
          productId,
          unitPrice: prod?.price ?? 0,
          warrantyMonths: defaultWarranty,
        }
      : line));
  };

  const subtotal = lines.reduce((acc, l) => acc + (l.unitPrice * l.quantity - l.discount), 0);
  const total = Math.max(0, subtotal - parseFloat(discount || '0'));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.some(l => !l.productId)) {
      setError('Please select a product for all lines');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saleApi.create({
        invoiceCode: invoiceCode || undefined,
        saleDate,
        customerId: customerId || undefined,
        currency,
        discount: parseFloat(discount || '0'),
        note: note || undefined,
        items: lines.map(l => ({
          productId: l.productId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          discount: l.discount,
          serialNumber: l.serialNumber?.trim() || undefined,
          warrantyMonths: Number(l.warrantyMonths) || 0,
        })),
      });
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to create sale');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 840, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('newSaleInvoice')}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {t('sewingMachineShopKh')} • Record Machine Sales, S/N & Warranties
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, marginBottom: 16, color: '#f87171', fontSize: 13 }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={submit}>
          {/* Header fields */}
          <div className="form-grid-3">
            <div>
              <label className="label">{t('invoiceNumber')}</label>
              <input
                className="input-field"
                value={invoiceCode}
                onChange={e => setInvoiceCode(e.target.value)}
                placeholder="Auto-generated if blank (e.g. INV-2026-001)"
              />
            </div>
            <div>
              <label className="label">{t('date')} *</label>
              <input
                className="input-field"
                type="date"
                required
                value={saleDate}
                onChange={e => setSaleDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('selectCustomer')}</label>
              <select className="input-field" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">{t('walkInOption')}</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{t('currency')}</label>
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
            <div>
              <label className="label">{t('overallDiscount')}</label>
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('note')}</label>
              <input
                className="input-field"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Garment factory note, delivery details..."
              />
            </div>
          </div>

          {/* Line items with Serial Number and Warranty */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('lineItems')} & Machine Warranties
              </span>
              <button type="button" className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={addLine}>
                <Plus size={13} /> {t('addLine')}
              </button>
            </div>

            <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('colProduct')}
                    </th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('serialNumber')}
                    </th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('warranty')}
                    </th>
                    <th style={{ padding: '8px 6px', textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('quantity')}
                    </th>
                    <th style={{ padding: '8px 6px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('unitPrice')}
                    </th>
                    <th style={{ padding: '8px 6px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('discount')}
                    </th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {t('subtotal')}
                    </th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, i) => {
                    const sub = line.unitPrice * line.quantity - line.discount;
                    return (
                      <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                        {/* Product Select */}
                        <td style={{ padding: '8px 10px', minWidth: 220 }}>
                          <select
                            className="input-field"
                            style={{ padding: '5px 8px', fontSize: 12 }}
                            value={line.productId}
                            onChange={e => onProductChange(i, e.target.value)}
                            required
                          >
                            <option value="">{t('selectProduct')}</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.brand ? `[${p.brand}] ` : ''}{p.name} {p.condition === 'USED' ? '(មួយទឹក)' : ''}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Machine Serial Number */}
                        <td style={{ padding: '8px 6px', minWidth: 140 }}>
                          <input
                            type="text"
                            style={{
                              width: '100%',
                              padding: '5px 8px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              color: 'var(--text-primary)',
                              fontSize: 12,
                              fontFamily: 'monospace'
                            }}
                            placeholder={t('serialNumberPlaceholder')}
                            value={line.serialNumber}
                            onChange={e => updateLine(i, 'serialNumber', e.target.value)}
                          />
                        </td>

                        {/* Warranty Duration */}
                        <td style={{ padding: '8px 6px', width: 110 }}>
                          <select
                            style={{
                              width: '100%',
                              padding: '5px 6px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              color: 'var(--text-primary)',
                              fontSize: 12
                            }}
                            value={line.warrantyMonths}
                            onChange={e => updateLine(i, 'warrantyMonths', Number(e.target.value))}
                          >
                            <option value={0}>{t('warrantyNone')}</option>
                            <option value={3}>{t('warranty3M')}</option>
                            <option value={6}>{t('warranty6M')}</option>
                            <option value={12}>{t('warranty12M')}</option>
                            <option value={24}>{t('warranty24M')}</option>
                          </select>
                        </td>

                        {/* Quantity */}
                        <td style={{ padding: '8px 6px' }}>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            style={{
                              width: 60,
                              padding: '5px 6px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              color: 'var(--text-primary)',
                              fontSize: 12,
                              textAlign: 'center'
                            }}
                            value={line.quantity}
                            onChange={e => updateLine(i, 'quantity', Number(e.target.value))}
                          />
                        </td>

                        {/* Unit Price */}
                        <td style={{ padding: '8px 6px' }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            style={{
                              width: 80,
                              padding: '5px 6px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              color: 'var(--text-primary)',
                              fontSize: 12,
                              textAlign: 'right'
                            }}
                            value={line.unitPrice}
                            onChange={e => updateLine(i, 'unitPrice', Number(e.target.value))}
                          />
                        </td>

                        {/* Discount */}
                        <td style={{ padding: '8px 6px' }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            style={{
                              width: 65,
                              padding: '5px 6px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 6,
                              color: 'var(--text-primary)',
                              fontSize: 12,
                              textAlign: 'right'
                            }}
                            value={line.discount}
                            onChange={e => updateLine(i, 'discount', Number(e.target.value))}
                          />
                        </td>

                        {/* Subtotal */}
                        <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: '#10b981', textAlign: 'right' }}>
                          ${sub.toFixed(2)}
                        </td>

                        {/* Remove */}
                        <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                          {lines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLine(i)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
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
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', minWidth: 240 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>{t('subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>{t('discount')}</span>
                <span>-${parseFloat(discount || '0').toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#10b981', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                <span>{t('total')}</span>
                <span>${total.toFixed(2)} USD</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                ≈ {(total * 4100).toLocaleString()} ៛ (KHR)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? t('saving') : t('createSale')}
            </button>
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, p] = await Promise.all([saleApi.getAll(), customerApi.getAll(), productApi.getAll()]);
      setSales(s);
      setCustomers(c);
      setProducts(p);
    } catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = sales.filter(s => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      (s.invoiceCode ?? '').toLowerCase().includes(q) ||
      (s.customerName ?? '').toLowerCase().includes(q) ||
      (s.items ?? []).some(item =>
        (item.productName ?? '').toLowerCase().includes(q) ||
        (item.serialNumber ?? '').toLowerCase().includes(q)
      );
    const matchS = !filterStatus || s.status === filterStatus;
    return matchQ && matchS;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  const paginatedSales = useMemo(() => {
    if (filtered.length <= PAGE_SIZE) return filtered;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleCancel = async (id: string) => {
    if (!confirm(t('cancelSaleConfirm'))) return;
    setCancelling(id);
    try {
      await saleApi.cancel(id);
      await load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message ?? 'Cannot cancel sale');
    } finally {
      setCancelling(null);
    }
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {t('sales')}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {t('salesSubtitle')} • វិក្កយបត្រ និងប័ណ្ណធានាម៉ាស៊ីន (Invoices & Warranties)
          </p>
        </div>
        <button id="create-sale-btn" className="btn-primary" onClick={() => setCreateModalOpen(true)}>
          <Plus size={16} /> {t('newSale')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-stats-3">
        {[
          { label: t('totalSales'),   value: stats.total,     icon: Receipt,      color: '#6366f1' },
          { label: t('completed'),     value: stats.completed, icon: CheckCircle2, color: '#10b981' },
          { label: t('totalRevenue'), value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={20} color={s.color} />
            </div>
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
          <input
            className="input-field"
            style={{ paddingLeft: 40 }}
            placeholder="Search invoice, customer, machine name, S/N..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t('allStatus')}</option>
          <option value="COMPLETED">{t('completed')}</option>
          <option value="PENDING">{t('pending')}</option>
          <option value="CANCELLED">{t('cancelled')}</option>
          <option value="RETURNED">{t('returned')}</option>
        </select>
        <button className="btn-secondary" onClick={load} title={t('refresh')}>
          <RefreshCw size={15} />
        </button>
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
                <th>Equipment & Serial Numbers</th>
                <th>{t('colTotal')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noSalesFound')}</td></tr>
              ) : paginatedSales.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700 }}>
                    <button
                      onClick={() => setSelectedInvoice(s)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        padding: 0,
                        fontWeight: 700,
                        textDecoration: 'underline'
                      }}
                      title="Click to view & print invoice"
                    >
                      {s.invoiceCode ?? s.id.slice(0, 8)}
                    </button>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(s.saleDate).toLocaleDateString()}</td>
                  <td style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{s.customerName ?? <span style={{ color: 'var(--text-muted)' }}>{t('walkInCustomer')}</span>}</div>
                    {s.employeeName && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Agent: {s.employeeName}
                      </div>
                    )}
                  </td>

                  {/* Equipment summary with S/N & Warranty badges */}
                  <td style={{ fontSize: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {(s.items ?? []).map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 600 }}>{it.productName}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>x{it.quantity}</span>
                          {it.serialNumber && (
                            <span style={{
                              fontFamily: 'monospace',
                              fontSize: 10,
                              background: 'rgba(99,102,241,0.12)',
                              color: '#818cf8',
                              padding: '1px 5px',
                              borderRadius: 4
                            }}>
                              SN: {it.serialNumber}
                            </span>
                          )}
                          {it.warrantyMonths && it.warrantyMonths > 0 ? (
                            <span style={{
                              fontSize: 10,
                              background: 'rgba(16,185,129,0.12)',
                              color: '#10b981',
                              padding: '1px 5px',
                              borderRadius: 4
                            }}>
                              🛡 {it.warrantyMonths}M
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>
                    ${(s.totalAmount ?? 0).toFixed(2)} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.currency}</span>
                  </td>

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
                    <div style={{ display: 'flex', gap: 6 }}>
                      {/* View & Print Invoice Button */}
                      <button
                        className="btn-secondary"
                        style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => setSelectedInvoice(s)}
                        title={t('printInvoice')}
                      >
                        <Printer size={13} />
                      </button>

                      {/* Cancel Sale */}
                      {s.status !== 'CANCELLED' && (
                        <button
                          id={`cancel-sale-${s.id}`}
                          className="btn-danger"
                          style={{ padding: '5px 10px', opacity: cancelling === s.id ? 0.5 : 1 }}
                          onClick={() => handleCancel(s.id)}
                          disabled={cancelling === s.id}
                          title={t('cancelSale')}
                        >
                          <Ban size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (renders only if items > 25) */}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="sales orders"
        />
      )}

      {/* Create Sale Modal */}
      {createModalOpen && (
        <CreateSaleModal
          customers={customers}
          products={products}
          onClose={() => setCreateModalOpen(false)}
          onSaved={async () => {
            setCreateModalOpen(false);
            await load();
          }}
        />
      )}

      {/* Invoice & Warranty Certificate Modal */}
      {selectedInvoice && (
        <InvoiceModal
          sale={selectedInvoice}
          products={products}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
