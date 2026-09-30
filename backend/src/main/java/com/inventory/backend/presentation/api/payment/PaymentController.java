package com.inventory.backend.presentation.api.payment;

import com.inventory.backend.application.payment.PaymentService;
import com.inventory.backend.domain.payment.Payment;
import com.inventory.backend.presentation.dto.request.CreatePaymentRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.PaymentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> findAll(
            @RequestParam(name = "referenceId", required = false) UUID referenceId) {
        List<Payment> list = referenceId != null
                ? paymentService.findByReferenceId(referenceId)
                : paymentService.findAll();
        return ResponseEntity.ok(ApiResponse.success(list.stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/reference/{referenceId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> findByReferenceId(@PathVariable("referenceId") UUID referenceId) {
        List<Payment> list = paymentService.findByReferenceId(referenceId);
        return ResponseEntity.ok(ApiResponse.success(list.stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/reference/{referenceId}/total")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalPaid(@PathVariable("referenceId") UUID referenceId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getTotalPaid(referenceId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PaymentResponse>> create(@Valid @RequestBody CreatePaymentRequest request) {
        Payment created = paymentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment recorded", toResponse(created)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        paymentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Payment deleted", null));
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .referenceType(p.getReferenceType())
                .referenceId(p.getReferenceId())
                .referenceCode(p.getReferenceCode())
                .amount(p.getAmount())
                .totalAmount(p.getTotalAmount())
                .remainingBalance(p.getRemainingBalance())
                .paymentMethod(p.getPaymentMethod())
                .paymentDate(p.getPaymentDate())
                .currency(p.getCurrency())
                .exchangeRate(p.getExchangeRate())
                .note(p.getNote())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
