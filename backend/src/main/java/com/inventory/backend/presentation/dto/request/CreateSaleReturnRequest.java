package com.inventory.backend.presentation.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateSaleReturnRequest {

    @NotNull(message = "Sale ID is required")
    private UUID saleId;

    private LocalDate returnDate;

    private String reason;

    @NotEmpty(message = "At least one item must be returned")
    @Valid
    private List<ReturnItemRequest> items;

    @Data
    public static class ReturnItemRequest {
        @NotNull(message = "Product ID is required")
        private UUID productId;

        @Positive(message = "Quantity must be greater than zero")
        private double quantity;
    }
}
