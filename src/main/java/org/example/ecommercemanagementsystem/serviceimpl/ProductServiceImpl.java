package org.example.ecommercemanagementsystem.serviceimpl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.*;
import org.example.ecommercemanagementsystem.entity.*;
import org.example.ecommercemanagementsystem.exception.ProductNotFoundException;
import org.example.ecommercemanagementsystem.exception.SubCategoryNotFoundException;
import org.example.ecommercemanagementsystem.repository.ProductRepository;
import org.example.ecommercemanagementsystem.repository.ProductVariantRepository;
import org.example.ecommercemanagementsystem.repository.SubCategoryRepository;
import org.example.ecommercemanagementsystem.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        SubCategoryEntity subCategory =
                subCategoryRepository.findById(request.getSubCategoryId())
                        .orElseThrow(() ->
                                new SubCategoryNotFoundException(
                                        "Sub Category not found with id: " + request.getSubCategoryId()));

        ProductEntity product = new ProductEntity();

        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setStatus(ProductStatus.ACTIVE);
        product.setSubCategory(subCategory);

        // Variants
        if (request.getVariants() != null) {
            for (ProductVariantRequest variantRequest : request.getVariants()) {

                if (productVariantRepository.existsBySku(variantRequest.getSku())) {
                    throw new RuntimeException(
                            "SKU already exists: " + variantRequest.getSku());
                }

                ProductVariantEntity variant = new ProductVariantEntity();
                variant.setSku(variantRequest.getSku());
                variant.setColor(variantRequest.getColor());
                variant.setSize(variantRequest.getSize());
                variant.setPrice(variantRequest.getPrice());
                variant.setStockQuantity(variantRequest.getStockQuantity());
                variant.setStatus(ProductStatus.ACTIVE);

                variant.setProduct(product);
                product.getVariants().add(variant);
            }
        }

        // Images
        if (request.getImageUrls() != null) {
            int order = 1;

            for (String imageUrl : request.getImageUrls()) {
                ProductImageEntity image = new ProductImageEntity();
                image.setImageUrl(imageUrl);
                image.setDisplayOrder(order++);
                image.setProduct(product);

                product.getImages().add(image);
            }
        }

        ProductEntity savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse getProductById(Long productId) {

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: " + productId));

        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getProductByName(String name) {

        List<ProductEntity> products =
                productRepository.findByProductNameContainingIgnoreCase(name);

        if (products.isEmpty()) {
            throw new ProductNotFoundException(
                    "No products found with name : " + name);
        }

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long productId, ProductRequest request) {

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: " + productId));

        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());

        ProductEntity updated = productRepository.save(product);

        return mapToResponse(updated);
    }

    @Override
    public ProductDeleteResponse deleteProduct(Long productId) {

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: " + productId));

        productRepository.delete(product);

        return new ProductDeleteResponse(
                productId,
                "Product Deleted Successfully"
        );
    }

    private ProductResponse mapToResponse(ProductEntity product) {

        ProductResponse response = new ProductResponse();

        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setBrand(product.getBrand());

        if (product.getStatus() != null) {
            response.setStatus(product.getStatus().name());
        }

        if (product.getSubCategory() != null) {
            response.setSubCategoryId(product.getSubCategory().getSubCategoryId());
        }

        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        response.setImageUrls(
                product.getImages()
                        .stream()
                        .map(ProductImageEntity::getImageUrl)
                        .collect(Collectors.toList())
        );

        return response;
    }
}