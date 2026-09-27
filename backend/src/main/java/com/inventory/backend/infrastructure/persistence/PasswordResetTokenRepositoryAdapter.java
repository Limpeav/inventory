package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.auth.PasswordResetToken;
import com.inventory.backend.domain.auth.PasswordResetTokenRepository;
import com.inventory.backend.infrastructure.persistence.entity.PasswordResetTokenEntity;
import com.inventory.backend.infrastructure.persistence.entity.UserEntity;
import com.inventory.backend.infrastructure.persistence.repository.JpaPasswordResetTokenRepository;
import com.inventory.backend.infrastructure.persistence.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Infrastructure Adapter implementing the PasswordResetTokenRepository port.
 */
@Component
@RequiredArgsConstructor
public class PasswordResetTokenRepositoryAdapter implements PasswordResetTokenRepository {

    private final JpaPasswordResetTokenRepository jpaTokenRepository;
    private final JpaUserRepository jpaUserRepository;

    @Override
    public PasswordResetToken save(PasswordResetToken token) {
        UserEntity user = jpaUserRepository.findById(token.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found for ID: " + token.getUserId()));

        PasswordResetTokenEntity entity;
        if (token.getId() != null) {
            entity = jpaTokenRepository.findById(token.getId())
                    .orElseGet(() -> PasswordResetTokenEntity.builder().id(token.getId()).build());
            entity.setTokenHash(token.getTokenHash());
            entity.setUser(user);
            entity.setExpiresAt(token.getExpiresAt());
            entity.setUsed(token.isUsed());
            entity.setUsedAt(token.getUsedAt());
        } else {
            entity = PasswordResetTokenEntity.builder()
                    .tokenHash(token.getTokenHash())
                    .user(user)
                    .expiresAt(token.getExpiresAt())
                    .used(token.isUsed())
                    .usedAt(token.getUsedAt())
                    .build();
        }

        PasswordResetTokenEntity saved = jpaTokenRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<PasswordResetToken> findByTokenHash(String tokenHash) {
        return jpaTokenRepository.findByTokenHash(tokenHash).map(this::toDomain);
    }

    @Override
    public List<PasswordResetToken> findActiveTokensByUserId(UUID userId) {
        return jpaTokenRepository.findActiveTokensByUserId(userId, LocalDateTime.now())
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void invalidateActiveTokensForUser(UUID userId) {
        jpaTokenRepository.invalidateActiveTokensForUser(userId, LocalDateTime.now());
    }

    private PasswordResetToken toDomain(PasswordResetTokenEntity entity) {
        return new PasswordResetToken(
                entity.getId(),
                entity.getTokenHash(),
                entity.getUser().getId(),
                entity.getExpiresAt(),
                entity.isUsed(),
                entity.getUsedAt(),
                entity.getCreatedAt()
        );
    }
}
