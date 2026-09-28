package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.category.Category;
import com.inventory.backend.domain.category.CategoryRepository;
import com.inventory.backend.infrastructure.persistence.mapper.CategoryPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CategoryRepositoryAdapter implements CategoryRepository {

    private final JpaCategoryRepository jpaRepo;
    private final CategoryPersistenceMapper mapper;

    @Override
    public Category save(Category category) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(category)));
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Category> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepo.existsByName(name);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
