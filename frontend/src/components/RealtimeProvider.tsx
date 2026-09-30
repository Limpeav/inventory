'use client';

import { useCallback } from 'react';
import { useWebSocket, WsEvent } from '@/hooks/useWebSocket';
import { useToasts, ToastContainer } from '@/components/Toast';

/**
 * Mounts the WebSocket connection and renders real-time toast notifications.
 * Drop this anywhere in the component tree that needs live updates.
 * The children prop lets you wrap page content without changing the DOM structure.
 */
export default function RealtimeProvider({ children }: { children?: React.ReactNode }) {
  const { toasts, pushWsEvent, dismiss } = useToasts();

  const handleEvent = useCallback((event: WsEvent) => {
    pushWsEvent(event);
  }, [pushWsEvent]);

  // Listen to /topic/events (all events from the server)
  useWebSocket('/topic/events', handleEvent);

  return (
    <>
      {children}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
