'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Pencil, Trash2, X, Loader2, Users as UsersIcon, RefreshCw } from 'lucide-react';
import { userApi } from '@/lib/user-api';
import { roleApi } from '@/lib/role-api';
import { useAuthStore } from '@/store/auth-store';
import type { User, Role } from '@/types';

const createSchema = z.object({
  username: z.string().min(3, 'Min 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  fullName: z.string().min(1, 'Full name required'),
  roleIds: z.array(z.string()).min(1, 'Select at least one role'),
});

const updateSchema = z.object({
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  fullName: z.string().optional(),
  active: z.boolean().optional(),
  roleIds: z.array(z.string()).optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

export default function UsersPage() {
  const { hasRole } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && hasRole('ADMIN');

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema), defaultValues: { roleIds: [] } });
  const updateForm = useForm<UpdateForm>({ resolver: zodResolver(updateSchema) });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.allSettled([userApi.getAll(), roleApi.getAll()]);
      if (usersRes.status === 'fulfilled' && usersRes.value?.success) setUsers(usersRes.value.data);
      if (rolesRes.status === 'fulfilled' && rolesRes.value?.success) setRoles(rolesRes.value.data);
    } catch {
      // Gracefully handle any unexpected errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (user: User) => {
    setSelected(user);
    updateForm.reset({
      email: user.email,
      fullName: user.fullName,
      active: user.active,
      roleIds: user.roles.map(r => r.id),
    });
    setModal('edit');
  };

  const handleCreate = async (data: CreateForm) => {
    setSaving(true); setError('');
    try {
      await userApi.create(data);
      setModal(null);
      createForm.reset();
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to create user');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (data: UpdateForm) => {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      await userApi.update(selected.id, data);
      setModal(null);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to update user');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await userApi.delete(selected.id);
      setModal(null);
      load();
    } finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>User Management</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage system users and their access roles
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={load} id="refresh-users">
            <RefreshCw size={14} /> Refresh
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={() => { setModal('create'); setError(''); createForm.reset({ roleIds: [] }); }} id="create-user-btn">
              <Plus size={16} /> Add User
            </button>
          )}
        </div>
      </div>

      {/* Search + stats */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search users by name, username or email..."
            className="input-field"
            style={{ paddingLeft: '36px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>{users.length}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#34d399' }}>{users.filter(u => u.active).length}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#f87171' }}>{users.filter(u => !u.active).length}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inactive</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px', color: 'var(--text-muted)' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Loading users...
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Username</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                      <UsersIcon size={32} style={{ margin: '0 auto 10px', opacity: 0.3, display: 'block' }} />
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, i) => (
                    <tr key={user.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: '700', color: 'white',
                          }}>
                            {user.fullName[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{user.fullName}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--primary-light)' }}>
                        @{user.username}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {user.roles.map(r => (
                            <span key={r.id} className="badge badge-role">{r.name}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${user.active ? 'badge-active' : 'badge-inactive'}`}>
                          {user.active ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        {isAdmin ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-secondary" onClick={() => openEdit(user)} style={{ padding: '6px 10px' }}>
                              <Pencil size={13} />
                            </button>
                            <button className="btn-danger" onClick={() => { setSelected(user); setModal('delete'); }} style={{ padding: '6px 10px' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modal === 'create' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Add New User</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            {error && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={createForm.handleSubmit(handleCreate)} autoComplete="off">
              <FormField label="Full Name" error={createForm.formState.errors.fullName?.message}>
                <input className="input-field" placeholder="John Doe" {...createForm.register('fullName')} />
              </FormField>
              <FormField label="Username" error={createForm.formState.errors.username?.message}>
                <input className="input-field" placeholder="johndoe" autoComplete="off" {...createForm.register('username')} />
              </FormField>
              <FormField label="Email" error={createForm.formState.errors.email?.message}>
                <input type="email" className="input-field" placeholder="john@example.com" {...createForm.register('email')} />
              </FormField>
              <FormField label="Password" error={createForm.formState.errors.password?.message}>
                <input type="password" className="input-field" placeholder="Min 8 characters" autoComplete="new-password" {...createForm.register('password')} />
              </FormField>
              <FormField label="Roles" error={createForm.formState.errors.roleIds?.message}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {roles.map(role => {
                    const selected = createForm.watch('roleIds').includes(role.id);
                    return (
                      <label key={role.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '8px 14px', borderRadius: '8px',
                        background: selected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${selected ? 'rgba(99,102,241,0.4)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.15s ease',
                      }}>
                        <input type="checkbox" value={role.id}
                          checked={selected}
                          onChange={e => {
                            const curr = createForm.getValues('roleIds');
                            if (e.target.checked) createForm.setValue('roleIds', [...curr, role.id]);
                            else createForm.setValue('roleIds', curr.filter(id => id !== role.id));
                          }}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '500', color: selected ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
                          {role.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </FormField>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modal === 'edit' && selected && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Edit User</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            {error && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={updateForm.handleSubmit(handleUpdate)}>
              <FormField label="Full Name" error={updateForm.formState.errors.fullName?.message}>
                <input className="input-field" {...updateForm.register('fullName')} />
              </FormField>
              <FormField label="Email" error={updateForm.formState.errors.email?.message}>
                <input type="email" className="input-field" {...updateForm.register('email')} />
              </FormField>
              <FormField label="Status">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" {...updateForm.register('active')} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Active</span>
                </label>
              </FormField>
              <FormField label="Roles">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {roles.map(role => {
                    const isSelected = updateForm.watch('roleIds')?.includes(role.id);
                    return (
                      <label key={role.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '8px 14px', borderRadius: '8px',
                        background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isSelected ? 'rgba(99,102,241,0.4)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.15s ease',
                      }}>
                        <input type="checkbox" value={role.id}
                          checked={!!isSelected}
                          onChange={e => {
                            const curr = updateForm.getValues('roleIds') || [];
                            if (e.target.checked) updateForm.setValue('roleIds', [...curr, role.id]);
                            else updateForm.setValue('roleIds', curr.filter(id => id !== role.id));
                          }}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '500', color: isSelected ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
                          {role.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </FormField>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && selected && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <Trash2 size={24} color="#f87171" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Delete User?</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{selected.fullName}</strong>?
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button className="btn-danger" onClick={handleDelete} disabled={saving}>
                  {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Deleting...</> : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label className="label">{label}</label>
      {children}
      {error && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}
