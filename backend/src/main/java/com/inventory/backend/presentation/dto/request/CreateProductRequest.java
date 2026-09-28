package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateProductRequest {
    @NotBlank(message = "Product name is required")
    @Size(max = 150)
    private String name;

    @Size(max = 100)
    private String barcode;

    @Size(max = 100)
    private String model;

    @Size(max = 50)
    private String packageUnit;

    @Size(max = 1000)
    private String description;

    private UUID categoryId;

    @DecimalMin(value = "0.0", message = "Cost must be non-negative")
    private BigDecimal cost;

    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    private BigDecimal price;

    private double reorderLevel;
    private boolean hidden;
    private LocalDate startDate;
}
