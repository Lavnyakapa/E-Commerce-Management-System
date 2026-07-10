package org.example.ecommercemanagementsystem.dto;

import lombok.Data;
import org.example.ecommercemanagementsystem.entity.SubCategoryStatus;

@Data
public class SubCategoryRequest {

    private String subCategoryName;
    private String subCategoryDescription;
    private SubCategoryStatus status;
    private Long categoryId;
}