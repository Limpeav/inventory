package com.inventory.backend.infrastructure.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Central service for broadcasting WebSocket events to all connected clients.
 *
 * Topic channels:
 *   /topic/events        — all events (global listener)
 *   /topic/sales         — sale-specific events
 *   /topic/purchases     — purchase-specific events
 *   /topic/stock         — stock level changes
 *   /topic/expenses      — expense changes
 *   /topic/products      — product changes
 *   /topic/customers     — customer changes
 *   /topic/suppliers     — supplier changes
 *   /topic/employees     — employee changes
 */
@Service
@RequiredArgsConstructor
public class WsNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcast(WsEvent event) {
        // Global channel — frontend can listen here for all events
        messagingTemplate.convertAndSend("/topic/events", event);

        // Domain-specific channel
        String domainTopic = resolveTopicFor(event.getType());
        if (domainTopic != null) {
            messagingTemplate.convertAndSend(domainTopic, event);
        }
    }

    private String resolveTopicFor(WsEvent.Type type) {
        if (type == null) return null;
        return switch (type) {
            case SALE_CREATED, SALE_CANCELLED -> "/topic/sales";
            case PURCHASE_CREATED, PURCHASE_RECEIVED, PURCHASE_CANCELLED -> "/topic/purchases";
            case STOCK_UPDATED -> "/topic/stock";
            case EXPENSE_CREATED, EXPENSE_UPDATED, EXPENSE_DELETED -> "/topic/expenses";
            case PRODUCT_CREATED, PRODUCT_UPDATED -> "/topic/products";
            case CUSTOMER_CREATED, CUSTOMER_UPDATED -> "/topic/customers";
            case SUPPLIER_CREATED, SUPPLIER_UPDATED -> "/topic/suppliers";
            case EMPLOYEE_CREATED, EMPLOYEE_UPDATED -> "/topic/employees";
        };
    }
}
