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

    // CREATE
    @Override
    public SubCategoryResponse createSubCategory(SubCategoryRequest request) {

        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        SubCategoryEntity sc = new SubCategoryEntity();
        sc.setSubCategoryName(request.getSubCategoryName());
        sc.setSubCategoryDescription(request.getSubCategoryDescription());

        // ✅ Enum FIX
        sc.setStatus(SubCategoryStatus.ACTIVE);

        sc.setCategory(category);

        SubCategoryEntity saved = subCategoryRepository.save(sc);

        return mapToResponse(saved);
    }

    // GET BY ID
    @Override
    public SubCategoryResponse getSubCategoryById(Long id) {

        SubCategoryEntity sc = subCategoryRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found with id: " + id));

        return mapToResponse(sc);
    }

    // GET ALL
    @Override
    public List<SubCategoryResponse> getAllSubCategories() {

        return subCategoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY CATEGORY NAME
    @Override
    public List<SubCategoryResponse> getSubCategoriesByCategoryName(String categoryName) {

        return subCategoryRepository.findByCategoryCategoryName(categoryName)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // UPDATE
    @Override
    public SubCategoryResponse updateSubCategory(Long id, SubCategoryRequest request) {

        SubCategoryEntity sc = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        sc.setSubCategoryName(request.getSubCategoryName());
        sc.setSubCategoryDescription(request.getSubCategoryDescription());

        if (request.getCategoryId() != null) {
            CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            sc.setCategory(category);
        }

        SubCategoryEntity updated = subCategoryRepository.save(sc);

        return mapToResponse(updated);
    }

    // DELETE
    @Override
    public SubCategoryDeleteResponse deleteSubCategory(Long id) {

        SubCategoryEntity sc = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found with id: " + id));

        subCategoryRepository.delete(sc);

        SubCategoryDeleteResponse response = new SubCategoryDeleteResponse();
        response.setSubCategoryId(id);
        response.setMessage("SubCategory deleted successfully");

        return response;
    }

    // GET BY NAME
    @Override
    public SubCategoryResponse getSubCategoryByName(String subCategoryName) {

        SubCategoryEntity subCategory = subCategoryRepository
                .findBySubCategoryName(subCategoryName)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        return mapToResponse(subCategory);
    }

    // MAPPER
    private SubCategoryResponse mapToResponse(SubCategoryEntity sc) {

        SubCategoryResponse response = new SubCategoryResponse();

        response.setSubCategoryId(sc.getSubCategoryId());
        response.setSubCategoryName(sc.getSubCategoryName());
        response.setSubCategoryDescription(sc.getSubCategoryDescription());

        // ✅ Enum → String FIX
        response.setStatus(sc.getStatus().name());

        if (sc.getCategory() != null) {
            response.setCategoryId(sc.getCategory().getCategoryId());
            response.setCategoryName(sc.getCategory().getCategoryName());
        }

        return response;
    }
}