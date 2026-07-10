package org.example.ecommercemanagementsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {


    private Long orderItemId;


    private Long variantId;


    private String productName;


    private String sku;


    private String size;


    private String color;


    private Integer quantity;


    private Double price;


    private Double totalPrice;

}