package com.inventory.backend.domain.customer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository {
    Customer save(Customer customer);
    Optional<Customer> findById(UUID id);
    Optional<Customer> findByCustomerId(String customerId);
    List<Customer> findAll();
    List<Customer> findAllActive();
    boolean existsByCustomerId(String customerId);
    void deleteById(UUID id);
}
