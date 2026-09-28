package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.infrastructure.persistence.mapper.ProductPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepository {

    private final JpaProductRepository jpaRepo;
    private final ProductPersistenceMapper mapper;

    @Override
    public Product save(Product product) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(product)));
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Product> findByBarcode(String barcode) {
        return jpaRepo.findByBarcode(barcode).map(mapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Product> findByCategoryId(UUID categoryId) {
        return jpaRepo.findByCategoryId(categoryId).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Product> findAllActive() {
        return jpaRepo.findAllActive().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existsByBarcode(String barcode) {
        return jpaRepo.existsByBarcode(barcode);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
