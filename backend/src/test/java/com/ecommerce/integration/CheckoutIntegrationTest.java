package com.ecommerce.integration;

import com.ecommerce.dto.*;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class CheckoutIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    private String registerAndLogin(String email, String password) {
        RegisterRequest registerRequest = new RegisterRequest("Checkout User", email, password);
        restTemplate.postForEntity("/api/auth/register", registerRequest, Void.class);

        LoginRequest loginRequest = new LoginRequest(email, password);
        ResponseEntity<LoginResponse> loginResponse = restTemplate.postForEntity(
                "/api/auth/login", loginRequest, LoginResponse.class);
        assertThat(loginResponse.getBody()).isNotNull();
        return loginResponse.getBody().getToken();
    }

    private HttpHeaders bearerHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Test
    void addToCartThenCheckout_createsOrderAndClearsCart() {
        // Insert a product directly via repository
        Product product = Product.builder()
                .name("Integration Widget")
                .description("A test product")
                .price(new BigDecimal("15.00"))
                .category("Test")
                .stockQuantity(50)
                .imageUrl("http://example.com/widget.png")
                .build();
        product = productRepository.save(product);
        Long productId = product.getId();

        // Register and login
        String token = registerAndLogin("checkout@example.com", "password123");
        HttpHeaders headers = bearerHeaders(token);

        // Add item to cart
        AddToCartRequest addToCartRequest = new AddToCartRequest(productId, 2);
        ResponseEntity<CartResponse> addResponse = restTemplate.exchange(
                "/api/cart/items", HttpMethod.POST,
                new HttpEntity<>(addToCartRequest, headers), CartResponse.class);
        assertThat(addResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(addResponse.getBody()).isNotNull();
        assertThat(addResponse.getBody().getItems()).hasSize(1);

        // Checkout
        CheckoutRequest checkoutRequest = new CheckoutRequest("123 Main St, Springfield");
        ResponseEntity<OrderResponse> checkoutResponse = restTemplate.exchange(
                "/api/orders/checkout", HttpMethod.POST,
                new HttpEntity<>(checkoutRequest, headers), OrderResponse.class);
        assertThat(checkoutResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        OrderResponse order = checkoutResponse.getBody();
        assertThat(order).isNotNull();
        assertThat(order.getId()).isNotNull();
        assertThat(order.getItems()).hasSize(1);
        assertThat(order.getItems().get(0).getProductId()).isEqualTo(productId);
        assertThat(order.getItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(order.getTotalPrice()).isEqualByComparingTo(new BigDecimal("30.00"));

        // Verify cart is now empty
        ResponseEntity<CartResponse> cartResponse = restTemplate.exchange(
                "/api/cart", HttpMethod.GET,
                new HttpEntity<>(headers), CartResponse.class);
        assertThat(cartResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(cartResponse.getBody()).isNotNull();
        assertThat(cartResponse.getBody().getItems()).isEmpty();
    }
}
