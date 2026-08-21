package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.SubCategoryDeleteResponse;
import org.example.ecommercemanagementsystem.dto.SubCategoryRequest;
import org.example.ecommercemanagementsystem.dto.SubCategoryResponse;
import org.example.ecommercemanagementsystem.entity.CategoryEntity;
import org.example.ecommercemanagementsystem.entity.SubCategoryEntity;
import org.example.ecommercemanagementsystem.entity.SubCategoryStatus;
import org.example.ecommercemanagementsystem.repository.CategoryRepository;
import org.example.ecommercemanagementsystem.repository.SubCategoryRepository;
import org.example.ecommercemanagementsystem.service.SubCategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;


    // ============================================================
    // CREATE SUBCATEGORY
    // ============================================================

    @Override
    public SubCategoryResponse createSubCategory(SubCategoryRequest request) {

        // Check category ID
        if (request.getCategoryId() == null) {
            throw new RuntimeException("Category ID is required");
        }

        // Find category
        CategoryEntity category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with id: "
                                        + request.getCategoryId()
                        )
                );

        // Create SubCategory
        SubCategoryEntity sc = new SubCategoryEntity();

        sc.setSubCategoryName(request.getSubCategoryName());

        sc.setSubCategoryDescription(
                request.getSubCategoryDescription()
        );

        // Set status
        if (request.getStatus() != null) {
            sc.setStatus(request.getStatus());
        } else {
            sc.setStatus(SubCategoryStatus.ACTIVE);
        }

        // Set category
        sc.setCategory(category);

        // Save
        SubCategoryEntity saved =
                subCategoryRepository.save(sc);

        return mapToResponse(saved);
    }


    // ============================================================
    // GET SUBCATEGORY BY ID
    // ============================================================

    @Override
    public SubCategoryResponse getSubCategoryById(Long id) {

        SubCategoryEntity sc =
                subCategoryRepository
                        .findByIdWithCategory(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "SubCategory not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(sc);
    }


    // ============================================================
    // GET ALL SUBCATEGORIES
    // ============================================================

    @Override
    public List<SubCategoryResponse> getAllSubCategories() {

        return subCategoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET SUBCATEGORIES BY CATEGORY NAME
    // ============================================================

    @Override
    public List<SubCategoryResponse> getSubCategoriesByCategoryName(
            String categoryName) {

        return subCategoryRepository
                .findByCategoryCategoryName(categoryName)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // UPDATE SUBCATEGORY
    // ============================================================

    @Override
    public SubCategoryResponse updateSubCategory(
            Long id,
            SubCategoryRequest request) {

        // Find existing subcategory
        SubCategoryEntity sc =
                subCategoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "SubCategory not found with id: "
                                                + id
                                )
                        );

        // Update name
        sc.setSubCategoryName(
                request.getSubCategoryName()
        );

        // Update description
        sc.setSubCategoryDescription(
                request.getSubCategoryDescription()
        );

        // Update status
        if (request.getStatus() != null) {
            sc.setStatus(request.getStatus());
        }

        // Update category if categoryId is provided
        if (request.getCategoryId() != null) {

            CategoryEntity category =
                    categoryRepository
                            .findById(request.getCategoryId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Category not found with id: "
                                                    + request.getCategoryId()
                                    )
                            );

            sc.setCategory(category);
        }

        // Save updated subcategory
        SubCategoryEntity updated =
                subCategoryRepository.save(sc);

        return mapToResponse(updated);
    }


    // ============================================================
    // DELETE SUBCATEGORY
    // ============================================================

    @Override
    public SubCategoryDeleteResponse deleteSubCategory(Long id) {

        SubCategoryEntity sc =
                subCategoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "SubCategory not found with id: "
                                                + id
                                )
                        );

        subCategoryRepository.delete(sc);

        SubCategoryDeleteResponse response =
                new SubCategoryDeleteResponse();

        response.setSubCategoryId(id);

        response.setMessage(
                "SubCategory deleted successfully"
        );

        return response;
    }


    // ============================================================
    // GET SUBCATEGORY BY NAME
    // ============================================================

    @Override
    public SubCategoryResponse getSubCategoryByName(
            String subCategoryName) {

        SubCategoryEntity subCategory =
                subCategoryRepository
                        .findBySubCategoryName(subCategoryName)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "SubCategory not found"
                                )
                        );

        return mapToResponse(subCategory);
    }


    // ============================================================
    // MAPPER
    // ============================================================

    private SubCategoryResponse mapToResponse(
            SubCategoryEntity sc) {

        SubCategoryResponse response =
                new SubCategoryResponse();

        response.setSubCategoryId(
                sc.getSubCategoryId()
        );

        response.setSubCategoryName(
                sc.getSubCategoryName()
        );

        response.setSubCategoryDescription(
                sc.getSubCategoryDescription()
        );

        // Enum -> String
        if (sc.getStatus() != null) {
            response.setStatus(
                    sc.getStatus().name()
            );
        }

        // Category information
        if (sc.getCategory() != null) {

            response.setCategoryId(
                    sc.getCategory().getCategoryId()
            );

            response.setCategoryName(
                    sc.getCategory().getCategoryName()
            );
        }

        return response;
    }
}