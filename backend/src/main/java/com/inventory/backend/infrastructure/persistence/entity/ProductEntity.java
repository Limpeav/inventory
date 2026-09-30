package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 100)
    private String barcode;

    @Column(length = 100)
    private String model;

    @Column(name = "package_unit", length = 50)
    private String packageUnit;

    @Column(length = 1000)
    private String description;

    @Column(name = "category_id")
    private UUID categoryId;

    @Column(precision = 15, scale = 4)
    private BigDecimal cost;

    @Column(precision = 15, scale = 4)
    private BigDecimal price;

    @Column(name = "reorder_level")
    @Builder.Default
    private double reorderLevel = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean hidden = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "product_type", length = 50)
    private String productType;

    @Column(name = "name_kh", length = 500)
    private String nameKh;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
