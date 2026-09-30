'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Shield, Package, ChevronRight,
  LogOut, Settings, Bell, ShoppingCart, Truck, UserCheck,
  Tag, BarChart3, Warehouse, Receipt, RotateCcw, CreditCard, DollarSign,
  Menu, X
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/auth-api';
import Cookies from 'js-cookie';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useTranslation, TranslationKey } from '@/lib/i18n/translations';
import RealtimeProvider from '@/components/RealtimeProvider';

interface NavItemDef {
  href: string;
  translationKey: TranslationKey;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  section: 'main' | 'inventory' | 'transactions' | 'settings';
  roles?: string[];
}

const navItemDefs: NavItemDef[] = [
  { href: '/dashboard',            translationKey: 'navDashboard', label: 'Dashboard',   icon: LayoutDashboard, section: 'main' },
  { href: '/products',             translationKey: 'navProducts', label: 'Products',    icon: Package,         section: 'inventory' },
  { href: '/stock',                translationKey: 'navStock', label: 'Stock',       icon: Warehouse,       section: 'inventory' },
  { href: '/customers',            translationKey: 'navCustomers', label: 'Customers',   icon: UserCheck,       section: 'inventory' },
  { href: '/suppliers',            translationKey: 'navSuppliers', label: 'Suppliers',   icon: Truck,           section: 'inventory' },
  { href: '/employees',            translationKey: 'navEmployees', label: 'Employees',   icon: Users,           section: 'inventory', roles: ['ADMIN', 'MANAGER'] },
  { href: '/sales',                translationKey: 'navSales', label: 'Sales',       icon: Receipt,         section: 'transactions' },
  { href: '/purchases',            translationKey: 'navPurchases', label: 'Purchases',   icon: ShoppingCart,    section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/returns',              translationKey: 'navReturns', label: 'Returns',     icon: RotateCcw,       section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/payments',             translationKey: 'navPayments', label: 'Payments',    icon: CreditCard,      section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/expenses',             translationKey: 'navExpenses', label: 'Expenses',    icon: DollarSign,      section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/settings/users',       translationKey: 'navUsers', label: 'Users',       icon: Shield,          section: 'settings',  roles: ['ADMIN', 'MANAGER'] },
  { href: '/settings/roles',       translationKey: 'navRoles', label: 'Roles & Access', icon: Settings,     section: 'settings',  roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth, hasRole } = useAuthStore();
  const { t, language } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    if (!token && !refreshToken) {
      clearAuth();
      router.replace('/login');
    }
  }, [clearAuth, router]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    router.replace('/login');
  };

  const canAccess = (item: NavItemDef) => {
    if (!item.roles) return true;
    if (!mounted) return true;
    return item.roles.some(r => hasRole(r));
  };

  const mainItems = navItemDefs.filter(i => i.section === 'main' && canAccess(i));
  const inventoryItems = navItemDefs.filter(i => i.section === 'inventory' && canAccess(i));
  const transactionItems = navItemDefs.filter(i => i.section === 'transactions' && canAccess(i));
  const settingsItems = navItemDefs.filter(i => i.section === 'settings' && canAccess(i));

  return (
    <div className="layout-container">
      {/* Ambient glowing background orbs */}
      <div className="ambient-glow-wrapper" aria-hidden="true">
        <div className="ambient-orb ambient-orb-primary" />
        <div className="ambient-orb ambient-orb-secondary" />
        <div className="ambient-orb ambient-orb-accent" />
      </div>

      {/* Mobile Backdrop */}
      {mobileNavOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div style={{
          padding: '16px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
              flexShrink: 0,
            }}>
              <Package size={20} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                {t('appName')}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {t('managementSystem')}
              </p>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{
          flex: '1 1 0%',
          minHeight: 0,
          padding: '12px 10px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '4px' }}>
              {t('sectionMain')}
            </p>
            {mainItems.map(item => (
              <NavLink key={item.href} item={item} active={pathname === item.href} label={t(item.translationKey)} onClick={() => setMobileNavOpen(false)} />
            ))}
          </div>

          {inventoryItems.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '4px' }}>
                {t('sectionInventory')}
              </p>
              {inventoryItems.map(item => (
                <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} label={t(item.translationKey)} onClick={() => setMobileNavOpen(false)} />
              ))}
            </div>
          )}

          {transactionItems.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '4px' }}>
                {t('sectionTransactions')}
              </p>
              {transactionItems.map(item => (
                <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} label={t(item.translationKey)} onClick={() => setMobileNavOpen(false)} />
              ))}
            </div>
          )}

          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '4px' }}>
              {t('sectionSettings')}
            </p>
            {settingsItems.map(item => (
              <NavLink key={item.href} item={item} active={pathname === item.href} label={t(item.translationKey)} onClick={() => setMobileNavOpen(false)} />
            ))}
          </div>
        </nav>

        {/* User section */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          flexShrink: 0,
          marginTop: 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '10px',
            background: 'var(--bg-subtle)',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: 'white',
            }}>
              {mounted && user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mounted && user?.fullName ? user.fullName : t('account')}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mounted && user?.roles?.[0] ? user.roles[0] : t('signedIn')}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.08)';
            }}
            title={t('logout')}
          >
            <LogOut size={15} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="header-bar">
          {/* Left side: hamburger button + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
            <button
              id="mobile-nav-toggle-btn"
              className="mobile-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  {i > 0 && <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                  <span style={{
                    fontSize: '14px',
                    color: i === arr.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: i === arr.length - 1 ? '600' : '400',
                    textTransform: 'capitalize',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {t(seg) || seg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <LanguageToggle />
            <ThemeToggle />
            <button
              style={{
                width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                background: 'var(--bg-subtle)', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                position: 'relative',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
              title={t('notifications')}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 7, height: 7, borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  boxShadow: '0 0 6px #6366f1',
                }}
              />
            </button>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                id="header-user-avatar"
                onClick={() => setUserMenuOpen(prev => !prev)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer',
                  boxShadow: userMenuOpen ? '0 0 0 3px rgba(99,102,241,0.35), 0 4px 12px rgba(99,102,241,0.3)' : '0 2px 8px rgba(99,102,241,0.2)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: userMenuOpen ? 'scale(1.05)' : 'scale(1)',
                }}
                title={mounted && user?.fullName ? user.fullName : t('profile')}
              >
                {mounted && user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
              </div>

              {userMenuOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '230px', borderRadius: '14px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
                    padding: '8px', zIndex: 100,
                    animation: 'springScaleUp 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformOrigin: 'top right',
                  }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {mounted && user?.fullName ? user.fullName : t('account')}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {mounted && user?.email ? user.email : ''}
                      </p>
                      <div style={{ marginTop: '6px' }}>
                        <span className="badge badge-role" style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {mounted && user?.roles?.[0] ? user.roles[0] : 'User'}
                        </span>
                      </div>
                    </div>

                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 12px', borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.08)';
                      }}
                    >
                      <LogOut size={15} />
                      {t('logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="dashboard-content-area">
          <RealtimeProvider>
            {children}
          </RealtimeProvider>
        </div>
      </main>
    </div>
  );
}

function NavLink({ item, active, label, onClick }: {
  item: { href: string; icon: React.ComponentType<{ size?: number; className?: string }> };
  active: boolean;
  label: string;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`sidebar-nav-item ${active ? 'active' : ''}`}
    >
      <Icon size={16} className="nav-icon" />
      <span>{label}</span>
    </Link>
  );
}
