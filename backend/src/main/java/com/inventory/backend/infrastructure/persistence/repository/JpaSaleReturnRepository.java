package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.SaleReturnEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaSaleReturnRepository extends JpaRepository<SaleReturnEntity, UUID> {
    List<SaleReturnEntity> findBySaleId(UUID saleId);
}
