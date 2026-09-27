package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.user.User;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Infrastructure Adapter: implements domain UserRepository using JPA
 */
@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final JpaUserRepository jpaUserRepository;
    private final UserPersistenceMapper mapper;

    @Override
    public User save(User user) {
        return mapper.toDomain(jpaUserRepository.save(mapper.toEntity(user)));
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaUserRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaUserRepository.findByUsername(username).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public List<User> findAll() {
        return jpaUserRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaUserRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email);
    }

    @Override
    public void deleteById(UUID id) {
        jpaUserRepository.deleteById(id);
    }
}
