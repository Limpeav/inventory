package com.inventory.backend.application.customer;

import com.inventory.backend.domain.customer.Customer;
import com.inventory.backend.domain.customer.CustomerRepository;
import com.inventory.backend.presentation.dto.request.CreateCustomerRequest;
import com.inventory.backend.presentation.exception.ResourceAlreadyExistsException;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Customer> findAllActive() {
        return customerRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public Customer findById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }

    public Customer create(CreateCustomerRequest request) {
        if (request.getCustomerId() != null && !request.getCustomerId().isBlank()
                && customerRepository.existsByCustomerId(request.getCustomerId())) {
            throw new ResourceAlreadyExistsException("Customer ID already exists: " + request.getCustomerId());
        }
        Customer customer = new Customer();
        mapToCustomer(request, customer);
        return customerRepository.save(customer);
    }

    public Customer update(UUID id, CreateCustomerRequest request) {
        Customer customer = findById(id);
        mapToCustomer(request, customer);
        return customerRepository.save(customer);
    }

    public void delete(UUID id) {
        findById(id);
        customerRepository.deleteById(id);
    }

    private void mapToCustomer(CreateCustomerRequest request, Customer customer) {
        customer.setCustomerId(request.getCustomerId());
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setFax(request.getFax());
        customer.setAddress(request.getAddress());
        customer.setEmail(request.getEmail());
        customer.setProvince(request.getProvince());
        customer.setCreditLimit(request.getCreditLimit() != null ? request.getCreditLimit() : BigDecimal.ZERO);
        customer.setCreditDays(request.getCreditDays());
        customer.setStatus(request.getStatus());
        customer.setDescription(request.getDescription());
        customer.setEmployeeCode(request.getEmployeeCode());
    }
}
