package com.inventory.backend.domain.role;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Domain Repository Port: RoleRepository
 */
public interface RoleRepository {
    Role save(Role role);
    Optional<Role> findById(UUID id);
    Optional<Role> findByName(String name);
    List<Role> findAll();
    boolean existsByName(String name);
    void deleteById(UUID id);
}
