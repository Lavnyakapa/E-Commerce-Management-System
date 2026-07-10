package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CategoryDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CategoryRequest;
import org.example.ecommercemanagementsystem.dto.CategoryResponse;
import org.example.ecommercemanagementsystem.entity.CategoryEntity;
import org.example.ecommercemanagementsystem.entity.CategoryStatus;
import org.example.ecommercemanagementsystem.exception.CategoryNotFoundException;
import org.example.ecommercemanagementsystem.repository.CategoryRepository;
import org.example.ecommercemanagementsystem.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        CategoryEntity category = new CategoryEntity();
        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());
        category.setStatus(CategoryStatus.ACTIVE);

        CategoryEntity savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found with id : " + id));

        return mapToResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found with id : " + id));

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());

        CategoryEntity updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    @Override
    public CategoryDeleteResponse deleteCategory(Long id) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found with id : " + id));

        categoryRepository.delete(category);

        CategoryDeleteResponse response = new CategoryDeleteResponse();
        response.setCategoryId(id);
        response.setMessage("Category deleted successfully");

        return response;
    }

    private CategoryResponse mapToResponse(CategoryEntity category) {

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .categoryDescription(category.getCategoryDescription())
                .status(category.getStatus().name())
                .build();
    }
}