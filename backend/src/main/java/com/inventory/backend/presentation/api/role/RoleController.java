package com.inventory.backend.presentation.api.role;

import com.inventory.backend.application.role.RoleService;
import com.inventory.backend.domain.role.Permission;
import com.inventory.backend.domain.role.Role;
import com.inventory.backend.presentation.dto.request.CreateRoleRequest;
import com.inventory.backend.presentation.dto.request.UpdateRoleRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.PermissionResponse;
import com.inventory.backend.presentation.dto.response.RoleResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(
                roleService.findAll().stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(roleService.findById(id))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> create(@Valid @RequestBody CreateRoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Role created successfully", toResponse(roleService.create(request))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Role updated", toResponse(roleService.update(id, request))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> findAllPermissions() {
        return ResponseEntity.ok(ApiResponse.success(
                roleService.findAllPermissions().stream().map(this::toPermissionResponse).collect(Collectors.toList())));
    }

    private RoleResponse toResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .permissions(role.getPermissions() == null ? List.of() :
                        role.getPermissions().stream().map(this::toPermissionResponse).collect(Collectors.toList()))
                .build();
    }

    private PermissionResponse toPermissionResponse(Permission p) {
        return PermissionResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .resource(p.getResource())
                .action(p.getAction())
                .build();
    }
}
