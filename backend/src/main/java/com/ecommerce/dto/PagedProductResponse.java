package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedProductResponse {

    private List<ProductResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
