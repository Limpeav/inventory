package com.inventory.backend.application;

import com.inventory.backend.application.category.CategoryService;
import com.inventory.backend.application.customer.CustomerService;
import com.inventory.backend.application.employee.EmployeeService;
import com.inventory.backend.application.payment.PaymentService;
import com.inventory.backend.application.role.RoleService;
import com.inventory.backend.application.salereturn.SaleReturnService;
import com.inventory.backend.application.stock.StockService;
import com.inventory.backend.application.supplier.SupplierService;
import com.inventory.backend.domain.category.Category;
import com.inventory.backend.domain.category.CategoryRepository;
import com.inventory.backend.domain.customer.Customer;
import com.inventory.backend.domain.customer.CustomerRepository;
import com.inventory.backend.domain.employee.Employee;
import com.inventory.backend.domain.employee.EmployeeRepository;
import com.inventory.backend.domain.payment.PaymentRepository;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.purchase.PurchaseRepository;
import com.inventory.backend.domain.role.Role;
import com.inventory.backend.domain.role.RoleRepository;
import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.sale.SaleItem;
import com.inventory.backend.domain.sale.SaleRepository;
import com.inventory.backend.domain.salereturn.SaleReturnRepository;
import com.inventory.backend.domain.supplier.SupplierRepository;
import com.inventory.backend.presentation.dto.request.CreateCategoryRequest;
import com.inventory.backend.presentation.dto.request.CreateCustomerRequest;
import com.inventory.backend.presentation.dto.request.CreateEmployeeRequest;
import com.inventory.backend.presentation.dto.request.CreatePaymentRequest;
import com.inventory.backend.presentation.dto.request.CreateSaleReturnRequest;
import com.inventory.backend.presentation.dto.request.CreateSupplierRequest;
import com.inventory.backend.presentation.exception.ResourceAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CrudServicesTest {

    @Mock private EmployeeRepository employeeRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private SupplierRepository supplierRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private SaleRepository saleRepository;
    @Mock private PurchaseRepository purchaseRepository;
    @Mock private SaleReturnRepository saleReturnRepository;
    @Mock private ProductRepository productRepository;
    @Mock private StockService stockService;

    private EmployeeService employeeService;
    private CustomerService customerService;
    private CategoryService categoryService;
    private SupplierService supplierService;
    private RoleService roleService;
    private PaymentService paymentService;
    private SaleReturnService saleReturnService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService(employeeRepository);
        customerService = new CustomerService(customerRepository);
        categoryService = new CategoryService(categoryRepository);
        supplierService = new SupplierService(supplierRepository);
        roleService = new RoleService(roleRepository, null, null);
        paymentService = new PaymentService(paymentRepository, saleRepository, purchaseRepository);
        saleReturnService = new SaleReturnService(saleReturnRepository, saleRepository, productRepository, stockService);
    }

    // ── Employee CRUD Tests ──────────────────────────────────────────────────
    @Test
    @DisplayName("Employee: Normalizes gender 'MALE' to 'M'")
    void employee_NormalizesGenderMale() {
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setName("John Doe");
        request.setGender("MALE");

        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        Employee result = employeeService.create(request);
        assertThat(result.getGender()).isEqualTo("M");
    }

    @Test
    @DisplayName("Employee: Normalizes gender 'Female' to 'F'")
    void employee_NormalizesGenderFemale() {
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setName("Jane Doe");
        request.setGender("Female");

        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        Employee result = employeeService.create(request);
        assertThat(result.getGender()).isEqualTo("F");
    }

    @Test
    @DisplayName("Employee: Handles null gender safely")
    void employee_NullGender() {
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setName("Sam Doe");
        request.setGender(null);

        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        Employee result = employeeService.create(request);
        assertThat(result.getGender()).isNull();
    }

    // ── Customer CRUD Tests ──────────────────────────────────────────────────
    @Test
    @DisplayName("Customer: Throws when updating to existing customerId")
    void customer_DuplicateIdOnUpdate() {
        UUID id = UUID.randomUUID();
        Customer existing = new Customer();
        existing.setId(id);
        existing.setCustomerId("CUST-001");

        when(customerRepository.findById(id)).thenReturn(Optional.of(existing));
        when(customerRepository.existsByCustomerId("CUST-002")).thenReturn(true);

        CreateCustomerRequest request = new CreateCustomerRequest();
        request.setCustomerId("CUST-002");
        request.setName("Customer 2");

        assertThatThrownBy(() -> customerService.update(id, request))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessageContaining("Customer ID already exists");
    }

    // ── Category CRUD Tests ──────────────────────────────────────────────────
    @Test
    @DisplayName("Category: Throws when updating to existing category name")
    void category_DuplicateNameOnUpdate() {
        UUID id = UUID.randomUUID();
        Category existing = new Category();
        existing.setId(id);
        existing.setName("Electronics");

        when(categoryRepository.findById(id)).thenReturn(Optional.of(existing));
        when(categoryRepository.existsByName("Beverages")).thenReturn(true);

        CreateCategoryRequest request = new CreateCategoryRequest();
        request.setName("Beverages");

        assertThatThrownBy(() -> categoryService.update(id, request))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessageContaining("Category already exists");
    }

    // ── Supplier CRUD Tests ──────────────────────────────────────────────────
    @Test
    @DisplayName("Supplier: Throws on create with duplicate name")
    void supplier_DuplicateNameOnCreate() {
        when(supplierRepository.existsByName("Global Supplies")).thenReturn(true);

        CreateSupplierRequest request = new CreateSupplierRequest();
        request.setName("Global Supplies");

        assertThatThrownBy(() -> supplierService.create(request))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessageContaining("Supplier already exists");
    }

    // ── Role Protection Tests ────────────────────────────────────────────────
    @Test
    @DisplayName("Role: Prevents deletion of system ADMIN role")
    void role_ProtectAdminRole() {
        UUID adminRoleId = UUID.randomUUID();
        Role adminRole = new Role();
        adminRole.setId(adminRoleId);
        adminRole.setName("ADMIN");

        when(roleRepository.findById(adminRoleId)).thenReturn(Optional.of(adminRole));

        assertThatThrownBy(() -> roleService.delete(adminRoleId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ADMIN");
        verify(roleRepository, never()).deleteById(any());
    }

    // ── Payment Reference Validation Tests ───────────────────────────────────
    @Test
    @DisplayName("Payment: Rejects creation for non-existent sale")
    void payment_ValidateSaleReference() {
        UUID fakeSaleId = UUID.randomUUID();
        when(saleRepository.findById(fakeSaleId)).thenReturn(Optional.empty());

        CreatePaymentRequest request = new CreatePaymentRequest();
        request.setReferenceType("SALE");
        request.setReferenceId(fakeSaleId);
        request.setAmount(BigDecimal.valueOf(100));

        assertThatThrownBy(() -> paymentService.create(request))
                .hasMessageContaining("Sale not found");
    }

    @Test
    @DisplayName("Payment: Rejects creation for non-existent purchase")
    void payment_ValidatePurchaseReference() {
        UUID fakePurchaseId = UUID.randomUUID();
        when(purchaseRepository.findById(fakePurchaseId)).thenReturn(Optional.empty());

        CreatePaymentRequest request = new CreatePaymentRequest();
        request.setReferenceType("PURCHASE");
        request.setReferenceId(fakePurchaseId);
        request.setAmount(BigDecimal.valueOf(100));

        assertThatThrownBy(() -> paymentService.create(request))
                .hasMessageContaining("Purchase not found");
    }

    @Test
    @DisplayName("Payment: Rejects invalid reference type")
    void payment_ValidateInvalidRefType() {
        CreatePaymentRequest request = new CreatePaymentRequest();
        request.setReferenceType("INVALID_TYPE");
        request.setReferenceId(UUID.randomUUID());
        request.setAmount(BigDecimal.valueOf(100));

        assertThatThrownBy(() -> paymentService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid reference type");
    }

    // ── Sale Return Validation Tests ─────────────────────────────────────────
    @Test
    @DisplayName("SaleReturn: Rejects return of product not in sale")
    void saleReturn_ProductNotInSale() {
        UUID saleId = UUID.randomUUID();
        UUID prodA = UUID.randomUUID();
        UUID prodB = UUID.randomUUID();

        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setStatus("COMPLETED");

        SaleItem itemA = new SaleItem();
        itemA.setProductId(prodA);
        itemA.setQuantity(5);
        itemA.setUnitPrice(BigDecimal.valueOf(20));
        sale.setItems(List.of(itemA));

        when(saleRepository.findById(saleId)).thenReturn(Optional.of(sale));

        Product productB = new Product();
        productB.setId(prodB);
        productB.setName("Product B");
        when(productRepository.findById(prodB)).thenReturn(Optional.of(productB));

        CreateSaleReturnRequest request = new CreateSaleReturnRequest();
        request.setSaleId(saleId);
        CreateSaleReturnRequest.ReturnItemRequest retItem = new CreateSaleReturnRequest.ReturnItemRequest();
        retItem.setProductId(prodB);
        retItem.setQuantity(1);
        request.setItems(List.of(retItem));

        assertThatThrownBy(() -> saleReturnService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("was not part of this sale");
    }

    @Test
    @DisplayName("SaleReturn: Rejects return quantity exceeding sold quantity")
    void saleReturn_QuantityExceedsSold() {
        UUID saleId = UUID.randomUUID();
        UUID prodA = UUID.randomUUID();

        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setStatus("COMPLETED");

        SaleItem itemA = new SaleItem();
        itemA.setProductId(prodA);
        itemA.setQuantity(2);
        itemA.setUnitPrice(BigDecimal.valueOf(20));
        sale.setItems(List.of(itemA));

        when(saleRepository.findById(saleId)).thenReturn(Optional.of(sale));

        Product productA = new Product();
        productA.setId(prodA);
        productA.setName("Product A");
        when(productRepository.findById(prodA)).thenReturn(Optional.of(productA));

        CreateSaleReturnRequest request = new CreateSaleReturnRequest();
        request.setSaleId(saleId);
        CreateSaleReturnRequest.ReturnItemRequest retItem = new CreateSaleReturnRequest.ReturnItemRequest();
        retItem.setProductId(prodA);
        retItem.setQuantity(5); // Sold was 2!
        request.setItems(List.of(retItem));

        assertThatThrownBy(() -> saleReturnService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("exceeds sold quantity");
    }
}
