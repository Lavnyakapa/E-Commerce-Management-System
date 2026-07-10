package org.example.ecommercemanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Long cartItemId;
    private Long cartId;
    private Long variantId;
    private String productName;
    private String sku;
    private String color;
    private String size;
    private Double price;
    private Integer quantity;
    private Integer stockQuantity;
    private Double totalPrice;
}