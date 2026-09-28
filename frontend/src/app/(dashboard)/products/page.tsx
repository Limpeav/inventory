'use client';

import { useState, useEffect, useCallback } from 'react';
import { productApi, Product, CreateProductRequest } from '@/lib/product-api';
import { categoryApi, Category } from '@/lib/category-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Package, Plus, Pencil, Trash2, X, Search, AlertCircle,
  Tag, RefreshCw, BarChart2, Eye, EyeOff
} from 'lucide-react';

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProductModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateProductRequest>({
    name: product?.name ?? '',
    barcode: product?.barcode ?? '',
    model: product?.model ?? '',
    packageUnit: product?.packageUnit ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? '',
    cost: product?.cost ?? 0,
    price: product?.price ?? 0,
    reorderLevel: product?.reorderLevel ?? 0,
    hidden: product?.hidden ?? false,
    startDate: product?.startDate ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (k: keyof CreateProductRequest, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || undefined,
        barcode: form.barcode || undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        price: form.price ? Number(form.price) : undefined,
        startDate: form.startDate || undefined,
      };
      if (product) {
        await productApi.update(product.id, payload);
      } else {
        await productApi.create(payload);
      }
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {product ? t('editProduct') : t('addProduct')}
          </h2>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('productNameRequired')}</label>
              <input className="input-field" required value={form.name} onChange={e => handle('name', e.target.value)} placeholder="e.g. Coca Cola 330ml" />
            </div>
            {/* Barcode */}
            <div>
              <label className="label">{t('barcode')}</label>
              <input className="input-field" value={form.barcode} onChange={e => handle('barcode', e.target.value)} placeholder="Scan or type barcode" />
            </div>
            {/* Model */}
            <div>
              <label className="label">{t('model')}</label>
              <input className="input-field" value={form.model} onChange={e => handle('model', e.target.value)} placeholder="Model number" />
            </div>
            {/* Category */}
            <div>
              <label className="label">{t('categorySelect')}</label>
              <select className="input-field" value={form.categoryId} onChange={e => handle('categoryId', e.target.value)}>
                <option value="">{t('selectCategoryPlaceholder')}</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {/* Package Unit */}
            <div>
              <label className="label">{t('packageUnit')}</label>
              <input className="input-field" value={form.packageUnit} onChange={e => handle('packageUnit', e.target.value)} placeholder="e.g. Box, Piece, Kg" />
            </div>
            {/* Cost */}
            <div>
              <label className="label">{t('costPrice')}</label>
              <input className="input-field" type="number" step="0.0001" min="0" value={form.cost} onChange={e => handle('cost', e.target.value)} />
            </div>
            {/* Price */}
            <div>
              <label className="label">{t('sellingPrice')}</label>
              <input className="input-field" type="number" step="0.0001" min="0" value={form.price} onChange={e => handle('price', e.target.value)} />
            </div>
            {/* Reorder Level */}
            <div>
              <label className="label">{t('reorderLevel')}</label>
              <input className="input-field" type="number" step="1" min="0" value={form.reorderLevel} onChange={e => handle('reorderLevel', Number(e.target.value))} />
            </div>
            {/* Start Date */}
            <div>
              <label className="label">{t('startDate')}</label>
              <input className="input-field" type="date" value={form.startDate} onChange={e => handle('startDate', e.target.value)} />
            </div>
            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('description')}</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => handle('description', e.target.value)} placeholder={t('productNotesPlaceholder')} style={{ resize: 'vertical' }} />
            </div>
            {/* Hidden */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="hidden-chk" checked={form.hidden} onChange={e => handle('hidden', e.target.checked)} style={{ width: 16, height: 16 }} />
              <label htmlFor="hidden-chk" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>{t('hiddenCheckbox')}</label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? t('saving') : product ? t('saveChanges') : t('createProduct')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([productApi.getAll(), categoryApi.getAll()]);
      setProducts(prods);
      setCategories(cats);
    } catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || (p.barcode ?? '').toLowerCase().includes(q) || (p.model ?? '').toLowerCase().includes(q);
    const matchCat = !filterCategory || p.categoryId === filterCategory;
    return matchQ && matchCat;
  });

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteProductConfirm'))) return;
    setDeleting(id);
    try { await productApi.delete(id); await load(); }
    catch { alert('Could not delete product'); }
    finally { setDeleting(null); }
  };

  const openEdit = (p: Product) => { setEditing(p); setModalOpen(true); };
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const onSaved = async () => { closeModal(); await load(); };

  const stats = {
    total: products.length,
    active: products.filter(p => !p.hidden).length,
    hidden: products.filter(p => p.hidden).length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('products')}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('manageProducts')}</p>
        </div>
        <button id="create-product-btn" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> {t('addProduct')}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: t('totalProducts'), value: stats.total, icon: Package, color: '#6366f1' },
          { label: t('activeProducts'), value: stats.active, icon: BarChart2, color: '#10b981' },
          { label: t('hidden'),         value: stats.hidden, icon: EyeOff,   color: '#f59e0b' },
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
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder={t('searchProductsPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 200 }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">{t('allCategories')}</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn-secondary" onClick={load} title={t('refresh')}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          {t('loadingProducts')}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('colProduct')}</th>
                <th>{t('colBarcode')}</th>
                <th>{t('colCategory')}</th>
                <th>{t('colCost')}</th>
                <th>{t('colPrice')}</th>
                <th>{t('colReorderAt')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noProductsFound')}</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.name}</div>
                    {p.model && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.model}</div>}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.barcode || '—'}</td>
                  <td>
                    {p.categoryName
                      ? <span className="badge badge-role"><Tag size={11} /> {p.categoryName}</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ fontSize: 13 }}>{p.cost != null ? `$${Number(p.cost).toFixed(2)}` : '—'}</td>
                  <td style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>{p.price != null ? `$${Number(p.price).toFixed(2)}` : '—'}</td>
                  <td style={{ fontSize: 12 }}>{p.reorderLevel ?? 0}</td>
                  <td>
                    {p.hidden
                      ? <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}><EyeOff size={11} /> {t('hidden')}</span>
                      : <span className="badge badge-active"><Eye size={11} /> {t('active')}</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`edit-product-${p.id}`} className="btn-secondary" style={{ padding: '5px 10px' }} onClick={() => openEdit(p)} title={t('edit')}>
                        <Pencil size={13} />
                      </button>
                      <button id={`delete-product-${p.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: deleting === p.id ? 0.5 : 1 }} onClick={() => handleDelete(p.id)} disabled={deleting === p.id} title={t('delete')}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          product={editing}
          categories={categories}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
