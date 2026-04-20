package com.ecommerce.integration;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.LoginResponse;
import com.ecommerce.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthFlowIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void registerThenLoginThenAccessProtectedEndpoint_returns200() {
        // Register
        RegisterRequest registerRequest = new RegisterRequest("Test User", "authtest@example.com", "password123");
        ResponseEntity<Void> registerResponse = restTemplate.postForEntity(
                "/api/auth/register", registerRequest, Void.class);
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // Login
        LoginRequest loginRequest = new LoginRequest("authtest@example.com", "password123");
        ResponseEntity<LoginResponse> loginResponse = restTemplate.postForEntity(
                "/api/auth/login", loginRequest, LoginResponse.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResponse.getBody()).isNotNull();
        String token = loginResponse.getBody().getToken();
        assertThat(token).isNotBlank();

        // Access protected endpoint with JWT
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<String> productsResponse = restTemplate.exchange(
                "/api/products", HttpMethod.GET, request, String.class);
        assertThat(productsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void accessProtectedEndpointWithoutToken_returns401() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/products", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void loginWithWrongPassword_returns401() {
        // Register first
        RegisterRequest registerRequest = new RegisterRequest("Wrong Pass User", "wrongpass@example.com", "correctpassword");
        restTemplate.postForEntity("/api/auth/register", registerRequest, Void.class);

        // Login with wrong password
        LoginRequest loginRequest = new LoginRequest("wrongpass@example.com", "wrongpassword");
        ResponseEntity<String> loginResponse = restTemplate.postForEntity(
                "/api/auth/login", loginRequest, String.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
