package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.customer.Customer;
import com.inventory.backend.infrastructure.persistence.entity.CustomerEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerPersistenceMapper {
    Customer toDomain(CustomerEntity entity);
    CustomerEntity toEntity(Customer domain);
}
