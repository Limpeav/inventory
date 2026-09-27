package com.inventory.backend.infrastructure.security;

import com.inventory.backend.presentation.exception.RateLimitExceededException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe sliding-window rate limiter for sensitive authentication endpoints.
 */
@Service
public class RateLimiterService {

    private final Map<String, Deque<Instant>> requestBuckets = new ConcurrentHashMap<>();

    /**
     * Checks if the given key has exceeded the allowed rate limit within the time window.
     * Throws RateLimitExceededException if exceeded.
     */
    public void checkRateLimit(String key, int maxRequests, Duration window) {
        Instant now = Instant.now();
        Instant cutoff = now.minus(window);

        requestBuckets.compute(key, (k, timestamps) -> {
            if (timestamps == null) {
                timestamps = new ArrayDeque<>();
            }

            // Remove timestamps older than the sliding window
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.pollFirst();
            }

            if (timestamps.size() >= maxRequests) {
                throw new RateLimitExceededException(
                        "Too many requests. Please wait a few minutes before requesting another password reset."
                );
            }

            timestamps.addLast(now);
            return timestamps;
        });
    }

    /**
     * Helper to clear rate limit state (useful in testing).
     */
    public void clear() {
        requestBuckets.clear();
    }
}
