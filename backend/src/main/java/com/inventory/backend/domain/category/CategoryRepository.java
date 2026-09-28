package com.inventory.backend.domain.category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository {
    Category save(Category category);
    Optional<Category> findById(UUID id);
    List<Category> findAll();
    boolean existsByName(String name);
    void deleteById(UUID id);
}
