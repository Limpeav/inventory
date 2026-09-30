package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "expense_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exp_id", nullable = false)
    private Integer expId;

    @Column(name = "exp_name", nullable = false, length = 200)
    private String expName;

    @Column(name = "exp_description", length = 200)
    private String expDescription;
}
