'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Shield, Package, ChevronRight,
  LogOut, Settings, Bell, Search
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/auth-api';
import Cookies from 'js-cookie';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
  { href: '/settings/users', label: 'Users', icon: Users, section: 'settings' },
  { href: '/settings/roles', label: 'Roles & Access', icon: Shield, section: 'settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    router.replace('/login');
  };

  const mainItems = navItems.filter(i => i.section === 'main');
  const settingsItems = navItems.filter(i => i.section === 'settings');

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
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
              Main
            </p>
            {mainItems.map(item => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </div>

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
              {user?.fullName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName || 'Admin'}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.roles?.[0] || 'ADMIN'}
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
            }}>
              <Bell size={16} />
            </button>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer',
            }}>
              {user?.fullName?.[0]?.toUpperCase() || 'A'}
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
