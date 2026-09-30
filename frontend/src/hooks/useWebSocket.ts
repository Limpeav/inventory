'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';

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
 * Resolves the native WebSocket URL (wss:// or ws://):
 * Spring Boot's SockJS raw websocket endpoint is at /websocket.
 * Using native WebSockets avoids the legacy SockJS 'unload' event listener,
 * completely eliminating the Chrome Permissions-Policy violation warning.
 */
function resolveNativeWsUrl(): string | null {
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

  // Convert http(s) to ws(s)
  if (url.startsWith('https://')) {
    url = 'wss://' + url.slice(8);
  } else if (url.startsWith('http://')) {
    url = 'ws://' + url.slice(7);
  }

  // Running in browser over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    if (url.startsWith('ws://')) {
      url = 'wss://' + url.slice(5);
    }

    // If on a remote domain but URL still points to localhost, skip connecting
    const isRemotePage = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isRemotePage && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      console.warn(
        '[useWebSocket] Page is running over HTTPS in production, but WebSocket URL points to localhost. ' +
        'Please configure NEXT_PUBLIC_WS_URL in your hosting environment variables.'
      );
      return null;
    }
  }

  // Append /websocket for Spring SockJS raw websocket endpoint
  if (!url.endsWith('/websocket')) {
    url = `${url.replace(/\/+$/, '')}/websocket`;
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
    const wsUrl = resolveNativeWsUrl();
    if (!wsUrl) {
      statusRef.current?.('disconnected');
      return () => {};
    }

    statusRef.current?.('connecting');

    // Use native WebSocket via brokerURL (eliminates sockjs-client unload warning)
    const client = new Client({
      brokerURL: wsUrl,
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
