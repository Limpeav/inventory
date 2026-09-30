'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { WsEvent, WsEventType } from '@/hooks/useWebSocket';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_META: Record<WsEventType, { icon: string; title: string; color: string; bg: string; border: string }> = {
  SALE_CREATED:       { icon: '🛒', title: 'New Sale',               color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
  SALE_CANCELLED:     { icon: '🚫', title: 'Sale Cancelled',          color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
  PURCHASE_CREATED:   { icon: '📦', title: 'Purchase Created',        color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)'  },
  PURCHASE_RECEIVED:  { icon: '✅', title: 'Goods Received',          color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
  PURCHASE_CANCELLED: { icon: '🚫', title: 'Purchase Cancelled',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
  STOCK_UPDATED:      { icon: '📊', title: 'Stock Updated',           color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)'  },
  EXPENSE_CREATED:    { icon: '💸', title: 'Expense Recorded',        color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)'  },
  EXPENSE_UPDATED:    { icon: '✏️', title: 'Expense Updated',         color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)'  },
  EXPENSE_DELETED:    { icon: '🗑️', title: 'Expense Deleted',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
  PRODUCT_CREATED:    { icon: '🆕', title: 'Product Added',           color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)'   },
  PRODUCT_UPDATED:    { icon: '✏️', title: 'Product Updated',         color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)'   },
  CUSTOMER_CREATED:   { icon: '👤', title: 'New Customer',            color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)'  },
  CUSTOMER_UPDATED:   { icon: '✏️', title: 'Customer Updated',        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)'  },
  SUPPLIER_CREATED:   { icon: '🏭', title: 'New Supplier',            color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)'  },
  SUPPLIER_UPDATED:   { icon: '✏️', title: 'Supplier Updated',        color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)'  },
  EMPLOYEE_CREATED:   { icon: '👔', title: 'Employee Added',          color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
  EMPLOYEE_UPDATED:   { icon: '✏️', title: 'Employee Updated',        color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
    const timer = timerRef.current.get(id);
    if (timer) { clearTimeout(timer); timerRef.current.delete(id); }
  }, []);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const duration = toast.duration ?? 4500;
    setToasts(t => [...t.slice(-4), { ...toast, id }]); // max 5 visible
    const timer = setTimeout(() => dismiss(id), duration);
    timerRef.current.set(id, timer);
  }, [dismiss]);

  const pushWsEvent = useCallback((event: WsEvent) => {
    const meta = EVENT_META[event.type];
    if (!meta) return;
    push({
      type: 'info',
      title: `${meta.icon} ${meta.title}`,
      message: event.entityName
        ? `#${event.entityName}`
        : `ID: ${event.entityId?.slice(0, 8)}`,
    });
  }, [push]);

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timerRef.current;
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return { toasts, push, pushWsEvent, dismiss };
}

// ─── Toast UI Component ───────────────────────────────────────────────────────

export function ToastContainer({ toasts, dismiss }: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const meta = EVENT_META[toast.title.slice(2).trim() as WsEventType];
  const color = meta?.color ?? '#6366f1';
  const bg = meta?.bg ?? 'rgba(99,102,241,0.12)';
  const border = meta?.border ?? 'rgba(99,102,241,0.3)';
  const duration = toast.duration ?? 4500;

  return (
    <div
      onClick={onDismiss}
      style={{
        pointerEvents: 'all', cursor: 'pointer',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        minWidth: 290, maxWidth: 380,
        padding: '14px 16px 16px 14px',
        borderRadius: 14,
        background: `linear-gradient(135deg, var(--bg-card, #1a1d2e), ${bg})`,
        border: `1px solid ${border}`,
        boxShadow: `0 8px 30px rgba(0,0,0,0.35), 0 0 0 1px ${border}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'slideInToast 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px) scale(1.01)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 36px rgba(0,0,0,0.45), 0 0 12px ${color}40`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.35), 0 0 0 1px ${border}`;
      }}
    >
      {/* Accent pill */}
      <div style={{ width: 3.5, borderRadius: 4, background: color, alignSelf: 'stretch', flexShrink: 0, boxShadow: `0 0 8px ${color}` }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 3, lineHeight: 1.3 }}>
          {toast.title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted, #9ca3af)', lineHeight: 1.4 }}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onDismiss(); }}
        style={{
          background: 'rgba(255, 255, 255, 0.06)', border: 'none', borderRadius: 6,
          cursor: 'pointer', color: 'var(--text-muted,#6b7280)', fontSize: 14,
          width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted,#6b7280)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.06)';
        }}
      >
        ×
      </button>

      {/* Progress countdown line */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, height: 2.5,
          background: color,
          opacity: 0.8,
          animation: `progressShrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}
