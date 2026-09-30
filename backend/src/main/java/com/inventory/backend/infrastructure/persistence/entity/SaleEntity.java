package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sales")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "invoice_code", length = 50)
    private String invoiceCode;

    @Column(name = "sale_date", nullable = false)
    private LocalDate saleDate;

    @Column(name = "customer_id")
    private UUID customerId;

    @Column(name = "employee_id")
    private UUID employeeId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "exchange_rate", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal exchangeRate = BigDecimal.ONE;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(length = 20)
    @Builder.Default
    private String status = "COMPLETED";

    @Column(length = 1000)
    private String note;

    @Column(name = "sale_uuid", length = 100)
    private String saleUuid;

    @Column(nullable = false)
    @Builder.Default
    private boolean paid = false;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SaleItemEntity> items = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
