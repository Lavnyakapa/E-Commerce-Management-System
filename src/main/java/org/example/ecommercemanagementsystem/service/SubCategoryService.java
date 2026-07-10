package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.SubCategoryDeleteResponse;
import org.example.ecommercemanagementsystem.dto.SubCategoryRequest;
import org.example.ecommercemanagementsystem.dto.SubCategoryResponse;

import java.util.List;

public interface SubCategoryService {

    SubCategoryResponse createSubCategory(SubCategoryRequest request);

    SubCategoryResponse getSubCategoryById(Long id);

    List<SubCategoryResponse> getAllSubCategories();

    List<SubCategoryResponse> getSubCategoriesByCategoryName(String categoryName);

    SubCategoryResponse updateSubCategory(Long id, SubCategoryRequest request);

    SubCategoryDeleteResponse deleteSubCategory(Long id);

    SubCategoryResponse getSubCategoryByName(String subCategoryName);
}