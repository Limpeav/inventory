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

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/api/v1/ws';

/**
 * Subscribe to a WebSocket topic and receive real-time inventory events.
 *
 * @param topic   e.g. '/topic/events' (all) | '/topic/sales' | '/topic/purchases' | etc.
 * @param handler callback called whenever a message arrives on that topic
 */
export function useWebSocket(topic: string, handler: WsEventHandler) {
  const clientRef = useRef<Client | null>(null);
  const handlerRef = useRef<WsEventHandler>(handler);

  // Keep handler ref fresh without re-subscribing
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.subscribe(topic, (msg: IMessage) => {
          try {
            const event: WsEvent = JSON.parse(msg.body);
            handlerRef.current(event);
          } catch {
            // malformed message — ignore
          }
        });
      },
      onStompError: () => {
        // auto-reconnect handled by reconnectDelay
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [topic]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);
}
