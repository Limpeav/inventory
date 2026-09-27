package com.inventory.backend.domain.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Domain Repository Port: PasswordResetTokenRepository
 */
public interface PasswordResetTokenRepository {

    PasswordResetToken save(PasswordResetToken token);

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    List<PasswordResetToken> findActiveTokensByUserId(UUID userId);

    void invalidateActiveTokensForUser(UUID userId);
}
