package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProvinceResponse {
    private Integer code;
    private String name;
}
