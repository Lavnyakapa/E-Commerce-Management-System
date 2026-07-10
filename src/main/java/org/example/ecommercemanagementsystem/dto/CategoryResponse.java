package org.example.ecommercemanagementsystem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {

    private Long categoryId;
    private String categoryName;
    private String categoryDescription;
    private String status;
}