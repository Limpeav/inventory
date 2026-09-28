package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.product.Product;
import com.inventory.backend.infrastructure.persistence.entity.ProductEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductPersistenceMapper {
    Product toDomain(ProductEntity entity);
    ProductEntity toEntity(Product domain);
}
