package com.inventory.backend.presentation.api.user;

import com.inventory.backend.application.user.UserService;
import com.inventory.backend.domain.user.User;
import com.inventory.backend.presentation.dto.request.CreateUserRequest;
import com.inventory.backend.presentation.dto.request.UpdateUserRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.PermissionResponse;
import com.inventory.backend.presentation.dto.response.RoleResponse;
import com.inventory.backend.presentation.dto.response.UserResponse;
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
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> findAll() {
        List<UserResponse> users = userService.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or #id.toString() == authentication.name")
    public ResponseEntity<ApiResponse<UserResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(userService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", toResponse(user)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> update(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User updated successfully",
                toResponse(userService.update(id, request))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .roles(user.getRoles() == null ? List.of() :
                        user.getRoles().stream()
                                .map(r -> RoleResponse.builder()
                                        .id(r.getId())
                                        .name(r.getName())
                                        .description(r.getDescription())
                                        .permissions(r.getPermissions() == null ? List.of() :
                                                r.getPermissions().stream()
                                                        .map(p -> PermissionResponse.builder()
                                                                .id(p.getId())
                                                                .name(p.getName())
                                                                .resource(p.getResource())
                                                                .action(p.getAction())
                                                                .build())
                                                        .collect(Collectors.toList()))
                                        .build())
                                .collect(Collectors.toList()))
                .build();
    }
}
