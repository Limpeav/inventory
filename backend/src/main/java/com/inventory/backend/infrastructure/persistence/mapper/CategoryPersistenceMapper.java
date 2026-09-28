package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.category.Category;
import com.inventory.backend.infrastructure.persistence.entity.CategoryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryPersistenceMapper {
    Category toDomain(CategoryEntity entity);
    CategoryEntity toEntity(Category domain);
}
