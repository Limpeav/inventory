package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateSupplierRequest {
    @NotBlank(message = "Supplier name is required")
    @Size(max = 150)
    private String name;

    @Size(max = 100)
    private String contactName;

    @Size(max = 50)
    private String telephone;

    @Size(max = 50)
    private String phone;

    @Size(max = 50)
    private String fax;

    @Size(max = 300)
    private String address;

    @Size(max = 100)
    private String email;

    @Size(max = 200)
    private String website;

    @Size(max = 100)
    private String country;

    @Size(max = 1000)
    private String description;
}
