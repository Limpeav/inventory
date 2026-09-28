package com.inventory.backend.domain.product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(UUID id);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findAll();
    List<Product> findByCategoryId(UUID categoryId);
    List<Product> findAllActive();       // hidden=false, deleted=false
    boolean existsByBarcode(String barcode);
    void deleteById(UUID id);
}
