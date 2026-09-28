package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.TblProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaTblProductRepository extends JpaRepository<TblProductEntity, Integer> {
    Optional<TblProductEntity> findByProBarcode(String proBarcode);
    List<TblProductEntity> findByProCatCode(Short proCatCode);
}
