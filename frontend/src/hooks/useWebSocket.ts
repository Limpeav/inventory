'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type WsEventType =
  | 'SALE_CREATED' | 'SALE_CANCELLED'
  | 'PURCHASE_CREATED' | 'PURCHASE_RECEIVED' | 'PURCHASE_CANCELLED'
  | 'STOCK_UPDATED'
  | 'EXPENSE_CREATED' | 'EXPENSE_UPDATED' | 'EXPENSE_DELETED'
  | 'PRODUCT_CREATED' | 'PRODUCT_UPDATED'
  | 'CUSTOMER_CREATED' | 'CUSTOMER_UPDATED'
  | 'SUPPLIER_CREATED' | 'SUPPLIER_UPDATED'
  | 'EMPLOYEE_CREATED' | 'EMPLOYEE_UPDATED';

export interface WsEvent {
  type: WsEventType;
  entityId: string;
  entityName: string;
  payload?: unknown;
  actor?: string;
  timestamp: string;
}

export type WsEventHandler = (event: WsEvent) => void;
export type WsStatus = 'connecting' | 'connected' | 'disconnected';

/**
 * Resolves the WebSocket URL safely:
 * 1. Uses NEXT_PUBLIC_WS_URL if provided.
 * 2. Otherwise derives from NEXT_PUBLIC_API_URL (e.g. https://.../api/v1 -> https://.../api/v1/ws).
 * 3. Falls back to localhost in local development.
 * 4. Automatically upgrades http:// or ws:// to https:// when running on HTTPS to avoid Mixed Content / SecurityError.
 * 5. Safely skips connecting if deployed on HTTPS but still pointing to localhost.
 */
function resolveWsUrl(): string | null {
  let url = process.env.NEXT_PUBLIC_WS_URL?.trim();

  // If NEXT_PUBLIC_WS_URL is not set, derive from NEXT_PUBLIC_API_URL
  if (!url && process.env.NEXT_PUBLIC_API_URL) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, '');
    url = `${apiBase}/ws`;
  }

  // Fallback for local development
  if (!url) {
    url = 'http://localhost:8080/api/v1/ws';
  }

  // Running in browser over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // SockJS requires http/https protocol (never ws:// or wss://)
    if (url.startsWith('ws://') || url.startsWith('http://')) {
      url = 'https://' + url.replace(/^(ws|http):\/\//, '');
    } else if (url.startsWith('wss://')) {
      url = 'https://' + url.slice(6);
    }

    // If on a remote domain but URL still points to localhost, skip connecting
    const isRemotePage = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isRemotePage && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      console.warn(
        '[useWebSocket] Page is running over HTTPS in production, but WebSocket URL points to localhost. ' +
        'Please configure NEXT_PUBLIC_WS_URL (e.g. https://your-backend.onrender.com/api/v1/ws) in your hosting environment variables.'
      );
      return null;
    }
  }

  return url;
}

/**
 * Subscribe to a WebSocket topic and receive real-time inventory events.
 *
 * @param topic          e.g. '/topic/events' (all) | '/topic/sales' | '/topic/purchases' | etc.
 * @param handler        callback called whenever a message arrives on that topic
 * @param onStatusChange optional callback to track connection status ('connecting' | 'connected' | 'disconnected')
 */
export function useWebSocket(
  topic: string,
  handler: WsEventHandler,
  onStatusChange?: (status: WsStatus) => void
) {
  const clientRef = useRef<Client | null>(null);
  const handlerRef = useRef<WsEventHandler>(handler);
  const statusRef = useRef(onStatusChange);

  // Keep handler refs fresh without re-subscribing
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    statusRef.current = onStatusChange;
  }, [onStatusChange]);

  const connect = useCallback(() => {
    const wsUrl = resolveWsUrl();
    if (!wsUrl) {
      statusRef.current?.('disconnected');
      return () => {};
    }

    statusRef.current?.('connecting');

    const client = new Client({
      webSocketFactory: () => {
        try {
          return new SockJS(wsUrl) as WebSocket;
        } catch (err) {
          console.warn('[useWebSocket] SockJS creation failed:', err);
          throw err;
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        statusRef.current?.('connected');
        client.subscribe(topic, (msg: IMessage) => {
          try {
            const event: WsEvent = JSON.parse(msg.body);
            handlerRef.current(event);
          } catch {
            // malformed message — ignore
          }
        });
      },
      onDisconnect: () => {
        statusRef.current?.('disconnected');
      },
      onStompError: (frame) => {
        console.warn('[useWebSocket] STOMP error:', frame);
        statusRef.current?.('disconnected');
      },
      onWebSocketClose: () => {
        statusRef.current?.('disconnected');
      },
    });

    try {
      client.activate();
      clientRef.current = client;
    } catch (err) {
      console.warn('[useWebSocket] Activation error:', err);
      statusRef.current?.('disconnected');
    }

    return () => {
      try {
        if (clientRef.current) {
          clientRef.current.deactivate();
          clientRef.current = null;
        }
      } catch {
        // cleanup error — safe to ignore
      }
      statusRef.current?.('disconnected');
    };
  }, [topic]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);
}
