'use client';

import { useAuthStore } from '@/store/auth-store';
import { Users, Shield, Package, TrendingUp, ArrowUp, Activity, Warehouse } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '24', change: '+3 this month', icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { label: 'Active Roles', value: '3', change: 'ADMIN, MANAGER, STAFF', icon: Shield, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { label: 'Products', value: '1,248', change: '+12 this week', icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { label: 'Stock Value', value: '$48.5K', change: '+8.2% vs last month', icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
];

const recentActivity = [
  { action: 'User created', detail: 'john.doe@company.com', time: '2 min ago', type: 'user' },
  { action: 'Stock updated', detail: 'Product SKU-1024 (+50 units)', time: '15 min ago', type: 'inventory' },
  { action: 'Role assigned', detail: 'Manager role → Alice K.', time: '1 hour ago', type: 'role' },
  { action: 'Stock alert', detail: 'SKU-0089 below minimum', time: '3 hours ago', type: 'alert' },
  { action: 'New user login', detail: 'manager01 from 192.168.1.45', time: '5 hours ago', type: 'user' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Good morning, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'Admin'}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Here&apos;s what&apos;s happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px', marginBottom: '28px',
      }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card animate-slide-up" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUp size={12} color="#10b981" />
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>Live</span>
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Activity feed */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Activity size={18} color="var(--primary-light)" />
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Recent Activity
            </h2>
          </div>
          <div>
            {recentActivity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px', padding: '12px 0',
                borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%, flexShrink: 0',
                  marginTop: '6px',
                  background: item.type === 'alert' ? '#f59e0b' :
                              item.type === 'role' ? '#10b981' :
                              item.type === 'user' ? '#6366f1' : '#8b5cf6',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {item.action}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.detail}</p>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick info */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Warehouse size={18} color="var(--primary-light)" />
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Warehouse Overview
            </h2>
          </div>

          {[
            { label: 'Total Capacity', value: '5,000 units', pct: 100 },
            { label: 'Current Stock', value: '3,218 units', pct: 64 },
            { label: 'Reserved', value: '842 units', pct: 17 },
            { label: 'Available', value: '1,940 units', pct: 39 },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${item.pct}%`, borderRadius: '3px',
                  background: item.pct > 80 ? '#ef4444' : item.pct > 50 ? '#6366f1' : '#10b981',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '20px', padding: '14px', borderRadius: '10px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <p style={{ fontSize: '13px', color: '#34d399', fontWeight: '500' }}>
              ✅ All systems operational
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Last synchronized: a few minutes ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
