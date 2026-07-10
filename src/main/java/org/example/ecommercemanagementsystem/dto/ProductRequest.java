package org.example.ecommercemanagementsystem.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {

    private String productName;
    private String description;
    private String brand;
    private Long subCategoryId;

    private List<ProductVariantRequest> variants;
    private List<String> imageUrls;
}