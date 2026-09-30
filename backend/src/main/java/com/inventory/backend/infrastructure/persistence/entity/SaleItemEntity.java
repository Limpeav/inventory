package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "sale_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private SaleEntity sale;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(nullable = false)
    private double quantity;

    @Column(name = "unit_price", precision = 15, scale = 4, nullable = false)
    private BigDecimal unitPrice;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "warranty_months")
    @Builder.Default
    private Integer warrantyMonths = 0;
}
