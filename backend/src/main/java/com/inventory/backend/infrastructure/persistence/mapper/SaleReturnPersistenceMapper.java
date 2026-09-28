package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.salereturn.SaleReturn;
import com.inventory.backend.domain.salereturn.SaleReturnItem;
import com.inventory.backend.infrastructure.persistence.entity.SaleReturnEntity;
import com.inventory.backend.infrastructure.persistence.entity.SaleReturnItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SaleReturnPersistenceMapper {

    @Mapping(target = "items", source = "items")
    SaleReturn toDomain(SaleReturnEntity entity);

    @Mapping(target = "items", source = "items")
    SaleReturnEntity toEntity(SaleReturn domain);

    @Mapping(target = "saleReturnId", source = "saleReturn.id")
    SaleReturnItem itemToDomain(SaleReturnItemEntity entity);

    @Mapping(target = "saleReturn", ignore = true)
    SaleReturnItemEntity itemToEntity(SaleReturnItem domain);
}
