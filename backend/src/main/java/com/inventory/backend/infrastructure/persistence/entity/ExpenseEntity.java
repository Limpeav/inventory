package com.inventory.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ex_code", nullable = false)
    private Integer exCode;

    @Column(name = "ex_date")
    private LocalDateTime exDate;

    @Column(name = "ex_emp_code")
    private Integer exEmpCode;

    @Column(name = "ex_user_code")
    private Integer exUserCode;

    @Column(name = "ex_ref_no", length = 50)
    private String exRefNo;

    @Column(name = "ex_description", length = 100)
    private String exDescription;

    @Column(name = "ex_status", length = 50)
    private String exStatus;

    @Column(name = "ex_account_code")
    private Integer exAccountCode;

    @Column(name = "ex_exchange_rate")
    private Double exExchangeRate;

    @Column(name = "uuid")
    private UUID uuid;

    @Column(name = "ex_amount")
    private Double exAmount;

    @Column(name = "ex_exp_id")
    private Integer exExpID;
}
