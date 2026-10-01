'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { customerApi, Customer, CreateCustomerRequest } from '@/lib/customer-api';
import { lookupApi, Province } from '@/lib/lookup-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  UserCheck, Plus, Pencil, Trash2, X, Search, AlertCircle,
  Phone, MapPin, DollarSign, RefreshCw, CreditCard
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

// ─── Modal ────────────────────────────────────────────────────────────────────
function CustomerModal({
  customer,
  onClose,
  onSaved,
}: {
  customer: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateCustomerRequest>({
    customerId: customer?.customerId ?? '',
    name: customer?.name ?? '',
    phone: customer?.phone ?? '',
    fax: customer?.fax ?? '',
    address: customer?.address ?? '',
    email: customer?.email ?? '',
    province: customer?.province ?? '',
    creditLimit: customer?.creditLimit ?? 0,
    creditDays: customer?.creditDays ?? 0,
    status: customer?.status ?? 0,
    description: customer?.description ?? '',
    employeeCode: customer?.employeeCode ?? '',
    vat: customer?.vat ?? '',
    nameKh: customer?.nameKh ?? '',
    addressKh: customer?.addressKh ?? '',
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    lookupApi.getProvinces().then(setProvinces).catch(() => {});
  }, []);

  const handle = (k: keyof CreateCustomerRequest, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        creditLimit: form.creditLimit ? Number(form.creditLimit) : 0,
        creditDays: Number(form.creditDays),
      };
      if (customer) {
        await customerApi.update(customer.id, payload);
      } else {
        await customerApi.create(payload);
      }
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {customer ? t('editCustomer') : t('addCustomer')}
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
            <div>
              <label className="label">{t('customerId')}</label>
              <input className="input-field" value={form.customerId} onChange={e => handle('customerId', e.target.value)} placeholder="e.g. CUS-001" />
            </div>
            <div>
              <label className="label">{t('status')}</label>
              <select className="input-field" value={form.status} onChange={e => handle('status', Number(e.target.value))}>
                <option value={0}>{t('active')}</option>
                <option value={1}>{t('inactive')}</option>
              </select>
            </div>
            <div>
              <label className="label">{t('customerNameRequired')}</label>
              <input className="input-field" required value={form.name} onChange={e => handle('name', e.target.value)} placeholder="Full name or company name" />
            </div>
            <div>
              <label className="label">Khmer Name (ឈ្មោះជាភាសាខ្មែរ)</label>
              <input className="input-field" value={form.nameKh} onChange={e => handle('nameKh', e.target.value)} placeholder="ឈ្មោះអតិថិជនជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="label">{t('phone')}</label>
              <input className="input-field" value={form.phone} onChange={e => handle('phone', e.target.value)} placeholder="+855 xx xxx xxx" />
            </div>
            <div>
              <label className="label">{t('fax')}</label>
              <input className="input-field" value={form.fax} onChange={e => handle('fax', e.target.value)} placeholder="Fax number" />
            </div>
            <div>
              <label className="label">{t('email')}</label>
              <input className="input-field" type="email" value={form.email} onChange={e => handle('email', e.target.value)} placeholder="customer@email.com" />
            </div>
            <div>
              <label className="label">{t('province')}</label>
              <input
                list="customer-provinces-list"
                className="input-field"
                value={form.province}
                onChange={e => handle('province', e.target.value)}
                placeholder="Select or enter province"
              />
              <datalist id="customer-provinces-list">
                {provinces.map(p => (
                  <option key={p.code} value={p.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="label">VAT Number</label>
              <input className="input-field" value={form.vat} onChange={e => handle('vat', e.target.value)} placeholder="e.g. K001-901234567" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('address')}</label>
              <input className="input-field" value={form.address} onChange={e => handle('address', e.target.value)} placeholder="Full address" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Khmer Address (អាសយដ្ឋានជាភាសាខ្មែរ)</label>
              <input className="input-field" value={form.addressKh} onChange={e => handle('addressKh', e.target.value)} placeholder="អាសយដ្ឋានជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="label">{t('creditLimit')}</label>
              <input className="input-field" type="number" step="0.01" min="0" value={form.creditLimit} onChange={e => handle('creditLimit', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('creditDays')}</label>
              <input className="input-field" type="number" min="0" value={form.creditDays} onChange={e => handle('creditDays', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">{t('notes')}</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => handle('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? t('saving') : customer ? t('saveChanges') : t('createCustomer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCustomers(await customerApi.getAll()); }
    catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.customerId ?? '').toLowerCase().includes(q) || (c.phone ?? '').includes(q) || (c.email ?? '').toLowerCase().includes(q);
    const matchS = filterStatus === '' || String(c.status) === filterStatus;
    return matchQ && matchS;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  const paginatedCustomers = useMemo(() => {
    if (filtered.length <= PAGE_SIZE) return filtered;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteCustomerConfirm'))) return;
    setDeleting(id);
    try { await customerApi.delete(id); await load(); }
    catch { alert('Cannot delete — customer may be in use.'); }
    finally { setDeleting(null); }
  };

  const openEdit = (c: Customer) => { setEditing(c); setModalOpen(true); };
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const onSaved = async () => { closeModal(); await load(); };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 0).length,
    inactive: customers.filter(c => c.status !== 0).length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('customers')}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('manageCustomers')}</p>
        </div>
        <button id="create-customer-btn" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> {t('addCustomer')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-stats-3">
        {[
          { label: t('totalCustomers'), value: stats.total,    icon: UserCheck,   color: '#6366f1' },
          { label: t('active'),          value: stats.active,   icon: UserCheck,   color: '#10b981' },
          { label: t('inactive'),        value: stats.inactive, icon: CreditCard,  color: '#ef4444' },
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
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder={t('searchCustomersPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t('allStatus')}</option>
          <option value="0">{t('active')}</option>
          <option value="1">{t('inactive')}</option>
        </select>
        <button className="btn-secondary" onClick={load} title={t('refresh')}><RefreshCw size={15} /></button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          {t('loadingCustomers')}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('colCustomer')}</th>
                <th>{t('colContact')}</th>
                <th>{t('colProvince')}</th>
                <th>{t('colCreditLimit')}</th>
                <th>{t('colCreditDays')}</th>
                <th>{t('colStatus')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>{t('noCustomersFound')}</td></tr>
              ) : paginatedCustomers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{c.name}</div>
                    {c.nameKh && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.nameKh}</div>}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                      {c.customerId && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.customerId}</span>}
                      {c.vat && <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '1px 5px', borderRadius: 4 }}>VAT: {c.vat}</span>}
                    </div>
                  </td>
                  <td>
                    {c.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}><Phone size={11} />{c.phone}</div>}
                    {c.email && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.email}</div>}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {c.province ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{c.province}</span> : '—'}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <DollarSign size={12} />{c.creditLimit != null ? Number(c.creditLimit).toFixed(2) : '0.00'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{c.creditDays ?? 0} {t('days')}</td>
                  <td>
                    {c.status === 0
                      ? <span className="badge badge-active">{t('active')}</span>
                      : <span className="badge badge-inactive">{t('inactive')}</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`edit-customer-${c.id}`} className="btn-secondary" style={{ padding: '5px 10px' }} onClick={() => openEdit(c)} title={t('edit')}><Pencil size={13} /></button>
                      <button id={`delete-customer-${c.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: deleting === c.id ? 0.5 : 1 }} onClick={() => handleDelete(c.id)} disabled={deleting === c.id} title={t('delete')}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (renders only if items > 25) */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        itemLabel="customers"
      />

      {modalOpen && (
        <CustomerModal customer={editing} onClose={closeModal} onSaved={onSaved} />
      )}
    </div>
  );
}
