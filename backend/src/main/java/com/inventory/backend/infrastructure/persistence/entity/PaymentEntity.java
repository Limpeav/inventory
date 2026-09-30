package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "reference_type", length = 20, nullable = false)
    private String referenceType; // SALE or PURCHASE

    @Column(name = "reference_id", nullable = false)
    private UUID referenceId;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal amount;

    @Column(name = "payment_method", length = 30)
    @Builder.Default
    private String paymentMethod = "CASH";

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "exchange_rate", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal exchangeRate = BigDecimal.ONE;

    @Column(length = 500)
    private String note;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
