'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Shield, Package, ChevronRight,
  LogOut, Settings, Bell, ShoppingCart, Truck, UserCheck,
  Tag, BarChart3, Warehouse, Receipt, RotateCcw, CreditCard
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/auth-api';
import Cookies from 'js-cookie';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/dashboard',            label: 'Dashboard',   icon: LayoutDashboard, section: 'main' },
  { href: '/products',             label: 'Products',    icon: Package,         section: 'inventory' },
  { href: '/stock',                label: 'Stock',       icon: Warehouse,       section: 'inventory' },
  { href: '/customers',            label: 'Customers',   icon: UserCheck,       section: 'inventory' },
  { href: '/suppliers',            label: 'Suppliers',   icon: Truck,           section: 'inventory' },
  { href: '/employees',            label: 'Employees',   icon: Users,           section: 'inventory', roles: ['ADMIN', 'MANAGER'] },
  { href: '/sales',                label: 'Sales',       icon: Receipt,         section: 'transactions' },
  { href: '/purchases',            label: 'Purchases',   icon: ShoppingCart,    section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/returns',              label: 'Returns',     icon: RotateCcw,       section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/payments',             label: 'Payments',    icon: CreditCard,      section: 'transactions', roles: ['ADMIN', 'MANAGER'] },
  { href: '/settings/users',       label: 'Users',       icon: Shield,          section: 'settings',  roles: ['ADMIN', 'MANAGER'] },
  { href: '/settings/roles',       label: 'Roles & Access', icon: Settings,     section: 'settings',  roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth, hasRole } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const canAccess = (item: typeof navItems[0]) => {
    if (!item.roles) return true;
    if (!mounted) return true;
    return item.roles.some(r => hasRole(r));
  };

  const mainItems = navItems.filter(i => i.section === 'main' && canAccess(i));
  const inventoryItems = navItems.filter(i => i.section === 'inventory' && canAccess(i));
  const transactionItems = navItems.filter(i => i.section === 'transactions' && canAccess(i));
  const settingsItems = navItems.filter(i => i.section === 'settings' && canAccess(i));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ zIndex: 40 }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
              flexShrink: 0,
            }}>
              <Package size={20} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>Inventory</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Management System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, minHeight: 0, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
              Main
            </p>
            {mainItems.map(item => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </div>

          {inventoryItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
                Inventory
              </p>
              {inventoryItems.map(item => (
                <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
              ))}
            </div>
          )}

          {transactionItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
                Transactions
              </p>
              {transactionItems.map(item => (
                <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
              ))}
            </div>
          )}

          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
              Settings
            </p>
            {settingsItems.map(item => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </div>
        </nav>

        {/* User section */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            background: 'var(--bg-subtle)',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: 'white',
            }}>
              {mounted && user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mounted && user?.fullName ? user.fullName : 'Account'}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mounted && user?.roles?.[0] ? user.roles[0] : 'Signed in'}
              </p>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '8px', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {i > 0 && <ChevronRight size={14} color="var(--text-muted)" />}
                <span style={{
                  fontSize: '14px',
                  color: i === arr.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: i === arr.length - 1 ? '600' : '400',
                  textTransform: 'capitalize',
                }}>
                  {seg}
                </span>
              </div>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <button style={{
              width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              background: 'var(--bg-subtle)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }} title="Notifications">
              <Bell size={16} />
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
                  boxShadow: userMenuOpen ? '0 0 0 2px var(--brand-primary)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                title={mounted && user?.fullName ? user.fullName : 'Profile'}
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
                    width: '230px', borderRadius: '12px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    padding: '8px', zIndex: 100, animation: 'fadeIn 0.15s ease',
                  }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {mounted && user?.fullName ? user.fullName : 'Account'}
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
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ item, active }: {
  item: { href: string; label: string; icon: React.ComponentType<{ size?: number }> };
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '10px', marginBottom: '2px',
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
        color: active ? 'var(--primary-light)' : 'var(--text-muted)',
        textDecoration: 'none', fontSize: '13px', fontWeight: active ? '600' : '400',
        transition: 'all 0.15s ease',
      }}
    >
      <Icon size={16} />
      {item.label}
    </Link>
  );
}
