package org.example.ecommercemanagementsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponse {

    private Long productId;

    private String productName;

    private String description;

    private String brand;

    private String status;

    private Long subCategoryId;

    private List<ProductVariantResponse> variants;

    private List<String> imageUrls;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}