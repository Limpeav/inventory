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
    public List<Payment> findAll() {
        List<Payment> payments = paymentRepository.findAll();
        payments.forEach(this::enrichPayment);
        return payments;
    }

    @Transactional(readOnly = true)
    public List<Payment> findByReferenceId(UUID referenceId) {
        List<Payment> payments = paymentRepository.findByReferenceId(referenceId);
        payments.forEach(this::enrichPayment);
        return payments;
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPaid(UUID referenceId) { return paymentRepository.sumByReferenceId(referenceId); }

    public Payment create(CreatePaymentRequest request) {
        String refType = request.getReferenceType().trim().toUpperCase();
        String refCode = null;
        BigDecimal totalDebt = null;

        if ("SALE".equals(refType)) {
            var sale = saleRepository.findById(request.getReferenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sale not found: " + request.getReferenceId()));
            refCode = sale.getInvoiceCode();
            totalDebt = sale.getTotalAmount();

            BigDecimal prevPaid = paymentRepository.sumByReferenceId(sale.getId());
            BigDecimal newTotalPaid = prevPaid.add(request.getAmount());
            if (totalDebt != null && newTotalPaid.compareTo(totalDebt) >= 0) {
                sale.setPaid(true);
                saleRepository.save(sale);
            }
        } else if ("PURCHASE".equals(refType)) {
            var purchase = purchaseRepository.findById(request.getReferenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + request.getReferenceId()));
            refCode = purchase.getReferenceCode();
            totalDebt = purchase.getTotalAmount();
        } else {
            throw new IllegalArgumentException("Invalid reference type '" + request.getReferenceType() + "'. Expected SALE or PURCHASE.");
        }

        Payment payment = new Payment();
        payment.setReferenceType(refType);
        payment.setReferenceId(request.getReferenceId());
        payment.setReferenceCode(refCode);
        payment.setAmount(request.getAmount());
        payment.setTotalAmount(totalDebt);
        if (totalDebt != null) {
            BigDecimal prevPaid = paymentRepository.sumByReferenceId(request.getReferenceId());
            BigDecimal remaining = totalDebt.subtract(prevPaid.add(request.getAmount()));
            payment.setRemainingBalance(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);
        }
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "CASH");
        payment.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
        payment.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        payment.setExchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE);
        payment.setNote(request.getNote());
        return paymentRepository.save(payment);
    }

    private void enrichPayment(Payment p) {
        if (p.getReferenceId() != null && (p.getReferenceCode() == null || p.getTotalAmount() == null)) {
            if ("SALE".equalsIgnoreCase(p.getReferenceType())) {
                saleRepository.findById(p.getReferenceId()).ifPresent(s -> {
                    if (p.getReferenceCode() == null) p.setReferenceCode(s.getInvoiceCode());
                    if (p.getTotalAmount() == null || p.getTotalAmount().compareTo(BigDecimal.ZERO) == 0) {
                        p.setTotalAmount(s.getTotalAmount());
                    }
                });
            } else if ("PURCHASE".equalsIgnoreCase(p.getReferenceType())) {
                purchaseRepository.findById(p.getReferenceId()).ifPresent(pur -> {
                    if (p.getReferenceCode() == null) p.setReferenceCode(pur.getReferenceCode());
                    if (p.getTotalAmount() == null || p.getTotalAmount().compareTo(BigDecimal.ZERO) == 0) {
                        p.setTotalAmount(pur.getTotalAmount());
                    }
                });
            }
        }
    }

    public void delete(UUID id) {
        paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        paymentRepository.deleteById(id);
    }
}
