package com.inventory.backend.application.employee;

import com.inventory.backend.domain.employee.Employee;
import com.inventory.backend.domain.employee.EmployeeRepository;
import com.inventory.backend.presentation.dto.request.CreateEmployeeRequest;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Employee> findAllActive() {
        return employeeRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public Employee findById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    public Employee create(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        mapToEmployee(request, employee);
        employee.setActive(true);
        return employeeRepository.save(employee);
    }

    public Employee update(UUID id, CreateEmployeeRequest request) {
        Employee employee = findById(id);
        mapToEmployee(request, employee);
        return employeeRepository.save(employee);
    }

    public void delete(UUID id) {
        Employee employee = findById(id);
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    private void mapToEmployee(CreateEmployeeRequest request, Employee employee) {
        employee.setName(request.getName());
        employee.setGender(request.getGender() != null ? request.getGender().toUpperCase() : null);
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setStartDate(request.getStartDate());
        employee.setPictureUrl(request.getPictureUrl());
        employee.setDescription(request.getDescription());
    }
}
