'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { expenseApi, Expense, ExpenseCategory } from '@/lib/expense-api';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n/translations';
import {
  DollarSign, Plus, Search, Trash2, Edit3,
  AlertCircle, X, Calendar, Tag, FileText, CheckCircle2, Clock
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

export default function ExpensesPage() {
  const { hasRole } = useAuthStore();
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [amount, setAmount] = useState<number | ''>('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryCode, setCategoryCode] = useState<number | ''>('');
  const [referenceNo, setReferenceNo] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PAID');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Quick Add Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [savingCat, setSavingCat] = useState(false);
  const [catError, setCatError] = useState('');

  // Edit Modal
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expList, catList] = await Promise.all([
        expenseApi.getAll({
          from: fromDate || undefined,
          to: toDate || undefined,
          categoryCode: selectedCategory !== 'ALL' ? Number(selectedCategory) : undefined,
        }),
        expenseApi.getCategories(),
      ]);
      setExpenses(expList);
      setCategories(catList);
    } catch (err) {
      console.error('Failed to load expenses', err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Expense amount must be greater than zero');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await expenseApi.create({
        amount: Number(amount),
        expenseDate,
        categoryCode: categoryCode !== '' ? Number(categoryCode) : undefined,
        referenceNo: referenceNo.trim() || undefined,
        description: description.trim() || undefined,
        status,
      });
      setShowCreateModal(false);
      setAmount('');
      setReferenceNo('');
      setDescription('');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to record expense');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCatError('Category name is required');
      return;
    }

    setSavingCat(true);
    setCatError('');
    try {
      const created = await expenseApi.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
      });
      setCategories(prev => [...prev, created]);
      setCategoryCode(created.categoryCode);
      setShowCategoryModal(false);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      setCatError(err?.response?.data?.message || 'Failed to create category');
    } finally {
      setSavingCat(false);
    }
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    setSaving(true);
    setError('');
    try {
      await expenseApi.update(editingExpense.id, {
        amount: editingExpense.amount,
        expenseDate: editingExpense.expenseDate,
        categoryCode: editingExpense.categoryCode,
        referenceNo: editingExpense.referenceNo,
        description: editingExpense.description,
        status: editingExpense.status,
      });
      setEditingExpense(null);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await expenseApi.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete expense');
    }
  };

  const filteredExpenses = expenses.filter(exp => {
    const q = search.toLowerCase();
    const matchDesc = exp.description?.toLowerCase().includes(q) ?? false;
    const matchRef = exp.referenceNo?.toLowerCase().includes(q) ?? false;
    const matchCat = exp.categoryName?.toLowerCase().includes(q) ?? false;
    return q === '' || matchDesc || matchRef || matchCat;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, fromDate]);

  const paginatedExpenses = useMemo(() => {
    if (filteredExpenses.length <= PAGE_SIZE) return filteredExpenses;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredExpenses.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredExpenses, currentPage]);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const currentMonth = new Date().toISOString().substring(0, 7);
  const thisMonthExpenses = expenses
    .filter(e => e.expenseDate && e.expenseDate.startsWith(currentMonth))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const formatCurrency = (val?: number) => {
    if (val == null) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign size={24} color="#ec4899" />
            Expenses Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            Track and manage operational overhead, utilities, supplies, and business expenditures
          </p>
        </div>

        {hasRole('ADMIN') && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { setShowCategoryModal(true); setCatError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '10px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <Tag size={16} />
              + New Category
            </button>
            <button
              onClick={() => { setShowCreateModal(true); setError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                color: '#ffffff', fontSize: '13px', fontWeight: '600',
                border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
              }}
            >
              <Plus size={16} />
              Record Expense
            </button>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px', marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ec4899' }}>
            <DollarSign size={18} />
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Total Expenses</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(totalExpenseAmount)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {expenses.length} recorded entries
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#8b5cf6' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>This Month</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(thisMonthExpenses)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Current billing cycle
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#06b6d4' }}>
            <Tag size={18} />
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Categories</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {categories.length}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Active expense classifications
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{
        padding: '16px 20px', marginBottom: '20px',
        display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reference, description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px',
                background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
              }}
            />
          </div>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '9px 14px', borderRadius: '8px',
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.categoryCode} value={c.categoryCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: '12px',
            }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>to</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: '12px',
            }}
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(''); setToDate(''); }}
              style={{
                padding: '6px 10px', fontSize: '11px', borderRadius: '6px',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase',
              }}>
                <th style={{ padding: '14px 18px', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '14px 18px', fontWeight: '600' }}>Reference #</th>
                <th style={{ padding: '14px 18px', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '14px 18px', fontWeight: '600' }}>Description</th>
                <th style={{ padding: '14px 18px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: '600', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '14px 18px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No expenses found matching the criteria
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map(exp => (
                  <tr
                    key={exp.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '14px 18px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {exp.expenseDate}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                      {exp.referenceNo || `EXP-${exp.expenseCode || '—'}`}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                        background: 'rgba(236,72,153,0.1)', color: '#ec4899',
                      }}>
                        <Tag size={12} />
                        {exp.categoryName || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                      {exp.description || '—'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                        background: exp.status === 'PAID' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: exp.status === 'PAID' ? '#10b981' : '#f59e0b',
                      }}>
                        {exp.status === 'PAID' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {exp.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {formatCurrency(exp.amount)}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setEditingExpense(exp)}
                          title="Edit Expense"
                          style={{
                            padding: '6px', borderRadius: '6px', background: 'transparent',
                            border: '1px solid var(--border-subtle)', color: 'var(--text-muted)',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        {hasRole('ADMIN') && (
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            title="Delete Expense"
                            style={{
                              padding: '6px', borderRadius: '6px', background: 'transparent',
                              border: '1px solid var(--border-subtle)', color: '#ef4444',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (renders only if items > 25) */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredExpenses.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        itemLabel="expenses"
      />

      {/* Record Expense Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50, padding: '20px',
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '480px', borderRadius: '16px',
            padding: '24px', background: 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} color="#ec4899" />
                Record Expense
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={e => setExpenseDate(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowCategoryModal(true); setCatError(''); }}
                    style={{ fontSize: '11px', color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                  >
                    + Add New Category
                  </button>
                </div>
                <select
                  value={categoryCode}
                  onChange={e => setCategoryCode(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.categoryCode} value={c.categoryCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Reference # / Receipt
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. REC-1029"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Payment Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                    }}
                  >
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description / Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about this expenditure..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '9px 16px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: '#ffffff', fontSize: '13px', fontWeight: '600',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {saving ? 'Recording...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50, padding: '20px',
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '480px', borderRadius: '16px',
            padding: '24px', background: 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Edit Expense
              </h2>
              <button
                onClick={() => setEditingExpense(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editingExpense.expenseDate}
                    onChange={e => setEditingExpense({ ...editingExpense, expenseDate: e.target.value })}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={editingExpense.amount}
                    onChange={e => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={editingExpense.categoryCode || ''}
                  onChange={e => setEditingExpense({ ...editingExpense, categoryCode: e.target.value === '' ? undefined : Number(e.target.value) })}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px',
                  }}
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.categoryCode} value={c.categoryCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Reference #
                  </label>
                  <input
                    type="text"
                    value={editingExpense.referenceNo || ''}
                    onChange={e => setEditingExpense({ ...editingExpense, referenceNo: e.target.value })}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={editingExpense.status}
                    onChange={e => setEditingExpense({ ...editingExpense, status: e.target.value })}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontSize: '13px',
                    }}
                  >
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingExpense.description || ''}
                  onChange={e => setEditingExpense({ ...editingExpense, description: e.target.value })}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  style={{
                    padding: '9px 16px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: '#ffffff', fontSize: '13px', fontWeight: '600',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Category Modal */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 60, padding: '20px',
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '420px', borderRadius: '16px',
            padding: '24px', background: 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#ec4899" />
                New Expense Category
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {catError && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', marginBottom: '14px',
                background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '13px',
              }}>
                {catError}
              </div>
            )}

            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Rent, Utilities, Transport"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Optional brief notes..."
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  style={{
                    padding: '8px 14px', borderRadius: '8px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCat}
                  style={{
                    padding: '8px 18px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: '#ffffff', fontSize: '13px', fontWeight: '600',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {savingCat ? 'Saving...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
