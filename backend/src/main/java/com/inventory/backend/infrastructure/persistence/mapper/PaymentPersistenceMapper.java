package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.payment.Payment;
import com.inventory.backend.infrastructure.persistence.entity.PaymentEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentPersistenceMapper {
    Payment toDomain(PaymentEntity entity);
    PaymentEntity toEntity(Payment domain);
}
