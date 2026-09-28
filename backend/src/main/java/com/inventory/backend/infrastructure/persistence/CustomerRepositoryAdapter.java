package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.customer.Customer;
import com.inventory.backend.domain.customer.CustomerRepository;
import com.inventory.backend.infrastructure.persistence.mapper.CustomerPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaCustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CustomerRepositoryAdapter implements CustomerRepository {

    private final JpaCustomerRepository jpaRepo;
    private final CustomerPersistenceMapper mapper;

    @Override
    public Customer save(Customer customer) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(customer)));
    }

    @Override
    public Optional<Customer> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Customer> findByCustomerId(String customerId) {
        return jpaRepo.findByCustomerId(customerId).map(mapper::toDomain);
    }

    @Override
    public List<Customer> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Customer> findAllActive() {
        return jpaRepo.findAllActive().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existsByCustomerId(String customerId) {
        return jpaRepo.existsByCustomerId(customerId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
