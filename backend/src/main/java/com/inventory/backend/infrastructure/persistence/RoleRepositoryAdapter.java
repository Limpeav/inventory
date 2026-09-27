package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.role.Role;
import com.inventory.backend.domain.role.RoleRepository;
import com.inventory.backend.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Infrastructure Adapter: implements domain RoleRepository using JPA
 */
@Component
@RequiredArgsConstructor
public class RoleRepositoryAdapter implements RoleRepository {

    private final JpaRoleRepository jpaRoleRepository;
    private final UserPersistenceMapper mapper;

    @Override
    public Role save(Role role) {
        return mapper.roleToDomain(jpaRoleRepository.save(mapper.roleToEntity(role)));
    }

    @Override
    public Optional<Role> findById(UUID id) {
        return jpaRoleRepository.findById(id).map(mapper::roleToDomain);
    }

    @Override
    public Optional<Role> findByName(String name) {
        return jpaRoleRepository.findByName(name).map(mapper::roleToDomain);
    }

    @Override
    public List<Role> findAll() {
        return jpaRoleRepository.findAll().stream()
                .map(mapper::roleToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRoleRepository.existsByName(name);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRoleRepository.deleteById(id);
    }
}
