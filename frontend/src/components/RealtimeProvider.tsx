'use client';

import { useCallback, useState } from 'react';
import { useWebSocket, WsEvent } from '@/hooks/useWebSocket';
import { useToasts, ToastContainer } from '@/components/Toast';

/**
 * Mounts the WebSocket connection and renders real-time toast notifications.
 * Drop this anywhere in the component tree that needs live updates.
 * The children prop lets you wrap page content without changing the DOM structure.
 */
export default function RealtimeProvider({ children }: { children?: React.ReactNode }) {
  const { toasts, pushWsEvent, dismiss } = useToasts();
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const handleEvent = useCallback((event: WsEvent) => {
    pushWsEvent(event);
  }, [pushWsEvent]);

  // Listen to /topic/events (all events from the server)
  useWebSocket('/topic/events', handleEvent, setWsStatus);

  return (
    <>
      {/* WS status indicator — sits in top-right of the layout */}
      <div
        title={`WebSocket: ${wsStatus}`}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 8000,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px',
          borderRadius: 20,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-muted)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          pointerEvents: 'none',
        }}
      >
        <span className={`ws-dot ${wsStatus}`} />
        <span>Live</span>
      </div>

      {children}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
