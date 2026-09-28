package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.employee.Employee;
import com.inventory.backend.domain.employee.EmployeeRepository;
import com.inventory.backend.infrastructure.persistence.mapper.EmployeePersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaEmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EmployeeRepositoryAdapter implements EmployeeRepository {

    private final JpaEmployeeRepository jpaRepo;
    private final EmployeePersistenceMapper mapper;

    @Override
    public Employee save(Employee employee) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(employee)));
    }

    @Override
    public Optional<Employee> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Employee> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Employee> findAllActive() {
        return jpaRepo.findAllActive().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
