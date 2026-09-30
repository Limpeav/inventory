package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "purchase_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", nullable = false)
    private PurchaseEntity purchase;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(nullable = false)
    private double quantity;

    @Column(name = "ordered_quantity")
    @Builder.Default
    private double orderedQuantity = 0;

    @Column(name = "received_quantity")
    @Builder.Default
    private double receivedQuantity = 0;

    @Column(name = "unit_cost", precision = 15, scale = 4, nullable = false)
    private BigDecimal unitCost;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;
}
