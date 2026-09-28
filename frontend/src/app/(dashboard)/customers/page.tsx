'use client';

import { useState, useEffect, useCallback } from 'react';
import { customerApi, Customer, CreateCustomerRequest } from '@/lib/customer-api';
import {
  UserCheck, Plus, Pencil, Trash2, X, Search, AlertCircle,
  Phone, MapPin, DollarSign, RefreshCw, CreditCard
} from 'lucide-react';

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
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
            {customer ? 'Edit Customer' : 'Add Customer'}
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
            <div>
              <label className="label">Customer ID</label>
              <input className="input-field" value={form.customerId} onChange={e => handle('customerId', e.target.value)} placeholder="e.g. CUS-001" />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={e => handle('status', Number(e.target.value))}>
                <option value={0}>Active</option>
                <option value={1}>Inactive</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Customer Name *</label>
              <input className="input-field" required value={form.name} onChange={e => handle('name', e.target.value)} placeholder="Full name or company name" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input-field" value={form.phone} onChange={e => handle('phone', e.target.value)} placeholder="+855 xx xxx xxx" />
            </div>
            <div>
              <label className="label">Fax</label>
              <input className="input-field" value={form.fax} onChange={e => handle('fax', e.target.value)} placeholder="Fax number" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" value={form.email} onChange={e => handle('email', e.target.value)} placeholder="customer@email.com" />
            </div>
            <div>
              <label className="label">Province</label>
              <input className="input-field" value={form.province} onChange={e => handle('province', e.target.value)} placeholder="Province / City" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Address</label>
              <input className="input-field" value={form.address} onChange={e => handle('address', e.target.value)} placeholder="Full address" />
            </div>
            <div>
              <label className="label">Credit Limit ($)</label>
              <input className="input-field" type="number" step="0.01" min="0" value={form.creditLimit} onChange={e => handle('creditLimit', e.target.value)} />
            </div>
            <div>
              <label className="label">Credit Days</label>
              <input className="input-field" type="number" min="0" value={form.creditDays} onChange={e => handle('creditDays', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Description / Notes</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => handle('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : customer ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Customers</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your customer accounts and credit limits</p>
        </div>
        <button id="create-customer-btn" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Customers', value: stats.total,    icon: UserCheck,   color: '#6366f1' },
          { label: 'Active',          value: stats.active,   icon: UserCheck,   color: '#10b981' },
          { label: 'Inactive',        value: stats.inactive, icon: CreditCard,  color: '#ef4444' },
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
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder="Search by name, ID, phone, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="0">Active</option>
          <option value="1">Inactive</option>
        </select>
        <button className="btn-secondary" onClick={load} title="Refresh"><RefreshCw size={15} /></button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          Loading customers...
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Province</th>
                <th>Credit Limit</th>
                <th>Credit Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No customers found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{c.name}</div>
                    {c.customerId && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.customerId}</div>}
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
                  <td style={{ fontSize: 13 }}>{c.creditDays ?? 0} days</td>
                  <td>
                    {c.status === 0
                      ? <span className="badge badge-active">Active</span>
                      : <span className="badge badge-inactive">Inactive</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`edit-customer-${c.id}`} className="btn-secondary" style={{ padding: '5px 10px' }} onClick={() => openEdit(c)}><Pencil size={13} /></button>
                      <button id={`delete-customer-${c.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: deleting === c.id ? 0.5 : 1 }} onClick={() => handleDelete(c.id)} disabled={deleting === c.id}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <CustomerModal customer={editing} onClose={closeModal} onSaved={onSaved} />
      )}
    </div>
  );
}
