package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class ReceivePurchaseItemsRequest {

    private LocalDate deliveryDate;

    @NotEmpty(message = "Items to receive must not be empty")
    private List<ReceiveItemEntry> items;

    @Data
    public static class ReceiveItemEntry {
        private UUID itemId;
        private UUID productId;
        private double quantityReceived; // incremental quantity just received
    }
}
