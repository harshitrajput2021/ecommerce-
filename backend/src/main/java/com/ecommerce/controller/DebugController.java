package com.ecommerce.controller;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * DEBUG ONLY - Remove in production!
 * This endpoint allows checking database contents via API
 */
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final UserRepository userRepository;

    public DebugController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<UserDebugInfo> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDebugInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPasswordHash(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // Simple DTO to show user data
    record UserDebugInfo(
            Long id,
            String name,
            String email,
            String passwordHash,
            java.time.LocalDateTime createdAt
    ) {}
}
