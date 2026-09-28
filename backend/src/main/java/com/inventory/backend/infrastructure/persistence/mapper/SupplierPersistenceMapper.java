package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.supplier.Supplier;
import com.inventory.backend.infrastructure.persistence.entity.SupplierEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupplierPersistenceMapper {
    Supplier toDomain(SupplierEntity entity);
    SupplierEntity toEntity(Supplier domain);
}
