package com.ecommerce.service;

import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.dto.OrderItemResponse;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.EmptyCartException;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(userId).build()));
    }

    public CartResponse buildCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    BigDecimal unitPrice = item.getProduct().getPrice();
                    BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                    return CartItemResponse.builder()
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .unitPrice(unitPrice)
                            .quantity(item.getQuantity())
                            .lineTotal(lineTotal)
                            .build();
                })
                .toList();

        int totalItems = itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum();
        BigDecimal grandTotal = itemResponses.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(itemResponses)
                .totalItems(totalItems)
                .grandTotal(grandTotal)
                .build();
    }

    public CartResponse getCart(Long userId) {
        return buildCartResponse(getOrCreateCart(userId));
    }

    public CartResponse addItem(Long userId, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));

        if (quantity > product.getStockQuantity()) {
            throw new InsufficientStockException(
                    "Requested quantity " + quantity + " exceeds available stock " + product.getStockQuantity());
        }

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + quantity;
            if (newQty > product.getStockQuantity()) {
                throw new InsufficientStockException(
                        "Total quantity " + newQty + " exceeds available stock " + product.getStockQuantity());
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        Cart refreshed = cartRepository.findById(cart.getId()).orElse(cart);
        return buildCartResponse(refreshed);
    }

    public CartResponse updateItem(Long userId, Long productId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found for product: " + productId));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        Cart refreshed = cartRepository.findById(cart.getId()).orElse(cart);
        return buildCartResponse(refreshed);
    }

    public CartResponse removeItem(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found for product: " + productId));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        Cart refreshed = cartRepository.findById(cart.getId()).orElse(cart);
        return buildCartResponse(refreshed);
    }

    @Transactional
    public OrderResponse checkout(Long userId, String shippingAddress) {
        Cart cart = getOrCreateCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new EmptyCartException("Cart is empty");
        }

        Order order = Order.builder()
                .userId(userId)
                .shippingAddress(shippingAddress)
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();
            orderItems.add(orderItem);
        }

        BigDecimal totalPrice = orderItems.stream()
                .map(oi -> oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        Order saved = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        List<OrderItemResponse> itemResponses = saved.getItems().stream()
                .map(oi -> OrderItemResponse.builder()
                        .productId(oi.getProduct().getId())
                        .productName(oi.getProductName())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getUnitPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(saved.getId())
                .createdAt(saved.getCreatedAt())
                .shippingAddress(saved.getShippingAddress())
                .items(itemResponses)
                .totalPrice(saved.getTotalPrice())
                .build();
    }
}
