package com.inventory.backend.domain.user;

import com.inventory.backend.domain.role.Role;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * Domain Entity: User
 * Pure domain object — no framework annotations here.
 */
public class User {
    private UUID id;
    private String username;
    private String email;
    private String passwordHash;
    private String fullName;
    private boolean active;
    private Set<Role> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {}

    public User(UUID id, String username, String email, String passwordHash,
                String fullName, boolean active, Set<Role> roles,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.active = active;
        this.roles = roles;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Domain behavior
    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }

    public boolean hasRole(String roleName) {
        return roles != null && roles.stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase(roleName));
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
