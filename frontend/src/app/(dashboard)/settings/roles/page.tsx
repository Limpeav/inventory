'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Lock, RefreshCw } from 'lucide-react';
import { roleApi } from '@/lib/role-api';
import { useTranslation } from '@/lib/i18n/translations';
import type { Role, Permission } from '@/types';

const createSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).min(0),
});

const updateSchema = z.object({
  description: z.string().optional(),
  permissionIds: z.array(z.string()).min(0),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

export default function RolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createForm = useForm<CreateForm>({ resolver: zodResolver(createSchema) as any, defaultValues: { permissionIds: [] } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateForm = useForm<UpdateForm>({ resolver: zodResolver(updateSchema) as any, defaultValues: { permissionIds: [] } });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.allSettled([roleApi.getAll(), roleApi.getAllPermissions()]);
      if (rolesRes.status === 'fulfilled' && rolesRes.value?.success) setRoles(rolesRes.value.data);
      if (permsRes.status === 'fulfilled' && permsRes.value?.success) setPermissions(permsRes.value.data);
    } catch {
      // Gracefully handle any unexpected errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (role: Role) => {
    setSelected(role);
    updateForm.reset({
      description: role.description,
      permissionIds: role.permissions.map(p => p.id),
    });
    setModal('edit');
  };

  const handleCreate = async (data: CreateForm) => {
    setSaving(true); setError('');
    try {
      await roleApi.create({
        name: data.name,
        description: data.description ?? '',
        permissionIds: data.permissionIds ?? [],
      });
      setModal(null); createForm.reset({ permissionIds: [] }); load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to create role');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (data: UpdateForm) => {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      await roleApi.update(selected.id, data);
      setModal(null); load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Failed to update role');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await roleApi.delete(selected.id);
      setModal(null); load();
    } finally { setSaving(false); }
  };

  // Group permissions by resource
  const grouped = permissions.reduce((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{t('rolesAndAccess')}</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('rolesSubtitle')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={load} id="refresh-roles" title={t('refresh')}><RefreshCw size={14} /> {t('refresh')}</button>
          <button className="btn-primary" onClick={() => { setModal('create'); setError(''); createForm.reset({ permissionIds: [] }); }} id="create-role-btn">
            <Plus size={16} /> {t('addRole')}
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '12px', color: 'var(--text-muted)' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          {t('loadingRoles')}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {roles.map(role => (
            <div key={role.id} className="glass-card animate-slide-up" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: role.name === 'ADMIN' ? 'rgba(239,68,68,0.12)' :
                                role.name === 'MANAGER' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Shield size={20} color={
                      role.name === 'ADMIN' ? '#f87171' :
                      role.name === 'MANAGER' ? '#fbbf24' : '#818cf8'
                    } />
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>{role.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role.permissions.length} {t('permissions')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-secondary" onClick={() => openEdit(role)} style={{ padding: '6px 10px' }} title={t('edit')}>
                    <Pencil size={13} />
                  </button>
                  <button className="btn-danger" onClick={() => { setSelected(role); setModal('delete'); }} style={{ padding: '6px 10px' }} title={t('delete')}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {role.description && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  {role.description}
                </p>
              )}

              {/* Permissions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {role.permissions.map(p => (
                  <span key={p.id} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: '500',
                    background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)',
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}>
                    <Lock size={9} /> {p.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modal === 'create' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{t('createRole')}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            {error && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={createForm.handleSubmit(handleCreate)}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">{t('roleName')}</label>
                <input className="input-field" placeholder="e.g. SUPERVISOR" style={{ textTransform: 'uppercase' }} {...createForm.register('name')} />
                {createForm.formState.errors.name && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{createForm.formState.errors.name.message}</p>}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">{t('description')}</label>
                <textarea className="input-field" placeholder="Describe this role..." rows={2} style={{ resize: 'vertical' }} {...createForm.register('description')} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">{t('permissions')}</label>
                <PermissionPicker
                  grouped={grouped}
                  selected={createForm.watch('permissionIds')}
                  onChange={ids => createForm.setValue('permissionIds', ids)}
                  selectAllText={t('selectAll')}
                  clearAllText={t('clearAll')}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(null)}>{t('cancel')}</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</> : t('createRole')}
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
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{t('editRole')}: {selected.name}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            {error && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={updateForm.handleSubmit(handleUpdate)}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">{t('description')}</label>
                <textarea className="input-field" rows={2} style={{ resize: 'vertical' }} {...updateForm.register('description')} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">{t('permissions')}</label>
                <PermissionPicker
                  grouped={grouped}
                  selected={updateForm.watch('permissionIds') || []}
                  onChange={ids => updateForm.setValue('permissionIds', ids)}
                  selectAllText={t('selectAll')}
                  clearAllText={t('clearAll')}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(null)}>{t('cancel')}</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</> : t('saveChanges')}
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
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Trash2 size={24} color="#f87171" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{t('deleteRole')}</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                {t('deleteRoleConfirm')} (<strong style={{ color: 'var(--text-primary)' }}>{selected.name}</strong>)
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setModal(null)}>{t('cancel')}</button>
                <button className="btn-danger" onClick={handleDelete} disabled={saving}>
                  {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</> : t('deleteRole')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionPicker({ grouped, selected, onChange, selectAllText, clearAllText }: {
  grouped: Record<string, Permission[]>;
  selected: string[];
  onChange: (ids: string[]) => void;
  selectAllText: string;
  clearAllText: string;
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter(s => s !== id));
    else onChange([...selected, id]);
  };

  const toggleGroup = (perms: Permission[]) => {
    const allSelected = perms.every(p => selected.includes(p.id));
    if (allSelected) onChange(selected.filter(id => !perms.map(p => p.id).includes(id)));
    else onChange([...new Set([...selected, ...perms.map(p => p.id)])]);
  };

  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
      {Object.entries(grouped).map(([resource, perms], i) => (
        <div key={resource} style={{ borderBottom: i < Object.keys(grouped).length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: 'rgba(99,102,241,0.06)',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {resource}
            </span>
            <button type="button" onClick={() => toggleGroup(perms)} style={{
              fontSize: '11px', color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500',
            }}>
              {perms.every(p => selected.includes(p.id)) ? clearAllText : selectAllText}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px 14px' }}>
            {perms.map(p => {
              const active = selected.includes(p.id);
              return (
                <button key={p.id} type="button" onClick={() => toggle(p.id)} style={{
                  padding: '5px 12px', borderRadius: '6px', border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'var(--border-subtle)'}`,
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  {active && <span style={{ fontSize: '10px' }}>✓</span>}
                  {p.action}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
