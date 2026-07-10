package org.example.ecommercemanagementsystem.dto;

import lombok.Data;
import org.example.ecommercemanagementsystem.entity.CategoryStatus;

@Data
public class CategoryRequest {

    private String categoryName;

    private String categoryDescription;

    private CategoryStatus status;
}

