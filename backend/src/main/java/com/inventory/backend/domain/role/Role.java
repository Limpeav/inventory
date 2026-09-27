package com.inventory.backend.domain.role;

import java.util.Set;
import java.util.UUID;

/**
 * Domain Entity: Role
 */
public class Role {
    private UUID id;
    private String name;
    private String description;
    private Set<Permission> permissions;

    public Role() {}

    public Role(UUID id, String name, String description, Set<Permission> permissions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }

    public boolean hasPermission(String resource, String action) {
        return permissions != null && permissions.stream()
                .anyMatch(p -> p.getResource().equalsIgnoreCase(resource)
                        && p.getAction().equalsIgnoreCase(action));
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Set<Permission> getPermissions() { return permissions; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }
}
