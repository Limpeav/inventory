package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaCustomerRepository extends JpaRepository<CustomerEntity, UUID> {
    Optional<CustomerEntity> findByCustomerId(String customerId);
    boolean existsByCustomerId(String customerId);

    @Query("SELECT c FROM CustomerEntity c WHERE c.status = 0")
    List<CustomerEntity> findAllActive();
}
