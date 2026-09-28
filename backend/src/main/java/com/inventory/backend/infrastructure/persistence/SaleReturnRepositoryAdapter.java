package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.salereturn.SaleReturn;
import com.inventory.backend.domain.salereturn.SaleReturnRepository;
import com.inventory.backend.infrastructure.persistence.entity.SaleReturnEntity;
import com.inventory.backend.infrastructure.persistence.entity.SaleReturnItemEntity;
import com.inventory.backend.infrastructure.persistence.mapper.SaleReturnPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaSaleReturnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SaleReturnRepositoryAdapter implements SaleReturnRepository {

    private final JpaSaleReturnRepository jpaRepo;
    private final SaleReturnPersistenceMapper mapper;

    @Override
    public SaleReturn save(SaleReturn sr) {
        SaleReturnEntity entity = mapper.toEntity(sr);
        if (entity.getItems() != null) {
            for (SaleReturnItemEntity item : entity.getItems()) {
                item.setSaleReturn(entity);
            }
        }
        return mapper.toDomain(jpaRepo.save(entity));
    }

    @Override public Optional<SaleReturn> findById(UUID id) { return jpaRepo.findById(id).map(mapper::toDomain); }
    @Override public List<SaleReturn> findAll() { return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList()); }
    @Override public List<SaleReturn> findBySaleId(UUID saleId) { return jpaRepo.findBySaleId(saleId).stream().map(mapper::toDomain).collect(Collectors.toList()); }
    @Override public void deleteById(UUID id) { jpaRepo.deleteById(id); }
}
