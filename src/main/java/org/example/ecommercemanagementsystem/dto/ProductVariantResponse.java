package org.example.ecommercemanagementsystem.dto;

import lombok.Data;

@Data
public class ProductVariantResponse {

    private Long variantId;

    private String sku;

    private String color;

    private String size;

    private Double price;

    private Integer stockQuantity;

    private String status;
}