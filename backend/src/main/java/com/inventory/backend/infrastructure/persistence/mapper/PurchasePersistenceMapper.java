package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.purchase.Purchase;
import com.inventory.backend.domain.purchase.PurchaseItem;
import com.inventory.backend.infrastructure.persistence.entity.PurchaseEntity;
import com.inventory.backend.infrastructure.persistence.entity.PurchaseItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PurchasePersistenceMapper {

    @Mapping(target = "items", source = "items")
    Purchase toDomain(PurchaseEntity entity);

    @Mapping(target = "items", source = "items")
    PurchaseEntity toEntity(Purchase domain);

    @Mapping(target = "purchaseId", source = "purchase.id")
    PurchaseItem itemToDomain(PurchaseItemEntity entity);

    @Mapping(target = "purchase", ignore = true)
    PurchaseItemEntity itemToEntity(PurchaseItem domain);
}
