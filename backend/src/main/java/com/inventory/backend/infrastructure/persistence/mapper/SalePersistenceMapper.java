package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.sale.SaleItem;
import com.inventory.backend.infrastructure.persistence.entity.SaleEntity;
import com.inventory.backend.infrastructure.persistence.entity.SaleItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SalePersistenceMapper {

    @Mapping(target = "items", source = "items")
    Sale toDomain(SaleEntity entity);

    @Mapping(target = "items", source = "items")
    SaleEntity toEntity(Sale domain);

    @Mapping(target = "saleId", source = "sale.id")
    SaleItem itemToDomain(SaleItemEntity entity);

    @Mapping(target = "sale", ignore = true)
    SaleItemEntity itemToEntity(SaleItem domain);
}
