package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.stock.StockItem;
import com.inventory.backend.domain.stock.StockRepository;
import com.inventory.backend.infrastructure.persistence.mapper.StockPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class StockRepositoryAdapter implements StockRepository {

    private final JpaStockRepository jpaRepo;
    private final StockPersistenceMapper mapper;

    @Override
    public StockItem save(StockItem stockItem) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(stockItem)));
    }

    @Override
    public Optional<StockItem> findByProductId(UUID productId) {
        return jpaRepo.findByProductId(productId).map(mapper::toDomain);
    }

    @Override
    public List<StockItem> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<StockItem> findLowStock(double threshold) {
        return jpaRepo.findLowStock(threshold).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteByProductId(UUID productId) {
        jpaRepo.deleteByProductId(productId);
    }
}
