package com.inventory.backend.domain.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Domain Repository Port: UserRepository
 * This interface belongs to the domain layer — implementations live in infrastructure.
 */
public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void deleteById(UUID id);
}
