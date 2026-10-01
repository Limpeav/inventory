'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { dashboardApi, DashboardStats } from '@/lib/dashboard-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Users, Package, TrendingUp, AlertTriangle, ArrowUpRight,
  ShoppingCart, Receipt, RotateCcw, Warehouse,
  DollarSign, Activity, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header-row stagger-1">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {t('welcomeBack')}, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'Admin'}</span> 👋
            </h1>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '3px 10px', borderRadius: '20px',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
              fontSize: '11px', fontWeight: '600', color: '#10b981',
            }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span>Live System</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {t('dashboardSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            id="dashboard-new-sale-btn"
            href="/sales"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              padding: '10px 18px',
            }}
          >
            <Receipt size={16} />
            {t('newSale')}
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {stats && stats.lowStockCount > 0 && (
        <div
          className="stagger-2"
          style={{
            marginBottom: '24px', padding: '14px 20px', borderRadius: '14px',
            background: 'linear-gradient(90deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.06) 100%)',
            border: '1px solid rgba(239,68,68,0.3)',
            boxShadow: '0 4px 20px rgba(239,68,68,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.22)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#ef4444',
              boxShadow: '0 0 12px rgba(239,68,68,0.3)',
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot pulse-dot-danger" style={{ width: 7, height: 7 }} />
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#f87171' }}>
                  {t('reorderAlert')}: {stats.lowStockCount} {t('lowStockCount')}!
                </p>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t('stockSubtitle')}
              </p>
            </div>
          </div>
          <Link
            href="/stock"
            style={{
              fontSize: '13px', fontWeight: '600', color: '#f87171',
              display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
              padding: '6px 12px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(239,68,68,0.22)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(239,68,68,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)';
            }}
          >
            {t('viewAll')} <ChevronRight size={15} />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div
        className="stagger-3"
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px', marginBottom: '28px',
        }}
      >
        {/* Card 1: Month Revenue */}
        <div className="glass-card card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.06) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.15)',
            }}>
              <DollarSign size={22} color="#6366f1" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px',
              background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}>
              {t('thisMonth')}
            </span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '6px 0 12px' }}>
              <div className="skeleton" style={{ width: '70%', height: '30px' }} />
              <div className="skeleton" style={{ width: '45%', height: '14px' }} />
            </div>
          ) : (
            <>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                {formatCurrency(stats?.monthRevenue)}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('monthlyRevenue')}
              </p>
            </>
          )}
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '12px', color: 'var(--text-muted)',
          }}>
            <span>{t('todaySales')}:</span>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              {loading ? '...' : `${formatCurrency(stats?.todayRevenue)} (${stats?.todaySaleCount || 0})`}
            </span>
          </div>
        </div>

        {/* Card 2: Month Spend / Purchases */}
        <div className="glass-card card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.06) 100%)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245,158,11,0.15)',
            }}>
              <ShoppingCart size={22} color="#f59e0b" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px',
              background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
              border: '1px solid rgba(245,158,11,0.25)',
            }}>
              {t('navPurchases')}
            </span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '6px 0 12px' }}>
              <div className="skeleton" style={{ width: '70%', height: '30px' }} />
              <div className="skeleton" style={{ width: '45%', height: '14px' }} />
            </div>
          ) : (
            <>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                {formatCurrency(stats?.monthSpend)}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('procurementSpend')}
              </p>
            </>
          )}
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '12px', color: 'var(--text-muted)',
          }}>
            <span>{t('procurementOrders')}:</span>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              {loading ? '...' : (stats?.monthPurchaseCount || 0)} orders
            </span>
          </div>
        </div>

        {/* Card 3: Products & Stock */}
        <div className="glass-card card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.06) 100%)',
              border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.15)',
            }}>
              <Package size={22} color="#10b981" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px',
              background: 'rgba(16,185,129,0.15)', color: '#34d399',
              border: '1px solid rgba(16,185,129,0.25)',
            }}>
              {t('navProducts')}
            </span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '6px 0 12px' }}>
              <div className="skeleton" style={{ width: '60%', height: '30px' }} />
              <div className="skeleton" style={{ width: '45%', height: '14px' }} />
            </div>
          ) : (
            <>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                {stats?.totalProducts ?? 0}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('totalProducts')}
              </p>
            </>
          )}
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '12px',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span style={{
              fontWeight: '700',
              color: stats?.lowStockCount ? '#f87171' : '#10b981',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span className={`pulse-dot ${stats?.lowStockCount ? 'pulse-dot-danger' : ''}`} style={{ width: 6, height: 6 }} />
              {stats?.lowStockCount ? `${stats.lowStockCount} ${t('lowStockCount')}` : t('allStockSufficient')}
            </span>
          </div>
        </div>

        {/* Card 4: Network (Customers & Suppliers) */}
        <div className="glass-card card-interactive" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.06) 100%)',
              border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139,92,246,0.15)',
            }}>
              <Users size={22} color="#8b5cf6" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px',
              background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.25)',
            }}>
              {t('customersSuppliers')}
            </span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '6px 0 12px' }}>
              <div className="skeleton" style={{ width: '60%', height: '30px' }} />
              <div className="skeleton" style={{ width: '45%', height: '14px' }} />
            </div>
          ) : (
            <>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                {stats?.totalCustomers || 0} <span style={{ fontSize: '18px', fontWeight: '400', color: 'var(--text-muted)' }}>/</span> {stats?.totalSuppliers || 0}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('customersSuppliers')}
              </p>
            </>
          )}
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '12px', color: 'var(--text-muted)',
          }}>
            <span>Staff:</span>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats?.totalEmployees || 0} {t('activeEmployeesCount')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-split-grid">
        {/* Left Column: Low Stock Alerts & Top Selling Products */}
        <div className="stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Low Stock Watchlist */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Warehouse size={18} color="#f59e0b" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {t('lowStockWatchlist')}
                </h2>
              </div>
              <Link
                href="/stock"
                style={{
                  fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '3px',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)'; }}
              >
                {t('viewAll')} <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }}>
                <div className="skeleton" style={{ width: '100%', height: '40px' }} />
                <div className="skeleton" style={{ width: '100%', height: '40px' }} />
                <div className="skeleton" style={{ width: '100%', height: '40px' }} />
              </div>
            ) : !stats?.lowStockAlerts || stats.lowStockAlerts.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '36px 16px',
                background: 'var(--bg-subtle)', borderRadius: '12px',
                border: '1px dashed var(--border-subtle)',
              }}>
                <CheckCircle2 size={34} color="#10b981" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{t('allStockHealthy')}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{t('noProductsNeedRestock')}</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 12px 12px' }}>{t('colProduct')}</th>
                      <th style={{ padding: '8px 12px 12px' }}>{t('currentStock')}</th>
                      <th style={{ padding: '8px 12px 12px' }}>{t('colReorder')}</th>
                      <th style={{ padding: '8px 12px 12px', textAlign: 'right' }}>{t('colActions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockAlerts.map(alert => (
                      <tr key={alert.productId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {alert.productName}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700',
                            background: 'rgba(239,68,68,0.15)', color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.3)',
                          }}>
                            {alert.quantity}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                          {alert.reorderLevel}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <Link
                            href="/purchases"
                            style={{
                              fontSize: '12px', fontWeight: '600', color: 'var(--primary-light)',
                              display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none',
                              padding: '4px 10px', borderRadius: '6px',
                              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.2)';
                              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.1)';
                              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                            }}
                          >
                            {t('newPurchase')} <ArrowUpRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Selling Products */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={18} color="#10b981" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {t('topSellingProducts')}
                </h2>
              </div>
              <Link
                href="/products"
                style={{
                  fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '3px',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)'; }}
              >
                {t('productCatalog')} <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
                <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
                <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '10px' }} />
              </div>
            ) : !stats?.topProducts || stats.topProducts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('noSalesData')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.topProducts.map((p, idx) => {
                  const rankColors = [
                    { bg: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))', color: '#f59e0b', border: 'rgba(245,158,11,0.4)' },
                    { bg: 'linear-gradient(135deg, rgba(148,163,184,0.3), rgba(148,163,184,0.1))', color: '#94a3b8', border: 'rgba(148,163,184,0.4)' },
                    { bg: 'linear-gradient(135deg, rgba(180,83,9,0.25), rgba(180,83,9,0.08))', color: '#d97706', border: 'rgba(180,83,9,0.35)' },
                  ];
                  const rank = rankColors[idx] || { bg: 'rgba(99,102,241,0.12)', color: 'var(--primary-light)', border: 'rgba(99,102,241,0.2)' };

                  return (
                    <div
                      key={p.productId || idx}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)';
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.05)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
                        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-subtle)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '10px',
                          background: rank.bg,
                          color: rank.color,
                          border: `1px solid ${rank.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '13px',
                          boxShadow: idx === 0 ? '0 2px 8px rgba(245,158,11,0.2)' : 'none',
                        }}>
                          #{idx + 1}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {p.productName}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {p.totalSold} {t('quantity')}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>
                        {formatCurrency(p.totalRevenue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Sales Activity & Quick Actions */}
        <div className="stagger-5" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Shortcuts */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('quickActions')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              <Link href="/sales" className="shortcut-card">
                <Receipt size={17} color="#6366f1" className="shortcut-icon" />
                <span>{t('salesOrder')}</span>
              </Link>
              <Link href="/purchases" className="shortcut-card">
                <ShoppingCart size={17} color="#f59e0b" className="shortcut-icon" />
                <span>{t('purchaseOrder')}</span>
              </Link>
              <Link href="/stock" className="shortcut-card">
                <Warehouse size={17} color="#10b981" className="shortcut-icon" />
                <span>{t('adjustStock')}</span>
              </Link>
              <Link href="/returns" className="shortcut-card">
                <RotateCcw size={17} color="#ec4899" className="shortcut-icon" />
                <span>{t('saleReturn')}</span>
              </Link>
            </div>
          </div>

          {/* Recent Sales List */}
          <div className="glass-card" style={{ padding: '24px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={18} color="var(--primary-light)" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {t('recentSales')}
                </h2>
              </div>
              <Link
                href="/sales"
                style={{
                  fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '3px',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateX(0)'; }}
              >
                {t('viewAll')} <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton" style={{ width: '100%', height: '46px', borderRadius: '8px' }} />
                <div className="skeleton" style={{ width: '100%', height: '46px', borderRadius: '8px' }} />
                <div className="skeleton" style={{ width: '100%', height: '46px', borderRadius: '8px' }} />
              </div>
            ) : !stats?.recentSales || stats.recentSales.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('noRecentSales')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {stats.recentSales.map((sale, i) => (
                  <div
                    key={sale.id || i}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 10px',
                      borderRadius: '8px',
                      borderBottom: i < stats.recentSales.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      transition: 'background-color 0.15s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.06)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {sale.invoiceCode || 'INV-SALE'}
                        </span>
                        <span style={{
                          fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px',
                          background: sale.status === 'COMPLETED' ? 'rgba(16,185,129,0.15)' :
                                      sale.status === 'CANCELLED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                          color: sale.status === 'COMPLETED' ? '#34d399' :
                                 sale.status === 'CANCELLED' ? '#f87171' : '#fbbf24',
                          border: `1px solid ${
                            sale.status === 'COMPLETED' ? 'rgba(16,185,129,0.3)' :
                            sale.status === 'CANCELLED' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'
                          }`,
                        }}>
                          {sale.status === 'COMPLETED' ? t('active') : sale.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {sale.customerName ? `${t('colCustomer', 'Customer')}: ${sale.customerName}` : 'Walk-in Customer'} • {sale.saleDate}
                      </p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
