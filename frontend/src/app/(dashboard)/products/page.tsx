'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { productApi, Product, CreateProductRequest } from '@/lib/product-api';
import { categoryApi, Category } from '@/lib/category-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Package, Plus, Pencil, Trash2, X, Search, AlertCircle,
  Tag, RefreshCw, BarChart2, Eye, EyeOff, Wrench, Sparkles, Filter
} from 'lucide-react';

const POPULAR_SEWING_BRANDS = [
  'JUKI', 'JACK', 'BROTHER', 'SIRUBA', 'SINGER',
  'PEGASUS', 'YAMATO', 'TYPICAL', 'KANSAI SPECIAL',
  'ZOJE', 'BAOYU', 'ORGAN', 'HIROSE'
];

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
    nameKh: product?.nameKh ?? '',
    barcode: product?.barcode ?? '',
    model: product?.model ?? '',
    brand: product?.brand ?? '',
    condition: product?.condition ?? 'NEW',
    packageUnit: product?.packageUnit ?? 'Set',
    productType: product?.productType ?? 'MACHINE',
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
      const payload: CreateProductRequest = {
        ...form,
        brand: form.brand?.trim() || undefined,
        condition: form.condition || 'NEW',
        categoryId: form.categoryId || undefined,
        barcode: form.barcode || undefined,
        model: form.model || undefined,
        packageUnit: form.packageUnit || undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        price: form.price ? Number(form.price) : undefined,
        startDate: form.startDate || undefined,
        productType: form.productType || undefined,
        nameKh: form.nameKh || undefined,
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
      <div className="modal-content" style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {product ? t('editProduct') : t('addProduct')}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {t('sewingMachineShopKh')} / Sewing Machine Inventory
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
          <div className="form-grid-2">
            {/* Name */}
            <div>
              <label className="label">{t('productNameRequired')}</label>
              <input
                className="input-field"
                required
                value={form.name}
                onChange={e => handle('name', e.target.value)}
                placeholder="e.g. Juki DDL-8700 Industrial Lockstitch"
              />
            </div>

            {/* Khmer Name */}
            <div>
              <label className="label">Khmer Name (ឈ្មោះជាភាសាខ្មែរ)</label>
              <input
                className="input-field"
                value={form.nameKh}
                onChange={e => handle('nameKh', e.target.value)}
                placeholder="ឧ. ម៉ាស៊ីនដេរត្រង់ ជូគី DDL-8700"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="label">{t('brand')}</label>
              <input
                list="sewing-brands-list"
                className="input-field"
                value={form.brand}
                onChange={e => handle('brand', e.target.value.toUpperCase())}
                placeholder={t('brandPlaceholder')}
              />
              <datalist id="sewing-brands-list">
                {POPULAR_SEWING_BRANDS.map(b => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            {/* Condition */}
            <div>
              <label className="label">{t('condition')}</label>
              <select
                className="input-field"
                value={form.condition}
                onChange={e => handle('condition', e.target.value)}
              >
                <option value="NEW">{t('conditionNew')}</option>
                <option value="USED">{t('conditionUsed')}</option>
                <option value="REFURBISHED">{t('conditionRefurbished')}</option>
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="label">{t('model')}</label>
              <input
                className="input-field"
                value={form.model}
                onChange={e => handle('model', e.target.value)}
                placeholder="e.g. DDL-8700, F4, 747K"
              />
            </div>

            {/* Barcode / SKU */}
            <div>
              <label className="label">{t('barcode')} / Code</label>
              <input
                className="input-field"
                value={form.barcode}
                onChange={e => handle('barcode', e.target.value)}
                placeholder="Scan or type code (e.g. SM-JK8700-N)"
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">{t('categorySelect')}</label>
              <select
                className="input-field"
                value={form.categoryId}
                onChange={e => handle('categoryId', e.target.value)}
              >
                <option value="">{t('selectCategoryPlaceholder')}</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Package Unit */}
            <div>
              <label className="label">{t('packageUnit')}</label>
              <input
                list="sewing-unit-presets"
                className="input-field"
                value={form.packageUnit}
                onChange={e => handle('packageUnit', e.target.value)}
                placeholder="Set, Head, Pcs, Box, Bottle"
              />
              <datalist id="sewing-unit-presets">
                <option value="Set">Set (មួយឈុត: ក្បាល+តុ+ម៉ូទ័រ)</option>
                <option value="Head">Head (តែក្បាលម៉ាស៊ីន)</option>
                <option value="Pcs">Pcs / Needles (ដើម / គ្រាប់)</option>
                <option value="Box">Box (ប្រអប់)</option>
                <option value="Bottle">Bottle / Oil (ដបប្រេង)</option>
              </datalist>
            </div>

            {/* Product Type */}
            <div>
              <label className="label">Product Type (ប្រភេទមុខទំនិញ)</label>
              <select
                className="input-field"
                value={form.productType}
                onChange={e => handle('productType', e.target.value)}
              >
                <option value="MACHINE">{t('productTypeMachine')}</option>
                <option value="SPARE_PART">{t('productTypeSparePart')}</option>
                <option value="ACCESSORY">{t('productTypeAccessory')}</option>
              </select>
            </div>

            {/* Reorder Level */}
            <div>
              <label className="label">{t('reorderLevel')}</label>
              <input
                className="input-field"
                type="number"
                step="1"
                min="0"
                value={form.reorderLevel}
                onChange={e => handle('reorderLevel', Number(e.target.value))}
              />
            </div>

            {/* Cost */}
            <div>
              <label className="label">{t('costPrice')}</label>
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                value={form.cost}
                onChange={e => handle('cost', e.target.value)}
              />
            </div>

            {/* Price */}
            <div>
              <label className="label">{t('sellingPrice')}</label>
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => handle('price', e.target.value)}
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="label">{t('startDate')}</label>
              <input
                className="input-field"
                type="date"
                value={form.startDate}
                onChange={e => handle('startDate', e.target.value)}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('description')}</label>
              <textarea
                className="input-field"
                rows={3}
                value={form.description}
                onChange={e => handle('description', e.target.value)}
                placeholder="Sewing machine specifications, motor type (servo/clutch), speed, included accessories..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Hidden */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                id="hidden-chk"
                checked={form.hidden}
                onChange={e => handle('hidden', e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <label htmlFor="hidden-chk" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {t('hiddenCheckbox')}
              </label>
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
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
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

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.brand) set.add(p.brand.toUpperCase());
    });
    return Array.from(set).sort();
  }, [products]);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.nameKh ?? '').toLowerCase().includes(q) ||
      (p.barcode ?? '').toLowerCase().includes(q) ||
      (p.model ?? '').toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q);

    const matchCat = !filterCategory || p.categoryId === filterCategory;
    const matchBrand = !filterBrand || p.brand?.toUpperCase() === filterBrand.toUpperCase();
    const matchCond = !filterCondition || (p.condition ?? 'NEW') === filterCondition;
    return matchQ && matchCat && matchBrand && matchCond;
  });

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteProductConfirm'))) return;
    setDeleting(id);
    try {
      await productApi.delete(id);
      await load();
    } catch {
      alert('Could not delete product');
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (p: Product) => { setEditing(p); setModalOpen(true); };
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const onSaved = async () => { closeModal(); await load(); };

  const stats = {
    total: products.length,
    active: products.filter(p => !p.hidden).length,
    machines: products.filter(p => (p.productType ?? '').toUpperCase() === 'MACHINE').length,
    spareParts: products.filter(p => (p.productType ?? '').toUpperCase() === 'SPARE_PART').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {t('products')}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {t('manageProducts')} • ហាងលក់ និងជួសជុលម៉ាស៊ីនកាត់ដេរ (Sewing Equipment)
          </p>
        </div>
        <button id="create-product-btn" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> {t('addProduct')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-stats-3">
        {[
          { label: t('totalProducts'), value: stats.total, icon: Package, color: '#6366f1' },
          { label: t('productTypeMachine'), value: stats.machines, icon: Sparkles, color: '#10b981' },
          { label: t('productTypeSparePart'), value: stats.spareParts, icon: Wrench, color: '#f59e0b' },
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

      {/* Filters Toolbar */}
      <div className="toolbar-container" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="toolbar-search" style={{ minWidth: 260 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-field"
            style={{ paddingLeft: 40 }}
            placeholder="Search machine, brand, Khmer name, barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="input-field"
          style={{ width: 190 }}
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">{t('allCategories')}</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Brand Filter */}
        <select
          className="input-field"
          style={{ width: 150 }}
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
        >
          <option value="">{t('allBrands')}</option>
          {availableBrands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Condition Filter */}
        <select
          className="input-field"
          style={{ width: 170 }}
          value={filterCondition}
          onChange={e => setFilterCondition(e.target.value)}
        >
          <option value="">{t('allConditions')}</option>
          <option value="NEW">{t('conditionNew')}</option>
          <option value="USED">{t('conditionUsed')}</option>
          <option value="REFURBISHED">{t('conditionRefurbished')}</option>
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
                <th>{t('condition')}</th>
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
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noProductsFound')}</td></tr>
              ) : filtered.map(p => {
                const cond = p.condition ?? 'NEW';
                return (
                  <tr key={p.id}>
                    {/* Product & Sewing specs */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                        {p.name}
                      </div>
                      {p.nameKh && (
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'sans-serif' }}>
                          {p.nameKh}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                        {p.brand && (
                          <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '1px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>
                            {p.brand}
                          </span>
                        )}
                        {p.model && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border)' }}>
                            Mod: {p.model}
                          </span>
                        )}
                        {p.packageUnit && (
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border)' }}>
                            📦 {p.packageUnit}
                          </span>
                        )}
                        {p.productType && (
                          <span style={{ fontSize: 10, background: 'rgba(236,72,153,0.1)', color: '#ec4899', padding: '1px 5px', borderRadius: 4 }}>
                            {p.productType}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Condition Badge */}
                    <td>
                      {cond === 'NEW' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                          ✨ ថ្មី (NEW)
                        </span>
                      )}
                      {cond === 'USED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)' }}>
                          🔄 មួយទឹក (USED)
                        </span>
                      )}
                      {cond === 'REFURBISHED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(168,85,247,0.12)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.25)' }}>
                          🛠 កែច្នៃ (REFURB)
                        </span>
                      )}
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
                );
              })}
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
