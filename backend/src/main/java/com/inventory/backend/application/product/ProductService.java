package com.inventory.backend.application.product;

import com.inventory.backend.domain.category.Category;
import com.inventory.backend.domain.category.CategoryRepository;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.stock.StockRepository;
import com.inventory.backend.presentation.dto.request.CreateProductRequest;
import com.inventory.backend.presentation.exception.ResourceAlreadyExistsException;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockRepository stockRepository;

    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return productRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .collect(Collectors.toList());
                
    }

    @Transactional(readOnly = true)
    public List<Product> findAllActive() {
        return productRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public Product findById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Product findByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));
    }

    public Product create(CreateProductRequest request) {
        if (request.getBarcode() != null && !request.getBarcode().isBlank()
                && productRepository.existsByBarcode(request.getBarcode())) {
            throw new ResourceAlreadyExistsException("Barcode already exists: " + request.getBarcode());
        }
        // Validate category exists
        if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));
        }

        Product product = new Product();
        mapRequestToProduct(request, product);
        return productRepository.save(product);
    }

    public Product update(UUID id, CreateProductRequest request) {
        Product product = findById(id);

        if (request.getBarcode() != null && !request.getBarcode().isBlank()
                && !request.getBarcode().equals(product.getBarcode())
                && productRepository.existsByBarcode(request.getBarcode())) {
            throw new ResourceAlreadyExistsException("Barcode already exists: " + request.getBarcode());
        }
        if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));
        }
        mapRequestToProduct(request, product);
        return productRepository.save(product);
    }

    public void delete(UUID id) {
        Product product = findById(id);
        product.setDeleted(true);
        productRepository.save(product);
    }

    private void mapRequestToProduct(CreateProductRequest request, Product product) {
        product.setName(request.getName());
        product.setBarcode(request.getBarcode());
        product.setModel(request.getModel());
        product.setPackageUnit(request.getPackageUnit());
        product.setDescription(request.getDescription());
        product.setCategoryId(request.getCategoryId());
        product.setCost(request.getCost());
        product.setPrice(request.getPrice());
        product.setReorderLevel(request.getReorderLevel());
        product.setHidden(request.isHidden());
        product.setStartDate(request.getStartDate());
        product.setProductType(request.getProductType());
        product.setNameKh(request.getNameKh());
        product.setBrand(request.getBrand());
        product.setCondition(request.getCondition() != null && !request.getCondition().isBlank() ? request.getCondition() : "NEW");
        product.setDeleted(false);
    }

    @Transactional(readOnly = true)
    public String resolveCategoryName(UUID categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId).map(Category::getName).orElse(null);
    }
}
