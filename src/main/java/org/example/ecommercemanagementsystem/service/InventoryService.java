package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.ProductResponse;
import org.example.ecommercemanagementsystem.dto.StockUpdateRequest;

import java.util.List;

public interface InventoryService {

    List<ProductResponse> getInventory();

    ProductResponse updateStock(
            Long variantId,
            StockUpdateRequest request
    );
}