package com.inventory.backend.domain.customer;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity: Customer
 * Mirrors SmartInventory Customer BLL (credit limit = balanceAllowed + daysAllowed)
 */
public class Customer {
    private UUID id;
    private String customerId;      // business-facing ID string
    private String name;
    private String phone;
    private String fax;
    private String address;
    private String email;
    private String province;
    private BigDecimal creditLimit;  // balanceAllowen
    private int creditDays;          // daysAllowen
    private int status;              // 0=active, 1=inactive
    private String description;
    private String employeeCode;     // assigned sales employee
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Customer() {}

    // Domain behavior
    public boolean isActive() { return status == 0; }

    public boolean hasOverdueCreditLimit(BigDecimal currentBalance) {
        return currentBalance.compareTo(creditLimit) > 0;
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFax() { return fax; }
    public void setFax(String fax) { this.fax = fax; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }

    public int getCreditDays() { return creditDays; }
    public void setCreditDays(int creditDays) { this.creditDays = creditDays; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
