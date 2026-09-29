package com.inventory.backend.application.supplier;

import com.inventory.backend.domain.supplier.Supplier;
import com.inventory.backend.domain.supplier.SupplierRepository;
import com.inventory.backend.presentation.dto.request.CreateSupplierRequest;
import com.inventory.backend.presentation.exception.ResourceAlreadyExistsException;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Supplier findById(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    public Supplier create(CreateSupplierRequest request) {
        if (request.getName() != null && !request.getName().isBlank()
                && supplierRepository.existsByName(request.getName())) {
            throw new ResourceAlreadyExistsException("Supplier already exists: " + request.getName());
        }
        Supplier supplier = new Supplier();
        mapToSupplier(request, supplier);
        return supplierRepository.save(supplier);
    }

    public Supplier update(UUID id, CreateSupplierRequest request) {
        Supplier supplier = findById(id);
        if (request.getName() != null && !request.getName().isBlank()
                && !request.getName().equalsIgnoreCase(supplier.getName())
                && supplierRepository.existsByName(request.getName())) {
            throw new ResourceAlreadyExistsException("Supplier already exists: " + request.getName());
        }
        mapToSupplier(request, supplier);
        return supplierRepository.save(supplier);
    }

    public void delete(UUID id) {
        findById(id);
        supplierRepository.deleteById(id);
    }

    private void mapToSupplier(CreateSupplierRequest request, Supplier supplier) {
        supplier.setName(request.getName());
        supplier.setContactName(request.getContactName());
        supplier.setTelephone(request.getTelephone());
        supplier.setPhone(request.getPhone());
        supplier.setFax(request.getFax());
        supplier.setAddress(request.getAddress());
        supplier.setEmail(request.getEmail());
        supplier.setWebsite(request.getWebsite());
        supplier.setCountry(request.getCountry());
        supplier.setDescription(request.getDescription());
    }
}
