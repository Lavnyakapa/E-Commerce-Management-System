package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.ProductResponse;
import org.example.ecommercemanagementsystem.dto.StockUpdateRequest;
import org.example.ecommercemanagementsystem.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getInventory() {

        return ResponseEntity.ok(
                inventoryService.getInventory()
        );
    }

    @PutMapping("/variant/{variantId}/stock")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable Long variantId,
            @RequestBody StockUpdateRequest request) {

        return ResponseEntity.ok(
                inventoryService.updateStock(
                        variantId,
                        request
                )
        );
    }
}