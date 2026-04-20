package com.ecommerce.controller;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final OrderService orderService;

    public OrderController(CartService cartService, UserRepository userRepository, OrderService orderService) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.orderService = orderService;
    }

    private Long resolveUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + email));
        return user.getId();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(Authentication authentication,
                                                  @Valid @RequestBody CheckoutRequest request) {
        Long userId = resolveUserId(authentication);
        OrderResponse orderResponse = cartService.checkout(userId, request.getShippingAddress());
        return ResponseEntity.status(201).body(orderResponse);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(orderService.getOrdersForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(Authentication authentication, @PathVariable Long id) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(orderService.getOrderById(userId, id));
    }
}
