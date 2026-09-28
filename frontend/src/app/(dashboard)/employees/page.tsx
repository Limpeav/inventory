'use client';

import { useState, useEffect, useCallback } from 'react';
import { employeeApi, Employee, CreateEmployeeRequest } from '@/lib/employee-api';
import {
  Users, Plus, Pencil, Trash2, X, Search, AlertCircle,
  Phone, MapPin, Calendar, RefreshCw, UserCheck, UserX
} from 'lucide-react';

// ─── Modal ────────────────────────────────────────────────────────────────────
function EmployeeModal({
  employee,
  onClose,
  onSaved,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CreateEmployeeRequest>({
    name: employee?.name ?? '',
    gender: employee?.gender ?? '',
    phone: employee?.phone ?? '',
    address: employee?.address ?? '',
    startDate: employee?.startDate ?? '',
    pictureUrl: employee?.pictureUrl ?? '',
    description: employee?.description ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (k: keyof CreateEmployeeRequest, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        startDate: form.startDate || undefined,
        gender: form.gender || undefined,
      };
      if (employee) {
        await employeeApi.update(employee.id, payload);
      } else {
        await employeeApi.create(payload);
      }
      onSaved();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {employee ? 'Edit Employee' : 'Add Employee'}
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Full Name *</label>
              <input className="input-field" required value={form.name} onChange={e => handle('name', e.target.value)} placeholder="Employee full name" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input-field" value={form.gender} onChange={e => handle('gender', e.target.value)}>
                <option value="">— Select —</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input-field" value={form.phone} onChange={e => handle('phone', e.target.value)} placeholder="+855 xx xxx xxx" />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input className="input-field" type="date" value={form.startDate} onChange={e => handle('startDate', e.target.value)} />
            </div>
            <div>
              <label className="label">Picture URL</label>
              <input className="input-field" value={form.pictureUrl} onChange={e => handle('pictureUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Address</label>
              <input className="input-field" value={form.address} onChange={e => handle('address', e.target.value)} placeholder="Home address" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Description / Notes</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => handle('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : employee ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, pictureUrl, gender }: { name: string; pictureUrl?: string; gender?: string }) {
  if (pictureUrl) {
    return <img src={pictureUrl} alt={name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />;
  }
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const bg = gender === 'F' ? '#ec4899' : '#6366f1';
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${bg}33`, color: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
      {initials}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setEmployees(await employeeApi.getAll()); }
    catch { /* swallow */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return !q || e.name.toLowerCase().includes(q) || (e.phone ?? '').includes(q) || (e.address ?? '').toLowerCase().includes(q);
  });

  const handleDeactivate = async (id: string) => {
    if (!confirm('Deactivate this employee?')) return;
    setDeleting(id);
    try { await employeeApi.delete(id); await load(); }
    catch { alert('Operation failed'); }
    finally { setDeleting(null); }
  };

  const openEdit = (e: Employee) => { setEditing(e); setModalOpen(true); };
  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const onSaved = async () => { closeModal(); await load(); };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.active).length,
    inactive: employees.filter(e => !e.active).length,
    male: employees.filter(e => e.gender === 'M').length,
    female: employees.filter(e => e.gender === 'F').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Employees</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your team members and staff</p>
        </div>
        <button id="create-employee-btn" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Staff',  value: stats.total,    icon: Users,     color: '#6366f1' },
          { label: 'Active',       value: stats.active,   icon: UserCheck, color: '#10b981' },
          { label: 'Inactive',     value: stats.inactive, icon: UserX,     color: '#ef4444' },
          { label: 'Male / Female',value: `${stats.male} / ${stats.female}`, icon: Users, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" style={{ paddingLeft: 40 }} placeholder="Search by name, phone, address..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-secondary" onClick={load} title="Refresh"><RefreshCw size={15} /></button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
          Loading employees...
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No employees found</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={emp.name} pictureUrl={emp.pictureUrl} gender={emp.gender} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {emp.gender === 'M' ? '♂ Male' : emp.gender === 'F' ? '♀ Female' : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {emp.phone
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{emp.phone}</span>
                      : '—'}
                  </td>
                  <td style={{ fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp.address
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{emp.address}</span>
                      : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {emp.startDate
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} />{new Date(emp.startDate).toLocaleDateString()}</span>
                      : '—'}
                  </td>
                  <td>
                    {emp.active
                      ? <span className="badge badge-active">Active</span>
                      : <span className="badge badge-inactive">Inactive</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button id={`edit-employee-${emp.id}`} className="btn-secondary" style={{ padding: '5px 10px' }} onClick={() => openEdit(emp)}><Pencil size={13} /></button>
                      {emp.active && (
                        <button id={`deactivate-employee-${emp.id}`} className="btn-danger" style={{ padding: '5px 10px', opacity: deleting === emp.id ? 0.5 : 1 }} onClick={() => handleDeactivate(emp.id)} disabled={deleting === emp.id} title="Deactivate"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <EmployeeModal employee={editing} onClose={closeModal} onSaved={onSaved} />
      )}
    </div>
  );
}
