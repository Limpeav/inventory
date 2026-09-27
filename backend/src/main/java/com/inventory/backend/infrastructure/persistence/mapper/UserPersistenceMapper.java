package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.role.Permission;
import com.inventory.backend.domain.role.Role;
import com.inventory.backend.domain.user.User;
import com.inventory.backend.infrastructure.persistence.entity.PermissionEntity;
import com.inventory.backend.infrastructure.persistence.entity.RoleEntity;
import com.inventory.backend.infrastructure.persistence.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {

    @Mapping(target = "roles", source = "roles")
    User toDomain(UserEntity entity);

    @Mapping(target = "roles", source = "roles")
    UserEntity toEntity(User domain);

    Role roleToDomain(RoleEntity entity);
    RoleEntity roleToEntity(Role domain);

    Permission permissionToDomain(PermissionEntity entity);
    PermissionEntity permissionToEntity(Permission domain);
}
