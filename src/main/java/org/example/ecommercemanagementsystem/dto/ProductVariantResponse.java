package org.example.ecommercemanagementsystem.dto;

import lombok.Data;

@Data
public class ProductVariantResponse {

    private String sku;
    private String color;
    private String size;
    private String storage;
    private Double price;
    private Double discountPrice;
    private Integer stockQuantity;
    private Double weight;
}