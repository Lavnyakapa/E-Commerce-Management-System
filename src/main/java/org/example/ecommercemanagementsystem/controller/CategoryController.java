package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CategoryDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CategoryRequest;
import org.example.ecommercemanagementsystem.dto.CategoryResponse;
import org.example.ecommercemanagementsystem.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request) {

        return ResponseEntity.ok(
                categoryService.createCategory(request)
        );
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(categoryId)
        );
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryRequest request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(categoryId, request)
        );
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<CategoryDeleteResponse> deleteCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                categoryService.deleteCategory(categoryId)
        );
    }
}