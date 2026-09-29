package com.inventory.backend.application.payment;

import com.inventory.backend.domain.purchase.PurchaseRepository;
import com.inventory.backend.domain.sale.SaleRepository;
import com.inventory.backend.domain.payment.Payment;
import com.inventory.backend.domain.payment.PaymentRepository;
import com.inventory.backend.presentation.dto.request.CreatePaymentRequest;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;

    @Transactional(readOnly = true)
    public List<Payment> findAll() { return paymentRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<Payment> findByReferenceId(UUID referenceId) { return paymentRepository.findByReferenceId(referenceId); }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPaid(UUID referenceId) { return paymentRepository.sumByReferenceId(referenceId); }

    public Payment create(CreatePaymentRequest request) {
        String refType = request.getReferenceType().trim().toUpperCase();
        if ("SALE".equals(refType)) {
            saleRepository.findById(request.getReferenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sale not found: " + request.getReferenceId()));
        } else if ("PURCHASE".equals(refType)) {
            purchaseRepository.findById(request.getReferenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + request.getReferenceId()));
        } else {
            throw new IllegalArgumentException("Invalid reference type '" + request.getReferenceType() + "'. Expected SALE or PURCHASE.");
        }

        Payment payment = new Payment();
        payment.setReferenceType(refType);
        payment.setReferenceId(request.getReferenceId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "CASH");
        payment.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        payment.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        payment.setExchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE);
        payment.setNote(request.getNote());
        return paymentRepository.save(payment);
    }

    public void delete(UUID id) {
        paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        paymentRepository.deleteById(id);
    }
}
