package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.SubCategoryDeleteResponse;
import org.example.ecommercemanagementsystem.dto.SubCategoryRequest;
import org.example.ecommercemanagementsystem.dto.SubCategoryResponse;
import org.example.ecommercemanagementsystem.service.SubCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
@RequiredArgsConstructor
public class SubCategoryController {

    private final SubCategoryService subCategoryService;


    // ============================================================
    // CREATE
    // ============================================================

    @PostMapping
    public ResponseEntity<SubCategoryResponse> createSubCategory(
            @RequestBody SubCategoryRequest request) {

        return new ResponseEntity<>(
                subCategoryService.createSubCategory(request),
                HttpStatus.CREATED
        );
    }


    // ============================================================
    // GET BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<SubCategoryResponse> getSubCategoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                subCategoryService.getSubCategoryById(id)
        );
    }


    // ============================================================
    // GET ALL
    // ============================================================

    @GetMapping
    public ResponseEntity<List<SubCategoryResponse>>
    getAllSubCategories() {

        return ResponseEntity.ok(
                subCategoryService.getAllSubCategories()
        );
    }


    // ============================================================
    // UPDATE
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<SubCategoryResponse> updateSubCategory(
            @PathVariable Long id,
            @RequestBody SubCategoryRequest request) {

        return ResponseEntity.ok(
                subCategoryService.updateSubCategory(
                        id,
                        request
                )
        );
    }


    // ============================================================
    // GET BY NAME
    // ============================================================

    @GetMapping("/name/{subCategoryName}")
    public ResponseEntity<SubCategoryResponse>
    getSubCategoryByName(
            @PathVariable String subCategoryName) {

        return ResponseEntity.ok(
                subCategoryService.getSubCategoryByName(
                        subCategoryName
                )
        );
    }


    // ============================================================
    // DELETE
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<SubCategoryDeleteResponse>
    deleteSubCategory(@PathVariable Long id) {

        return ResponseEntity.ok(
                subCategoryService.deleteSubCategory(id)
        );
    }
}