package com.inventory.backend.domain.salereturn;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SaleReturnRepository {
    SaleReturn save(SaleReturn saleReturn);
    Optional<SaleReturn> findById(UUID id);
    List<SaleReturn> findAll();
    List<SaleReturn> findBySaleId(UUID saleId);
    void deleteById(UUID id);
}
