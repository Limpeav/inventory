package com.inventory.backend.application.role;

import com.inventory.backend.domain.role.Permission;
import com.inventory.backend.domain.role.Role;
import com.inventory.backend.domain.role.RoleRepository;
import com.inventory.backend.infrastructure.persistence.repository.JpaPermissionRepository;
import com.inventory.backend.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.inventory.backend.presentation.dto.request.CreateRoleRequest;
import com.inventory.backend.presentation.dto.request.UpdateRoleRequest;
import com.inventory.backend.presentation.exception.ResourceAlreadyExistsException;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Application Use Case: Role Management
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final JpaPermissionRepository jpaPermissionRepository;
    private final UserPersistenceMapper mapper;

    @Transactional(readOnly = true)
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role findById(UUID id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    public Role create(CreateRoleRequest request) {
        if (roleRepository.existsByName(request.getName())) {
            throw new ResourceAlreadyExistsException("Role already exists: " + request.getName());
        }

        Set<Permission> permissions = new HashSet<>();
        if (request.getPermissionIds() != null) {
            permissions = request.getPermissionIds().stream()
                    .map(pid -> jpaPermissionRepository.findById(pid)
                            .map(mapper::permissionToDomain)
                            .orElseThrow(() -> new ResourceNotFoundException("Permission not found: " + pid)))
                    .collect(Collectors.toSet());
        }

        Role role = new Role();
        role.setName(request.getName().toUpperCase());
        role.setDescription(request.getDescription());
        role.setPermissions(permissions);

        return roleRepository.save(role);
    }

    public Role update(UUID id, UpdateRoleRequest request) {
        Role role = findById(id);

        if (request.getDescription() != null) role.setDescription(request.getDescription());

        if (request.getPermissionIds() != null) {
            Set<Permission> permissions = request.getPermissionIds().stream()
                    .map(pid -> jpaPermissionRepository.findById(pid)
                            .map(mapper::permissionToDomain)
                            .orElseThrow(() -> new ResourceNotFoundException("Permission not found: " + pid)))
                    .collect(Collectors.toSet());
            role.setPermissions(permissions);
        }

        return roleRepository.save(role);
    }

    public void delete(UUID id) {
        roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        roleRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Permission> findAllPermissions() {
        return jpaPermissionRepository.findAll().stream()
                .map(mapper::permissionToDomain)
                .collect(Collectors.toList());
    }
}
