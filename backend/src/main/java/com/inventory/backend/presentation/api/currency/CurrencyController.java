package com.inventory.backend.presentation.api.currency;

import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.CurrencyResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/currencies")
public class CurrencyController {

    private static final List<CurrencyResponse> CURRENCIES = List.of(
            CurrencyResponse.builder().code(1).name("USD").build(),
            CurrencyResponse.builder().code(2).name("KHR").build()
    );

    @GetMapping
    public ResponseEntity<ApiResponse<List<CurrencyResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(CURRENCIES));
    }
}
