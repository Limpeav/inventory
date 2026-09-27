package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaPasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, UUID> {

    Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);

    @Query("SELECT t FROM PasswordResetTokenEntity t WHERE t.user.id = :userId AND t.used = false AND t.expiresAt > :now")
    List<PasswordResetTokenEntity> findActiveTokensByUserId(@Param("userId") UUID userId, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE PasswordResetTokenEntity t SET t.used = true, t.usedAt = :now WHERE t.user.id = :userId AND t.used = false")
    int invalidateActiveTokensForUser(@Param("userId") UUID userId, @Param("now") LocalDateTime now);
}
