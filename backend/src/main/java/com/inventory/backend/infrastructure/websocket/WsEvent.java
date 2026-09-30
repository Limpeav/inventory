package com.inventory.backend.infrastructure.websocket;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * A generic real-time event payload broadcast over WebSocket to all subscribers.
 */
@Data
public class WsEvent {

    public enum Type {
        SALE_CREATED, SALE_CANCELLED,
        PURCHASE_CREATED, PURCHASE_RECEIVED, PURCHASE_CANCELLED,
        STOCK_UPDATED,
        EXPENSE_CREATED, EXPENSE_UPDATED, EXPENSE_DELETED,
        PRODUCT_CREATED, PRODUCT_UPDATED,
        CUSTOMER_CREATED, CUSTOMER_UPDATED,
        SUPPLIER_CREATED, SUPPLIER_UPDATED,
        EMPLOYEE_CREATED, EMPLOYEE_UPDATED
    }

    private Type type;
    private String entityId;     // UUID of the affected record
    private String entityName;   // human-readable label, e.g. invoice code
    private Object payload;      // optional extra data (e.g. new stock level)
    private String actor;        // username who triggered the event
    private LocalDateTime timestamp = LocalDateTime.now();

    public WsEvent() {}

    public WsEvent(Type type, String entityId, String entityName, Object payload, String actor) {
        this.type = type;
        this.entityId = entityId;
        this.entityName = entityName;
        this.payload = payload;
        this.actor = actor;
    }

    public static WsEvent of(Type type, String entityId, String entityName) {
        return new WsEvent(type, entityId, entityName, null, null);
    }

    public static WsEvent of(Type type, String entityId, String entityName, Object payload, String actor) {
        return new WsEvent(type, entityId, entityName, payload, actor);
    }
}
