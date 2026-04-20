package com.ecommerce.service;

import com.ecommerce.dto.PagedProductResponse;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public PagedProductResponse getProducts(String keyword, String category, Pageable pageable) {
        Page<Product> page = productRepository.findByKeywordAndCategory(keyword, category, pageable);
        return PagedProductResponse.builder()
                .content(page.getContent().stream().map(ProductResponse::fromEntity).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        return ProductResponse.fromEntity(product);
    }
}
