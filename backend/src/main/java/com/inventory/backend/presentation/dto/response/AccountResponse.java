package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountResponse {
    private Integer code;
    private Integer accountTypeCode;
    private String name;
    private String description;
    private Boolean isCredit;
    private Boolean isDefault;
}
