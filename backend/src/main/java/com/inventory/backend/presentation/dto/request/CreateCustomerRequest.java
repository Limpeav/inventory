package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateCustomerRequest {
    @Size(max = 50)
    private String customerId;

    @NotBlank(message = "Customer name is required")
    @Size(max = 150)
    private String name;

    @Size(max = 50)
    private String phone;

    @Size(max = 50)
    private String fax;

    @Size(max = 300)
    private String address;

    @Size(max = 100)
    private String email;

    @Size(max = 100)
    private String province;

    private BigDecimal creditLimit;

    @Min(value = 0)
    private int creditDays;

    private int status;

    @Size(max = 1000)
    private String description;

    @Size(max = 10)
    private String employeeCode;

    @Size(max = 20)
    private String vat;

    @Size(max = 500)
    private String nameKh;

    @Size(max = 500)
    private String addressKh;
}
