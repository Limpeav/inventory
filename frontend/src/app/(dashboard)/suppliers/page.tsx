'use client';

import { useState, useEffect, useCallback } from 'react';
import { supplierApi, Supplier, CreateSupplierRequest } from '@/lib/supplier-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Truck, Plus, Pencil, Trash2, X, Search, AlertCircle,
  Phone, Globe, MapPin, RefreshCw, Mail
} from 'lucide-react';

// ─── Modal ────────────────────────────────────────────────────────────────────
function SupplierModal({
  supplier,
  onClose,
  onSaved,
}: {
  supplier: Supplier | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateSupplierRequest>({
    name: supplier?.name ?? '',
    contactName: supplier?.contactName ?? '',
    telephone: supplier?.telephone ?? '',
    phone: supplier?.phone ?? '',
    fax: supplier?.fax ?? '',
    address: supplier?.address ?? '',
    email: supplier?.email ?? '',
    website: supplier?.website ?? '',
    country: supplier?.country ?? '',
    description: supplier?.description ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (k: keyof CreateSupplierRequest, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (supplier) {
        await supplierApi.update(supplier.id, form);
      } else {
        await supplierApi.create(form);
      }
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to save supplier');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {supplier ? t('editSupplier') : t('addSupplier')}
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
          <div className="form-grid-2">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('supplierNameRequired')}</label>
              <input className="input-field" required value={form.name} onChange={e => handle('name', e.target.value)} placeholder="Company or supplier name" />
            </div>
            <div>
              <label className="label">{t('contactPerson')}</label>
              <input className="input-field" value={form.contactName} onChange={e => handle('contactName', e.target.value)} placeholder="Contact person name" />
            </div>
            <div>
              <label className="label">{t('country')}</label>
              <input className="input-field" value={form.country} onChange={e => handle('country', e.target.value)} placeholder="e.g. Cambodia" />
            </div>
            <div>
              <label className="label">{t('telephone')}</label>
              <input className="input-field" value={form.telephone} onChange={e => handle('telephone', e.target.value)} placeholder="Office telephone" />
            </div>
            <div>
              <label className="label">{t('mobilePhone')}</label>
              <input className="input-field" value={form.phone} onChange={e => handle('phone', e.target.value)} placeholder="Mobile number" />
            </div>
            <div>
              <label className="label">{t('fax')}</label>
              <input className="input-field" value={form.fax} onChange={e => handle('fax', e.target.value)} placeholder="Fax number" />
            </div>
            <div>
              <label className="label">{t('email')}</label>
              <input className="input-field" type="email" value={form.email} onChange={e => handle('email', e.target.value)} placeholder="supplier@email.com" />
            </div>
            <div>
              <label className="label">{t('website')}</label>
              <input className="input-field" type="url" value={form.website} onChange={e => handle('website', e.target.value)} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('address')}</label>
              <input className="input-field" value={form.address} onChange={e => handle('address', e.target.value)} placeholder="Full address" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('notes')}</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => handle('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? t('saving') : supplier ? t('saveChanges') : t('createSupplier')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SuppliersPage() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setSuppliers(await supplierApi.getAll()); }
    catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase();
    return !q
      || s.name.toLowerCase().includes(q)
      || (s.contactName ?? '').toLowerCase().includes(q)
      || (s.country ?? '').toLowerCase().includes(q)
      || (s.email ?? '').toLowerCase().includes(q)
      || (s.telephone ?? '').includes(q);
  });

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteSupplierConfirm'))) return;
    setDeleting(id);
    try { await supplierApi.delete(id); await load(); }
    catch { alert('Cannot delete — supplier may be in use.'); }
    finally { setDeleting(null); }
  };

  const openEdit = (s: Supplier) => { setEditing(s); setModalOpen(true); };
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const onSaved = async () => { closeModal(); await load(); };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('suppliers')}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('manageSuppliers')}</p>
        </div>
        <button id="create-supplier-btn" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> {t('addSupplier')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-stats-2" style={{ maxWidth: 480 }}>
        {[
          { label: t('totalSuppliers'), value: suppliers.length, icon: Truck,  color: '#6366f1' },
          { label: t('countries'),       value: new Set(suppliers.map(s => s.country).filter(Boolean)).size, icon: Globe, color: '#10b981' },
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
      <div className="toolbar-container">
        <div className="toolbar-search">
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder={t('searchSuppliersPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-secondary" onClick={load} title={t('refresh')}><RefreshCw size={15} /></button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          {t('loadingSuppliers')}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('colSupplier')}</th>
                <th>{t('colContact')}</th>
                <th>{t('colPhoneTel')}</th>
                <th>{t('email')}</th>
                <th>{t('colCountry')}</th>
                <th>{t('colWebsite')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noSuppliersFound')}</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{s.contactName || '—'}</td>
                  <td style={{ fontSize: 12 }}>
                    {s.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{s.phone}</div>}
                    {s.telephone && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.telephone}</div>}
                    {!s.phone && !s.telephone && '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {s.email
                      ? <a href={`mailto:${s.email}`} style={{ color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{s.email}</a>
                      : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {s.country ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{s.country}</span> : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {s.website
                      ? <a href={s.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={11} />{t('visit')}</a>
                      : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`edit-supplier-${s.id}`} className="btn-secondary" style={{ padding: '5px 10px' }} onClick={() => openEdit(s)} title={t('edit')}><Pencil size={13} /></button>
                      <button id={`delete-supplier-${s.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: deleting === s.id ? 0.5 : 1 }} onClick={() => handleDelete(s.id)} disabled={deleting === s.id} title={t('delete')}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <SupplierModal supplier={editing} onClose={closeModal} onSaved={onSaved} />
      )}
    </div>
  );
}
