package com.inventory.backend.domain.role;

import java.util.UUID;

/**
 * Domain Entity: Permission
 */
public class Permission {
    private UUID id;
    private String name;
    private String resource;
    private String action;

    public Permission() {}

    public Permission(UUID id, String name, String resource, String action) {
        this.id = id;
        this.name = name;
        this.resource = resource;
        this.action = action;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
