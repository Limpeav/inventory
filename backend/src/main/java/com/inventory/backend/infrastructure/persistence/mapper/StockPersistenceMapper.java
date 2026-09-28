package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.stock.StockItem;
import com.inventory.backend.infrastructure.persistence.entity.StockItemEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockPersistenceMapper {
    StockItem toDomain(StockItemEntity entity);
    StockItemEntity toEntity(StockItem domain);
}
