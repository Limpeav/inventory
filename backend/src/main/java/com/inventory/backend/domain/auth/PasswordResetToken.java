package com.inventory.backend.domain.auth;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity: PasswordResetToken
 * Pure domain object representing a password reset token lifecycle.
 */
public class PasswordResetToken {

    private UUID id;
    private String tokenHash;
    private UUID userId;
    private LocalDateTime expiresAt;
    private boolean used;
    private LocalDateTime usedAt;
    private LocalDateTime createdAt;

    public PasswordResetToken() {}

    public PasswordResetToken(UUID id, String tokenHash, UUID userId,
                              LocalDateTime expiresAt, boolean used,
                              LocalDateTime usedAt, LocalDateTime createdAt) {
        this.id = id;
        this.tokenHash = tokenHash;
        this.userId = userId;
        this.expiresAt = expiresAt;
        this.used = used;
        this.usedAt = usedAt;
        this.createdAt = createdAt;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isValid() {
        return !used && !isExpired();
    }

    public void markUsed() {
        this.used = true;
        this.usedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
