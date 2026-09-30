package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ExpenseCategoryResponse {
    private UUID id;
    private Integer categoryCode;
    private String name;
    private String description;
}
