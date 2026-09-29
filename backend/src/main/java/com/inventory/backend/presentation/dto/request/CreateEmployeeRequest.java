package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeRequest {
    @NotBlank(message = "Employee name is required")
    @Size(max = 150)
    private String name;

    @Pattern(regexp = "^(?i)(M|F|MALE|FEMALE)?$", message = "Gender must be M, F, Male, or Female")
    private String gender;

    @Size(max = 50)
    private String phone;

    @Size(max = 300)
    private String address;

    private LocalDate startDate;

    @Size(max = 500)
    private String pictureUrl;

    @Size(max = 1000)
    private String description;
}
