package com.inventory.backend.presentation.api.account;

import com.inventory.backend.presentation.dto.response.AccountResponse;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private static final List<AccountResponse> ACCOUNTS = List.of(
            AccountResponse.builder()
                    .code(1)
                    .accountTypeCode(1)
                    .name("Cash on Hand")
                    .description("Main cash register")
                    .isCredit(false)
                    .isDefault(true)
                    .build(),
            AccountResponse.builder()
                    .code(2)
                    .accountTypeCode(2)
                    .name("Bank Account (ABA)")
                    .description("ABA Bank Corporate Account")
                    .isCredit(false)
                    .isDefault(false)
                    .build(),
            AccountResponse.builder()
                    .code(3)
                    .accountTypeCode(1)
                    .name("Petty Cash")
                    .description("Office daily petty cash")
                    .isCredit(false)
                    .isDefault(false)
                    .build()
    );

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(ACCOUNTS));
    }
}
