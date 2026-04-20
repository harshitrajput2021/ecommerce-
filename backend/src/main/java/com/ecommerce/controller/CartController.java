package com.ecommerce.controller;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private Long resolveUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + email));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(Authentication authentication,
                                                @Valid @RequestBody AddToCartRequest request) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(cartService.addItem(userId, request.getProductId(), request.getQuantity()));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(Authentication authentication,
                                                   @PathVariable Long productId,
                                                   @Valid @RequestBody UpdateCartItemRequest request) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(cartService.updateItem(userId, productId, request.getQuantity()));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItem(Authentication authentication,
                                                   @PathVariable Long productId) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }
}
