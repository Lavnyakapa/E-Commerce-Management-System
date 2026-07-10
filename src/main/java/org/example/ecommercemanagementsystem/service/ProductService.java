package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.ProductDeleteResponse;
import org.example.ecommercemanagementsystem.dto.ProductRequest;
import org.example.ecommercemanagementsystem.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long productId);

    List<ProductResponse> getAllProducts();

    ProductResponse updateProduct(Long productId, ProductRequest request);

    ProductDeleteResponse deleteProduct(Long productId);
    List<ProductResponse> getProductByName(String name);
}