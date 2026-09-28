'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { dashboardApi, DashboardStats } from '@/lib/dashboard-api';
import { useTranslation } from '@/lib/i18n/translations';
import {
  Users, Package, TrendingUp, AlertTriangle, ArrowUpRight,
  ShoppingCart, Receipt, RotateCcw, RefreshCw, Warehouse,
  DollarSign, Activity, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '28px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {t('welcomeBack')}, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'Admin'}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {t('dashboardSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '10px',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? t('syncing') : t('sync')}
          </button>
          <Link
            href="/sales"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#ffffff', fontSize: '13px', fontWeight: '600',
              textDecoration: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}
          >
            <Receipt size={16} />
            {t('newSale')}
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {stats && stats.lowStockCount > 0 && (
        <div style={{
          marginBottom: '24px', padding: '14px 20px', borderRadius: '12px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(239,68,68,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#ef4444',
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#f87171' }}>
                {t('reorderAlert')}: {stats.lowStockCount} {t('lowStockCount')}!
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {t('stockSubtitle')}
              </p>
            </div>
          </div>
          <Link
            href="/stock"
            style={{
              fontSize: '13px', fontWeight: '600', color: '#f87171',
              display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
            }}
          >
            {t('viewAll')} <ChevronRight size={15} />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px', marginBottom: '28px',
      }}>
        {/* Card 1: Month Revenue */}
        <div className="glass-card animate-slide-up" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DollarSign size={22} color="#6366f1" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
              background: 'rgba(99,102,241,0.15)', color: '#818cf8',
            }}>
              {t('thisMonth')}
            </span>
          </div>
          <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {loading ? '...' : formatCurrency(stats?.monthRevenue)}
          </p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {t('monthlyRevenue')}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {t('todaySales')}: {loading ? '...' : formatCurrency(stats?.todayRevenue)} ({stats?.todaySaleCount || 0} {t('navSales')})
          </p>
        </div>

        {/* Card 2: Month Spend / Purchases */}
        <div className="glass-card animate-slide-up" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={22} color="#f59e0b" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
              background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
            }}>
              {t('navPurchases')}
            </span>
          </div>
          <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {loading ? '...' : formatCurrency(stats?.monthSpend)}
          </p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {t('procurementSpend')}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {stats?.monthPurchaseCount || 0} {t('procurementOrders')}
          </p>
        </div>

        {/* Card 3: Products & Stock */}
        <div className="glass-card animate-slide-up" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={22} color="#10b981" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
              background: 'rgba(16,185,129,0.15)', color: '#34d399',
            }}>
              {t('navProducts')}
            </span>
          </div>
          <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {loading ? '...' : (stats?.totalProducts ?? 0)}
          </p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {t('totalProducts')}
          </p>
          <p style={{ fontSize: '12px', color: stats?.lowStockCount ? '#f87171' : 'var(--text-muted)' }}>
            {stats?.lowStockCount ? `⚠️ ${stats.lowStockCount} ${t('lowStockCount')}` : t('allStockSufficient')}
          </p>
        </div>

        {/* Card 4: Network (Customers & Suppliers) */}
        <div className="glass-card animate-slide-up" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={22} color="#8b5cf6" />
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
              background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
            }}>
              {t('customersSuppliers')}
            </span>
          </div>
          <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {loading ? '...' : `${stats?.totalCustomers || 0} / ${stats?.totalSuppliers || 0}`}
          </p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {t('customersSuppliers')}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {stats?.totalEmployees || 0} {t('activeEmployeesCount')}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Left Column: Low Stock Alerts & Top Selling Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Low Stock Watchlist */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Warehouse size={18} color="#f59e0b" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {t('lowStockWatchlist')}
                </h2>
              </div>
              <Link href="/stock" style={{ fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: '600' }}>
                {t('viewAll')}
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('loading')}</p>
            ) : !stats?.lowStockAlerts || stats.lowStockAlerts.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '32px 16px',
                background: 'var(--bg-subtle)', borderRadius: '10px',
              }}>
                <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{t('allStockHealthy')}</p>
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
                            padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '700',
                            background: 'rgba(239,68,68,0.15)', color: '#f87171',
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
              <Link href="/products" style={{ fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: '600' }}>
                {t('productCatalog')}
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('loading')}</p>
            ) : !stats?.topProducts || stats.topProducts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('noSalesData')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.topProducts.map((p, idx) => (
                  <div
                    key={p.productId || idx}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: idx === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.15)',
                        color: idx === 0 ? '#f59e0b' : 'var(--primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: '12px',
                      }}>
                        #{idx + 1}
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {p.productName}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p.totalSold} {t('quantity')}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>
                      {formatCurrency(p.totalRevenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Sales Activity & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Shortcuts */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('quickActions')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link
                href="/sales"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px', borderRadius: '10px', background: 'var(--bg-subtle)',
                  textDecoration: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
                  border: '1px solid var(--border-subtle)', transition: 'all 0.15s ease',
                }}
              >
                <Receipt size={16} color="#6366f1" />
                {t('salesOrder')}
              </Link>
              <Link
                href="/purchases"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px', borderRadius: '10px', background: 'var(--bg-subtle)',
                  textDecoration: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
                  border: '1px solid var(--border-subtle)', transition: 'all 0.15s ease',
                }}
              >
                <ShoppingCart size={16} color="#f59e0b" />
                {t('purchaseOrder')}
              </Link>
              <Link
                href="/stock"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px', borderRadius: '10px', background: 'var(--bg-subtle)',
                  textDecoration: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
                  border: '1px solid var(--border-subtle)', transition: 'all 0.15s ease',
                }}
              >
                <Warehouse size={16} color="#10b981" />
                {t('adjustStock')}
              </Link>
              <Link
                href="/returns"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px', borderRadius: '10px', background: 'var(--bg-subtle)',
                  textDecoration: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
                  border: '1px solid var(--border-subtle)', transition: 'all 0.15s ease',
                }}
              >
                <RotateCcw size={16} color="#ec4899" />
                {t('saleReturn')}
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
              <Link href="/sales" style={{ fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: '600' }}>
                {t('viewAll')}
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('loading')}</p>
            ) : !stats?.recentSales || stats.recentSales.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>{t('noRecentSales')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {stats.recentSales.map((sale, i) => (
                  <div
                    key={sale.id || i}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < stats.recentSales.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {sale.invoiceCode || 'INV-SALE'}
                        </span>
                        <span style={{
                          fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px',
                          background: sale.status === 'COMPLETED' ? 'rgba(16,185,129,0.15)' :
                                      sale.status === 'CANCELLED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                          color: sale.status === 'COMPLETED' ? '#34d399' :
                                 sale.status === 'CANCELLED' ? '#f87171' : '#fbbf24',
                        }}>
                          {sale.status === 'COMPLETED' ? t('active') : sale.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {sale.customerName ? `${t('colCustomer', 'Customer')}: ${sale.customerName}` : 'Walk-in Customer'} • {sale.saleDate}
                      </p>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
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
