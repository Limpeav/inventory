package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.employee.Employee;
import com.inventory.backend.infrastructure.persistence.entity.EmployeeEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeePersistenceMapper {
    Employee toDomain(EmployeeEntity entity);
    EmployeeEntity toEntity(Employee domain);
}
