package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TblProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pro_code", nullable = false)
    private Integer proCode;

    @Column(name = "pro_name", nullable = false, length = 50)
    private String proName;

    @Column(name = "pro_packing", length = 50)
    private String proPacking;

    @Column(name = "pro_description", length = 500)
    private String proDescription;

    @Column(name = "pro_cat_code")
    private Short proCatCode;

    @Column(name = "pro_deleted")
    @Builder.Default
    private Boolean proDeleted = false;

    @Column(name = "pro_hidden")
    @Builder.Default
    private Boolean proHidden = false;

    @Column(name = "pro_date_start")
    private LocalDateTime proDateStart;

    @Column(name = "pro_model", length = 50)
    private String proModel;

    @Column(name = "pro_barcode", length = 50)
    private String proBarcode;

    @Column(name = "pro_reorder_level")
    private Double proReorderLevel;

    @Column(name = "pro_type", length = 50)
    private String proType;

    @Column(name = "bonus_code", length = 10)
    private String bonusCode;

    @Column(name = "bonus_value")
    private Double bonusValue;

    @Column(name = "pronamech", length = 50)
    private String pronamech;

    @Column(name = "pro_image", columnDefinition = "bytea")
    private byte[] proImage;
}
