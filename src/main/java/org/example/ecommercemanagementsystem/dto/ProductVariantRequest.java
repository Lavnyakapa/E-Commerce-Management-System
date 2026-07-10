package org.example.ecommercemanagementsystem.dto;

import lombok.Data;

@Data
public class ProductVariantRequest {

    private String sku;
    private String size;
    private String color;
    private Double price;
    private Integer stockQuantity;
}