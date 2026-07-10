package org.example.ecommercemanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryResponse {

    private Long subCategoryId;
    private String subCategoryName;
    private String subCategoryDescription;
    private String status;

    private Long categoryId;
    private String categoryName;
}