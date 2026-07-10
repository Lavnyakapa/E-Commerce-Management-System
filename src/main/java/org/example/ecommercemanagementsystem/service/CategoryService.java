package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.CategoryDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CategoryRequest;
import org.example.ecommercemanagementsystem.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {

  CategoryResponse createCategory(CategoryRequest request);

  CategoryResponse getCategoryById(Long id);

  List<CategoryResponse> getAllCategories();

  CategoryResponse updateCategory(Long id, CategoryRequest request);

  CategoryDeleteResponse deleteCategory(Long id);
}