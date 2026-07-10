package org.example.ecommercemanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductDeleteResponse {

    private Long productId;
    private String message;
}