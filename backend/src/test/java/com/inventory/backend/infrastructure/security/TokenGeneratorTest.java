package com.inventory.backend.infrastructure.security;

import com.inventory.backend.infrastructure.security.token.TokenGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class TokenGeneratorTest {

    private TokenGenerator tokenGenerator;

    @BeforeEach
    void setUp() {
        tokenGenerator = new TokenGenerator();
    }

    @Test
    @DisplayName("Should generate non-null, non-empty, unique URL-safe tokens")
    void shouldGenerateUniqueUrlSafeTokens() {
        Set<String> generatedTokens = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            String token = tokenGenerator.generateSecureToken();
            assertNotNull(token);
            assertFalse(token.isBlank());
            assertEquals(43, token.length(), "32 raw bytes URL-safe base64 without padding should be 43 chars");
            // Must not contain URL-unsafe characters
            assertFalse(token.contains("+"));
            assertFalse(token.contains("/"));
            assertFalse(token.contains("="));
            assertTrue(generatedTokens.add(token), "Generated token must be unique");
        }
    }

    @Test
    @DisplayName("Should produce consistent, 64-character lowercase hex SHA-256 hash")
    void shouldHashTokenConsistently() {
        String rawToken = "sample-secure-random-token-12345";
        String hash1 = tokenGenerator.hashToken(rawToken);
        String hash2 = tokenGenerator.hashToken(rawToken);

        assertNotNull(hash1);
        assertEquals(64, hash1.length());
        assertEquals(hash1, hash2);
        assertTrue(hash1.matches("^[a-f0-9]{64}$"));

        String differentHash = tokenGenerator.hashToken("different-token");
        assertNotEquals(hash1, differentHash);
    }

    @Test
    @DisplayName("Should reject null or empty tokens for hashing")
    void shouldRejectInvalidTokens() {
        assertThrows(IllegalArgumentException.class, () -> tokenGenerator.hashToken(null));
        assertThrows(IllegalArgumentException.class, () -> tokenGenerator.hashToken(""));
        assertThrows(IllegalArgumentException.class, () -> tokenGenerator.hashToken("   "));
    }
}
