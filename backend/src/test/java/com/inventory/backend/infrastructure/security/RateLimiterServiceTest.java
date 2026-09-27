package com.inventory.backend.infrastructure.security;

import com.inventory.backend.presentation.exception.RateLimitExceededException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceTest {

    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {
        rateLimiterService = new RateLimiterService();
    }

    @Test
    @DisplayName("Should allow requests up to the max limit")
    void shouldAllowRequestsWithinLimit() {
        assertDoesNotThrow(() -> {
            for (int i = 0; i < 5; i++) {
                rateLimiterService.checkRateLimit("test-key", 5, Duration.ofMinutes(1));
            }
        });
    }

    @Test
    @DisplayName("Should throw RateLimitExceededException when exceeding the limit")
    void shouldThrowWhenLimitExceeded() {
        for (int i = 0; i < 3; i++) {
            rateLimiterService.checkRateLimit("limited-user@example.com", 3, Duration.ofMinutes(1));
        }

        assertThrows(RateLimitExceededException.class, () ->
                rateLimiterService.checkRateLimit("limited-user@example.com", 3, Duration.ofMinutes(1))
        );
    }

    @Test
    @DisplayName("Should isolate limits for different keys")
    void shouldIsolateDifferentKeys() {
        for (int i = 0; i < 3; i++) {
            rateLimiterService.checkRateLimit("key-a", 3, Duration.ofMinutes(1));
        }

        // key-b should still be allowed
        assertDoesNotThrow(() ->
                rateLimiterService.checkRateLimit("key-b", 3, Duration.ofMinutes(1))
        );
    }
}
