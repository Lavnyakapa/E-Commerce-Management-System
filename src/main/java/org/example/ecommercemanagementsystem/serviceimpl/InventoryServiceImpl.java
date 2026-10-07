package org.example.ecommercemanagementsystem.serviceimpl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.ProductResponse;
import org.example.ecommercemanagementsystem.dto.ProductVariantResponse;
import org.example.ecommercemanagementsystem.dto.StockUpdateRequest;
import org.example.ecommercemanagementsystem.entity.ProductEntity;
import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.example.ecommercemanagementsystem.exception.ProductNotFoundException;
import org.example.ecommercemanagementsystem.repository.ProductRepository;
import org.example.ecommercemanagementsystem.repository.ProductVariantRepository;
import org.example.ecommercemanagementsystem.service.InventoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    // =========================================================
    // GET INVENTORY
    // =========================================================

    @Override
    public List<ProductResponse> getInventory() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // UPDATE STOCK
    // =========================================================

    @Override
    public ProductResponse updateStock(
            Long variantId,
            StockUpdateRequest request) {

        ProductVariantEntity variant =
                productVariantRepository.findById(variantId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product variant not found with id: "
                                                + variantId
                                )
                        );

        if (request.getStockQuantity() == null) {
            throw new IllegalArgumentException(
                    "Stock quantity cannot be null"
            );
        }

        if (request.getStockQuantity() < 0) {
            throw new IllegalArgumentException(
                    "Stock quantity cannot be negative"
            );
        }

        variant.setStockQuantity(
                request.getStockQuantity()
        );

        productVariantRepository.save(variant);

        ProductEntity product = variant.getProduct();

        if (product == null) {
            throw new ProductNotFoundException(
                    "Product not found for variant id: "
                            + variantId
            );
        }

        return mapToProductResponse(product);
    }

    // =========================================================
    // MAP PRODUCT TO RESPONSE
    // =========================================================

    private ProductResponse mapToProductResponse(
            ProductEntity product) {

        ProductResponse response =
                new ProductResponse();

        response.setProductId(
                product.getProductId()
        );

        response.setProductName(
                product.getProductName()
        );

        response.setDescription(
                product.getDescription()
        );

        response.setBrand(
                product.getBrand()
        );

        if (product.getStatus() != null) {
            response.setStatus(
                    product.getStatus().name()
            );
        }

        if (product.getSubCategory() != null) {
            response.setSubCategoryId(
                    product.getSubCategory()
                            .getSubCategoryId()
            );
        }

        response.setCreatedAt(
                product.getCreatedAt()
        );

        response.setUpdatedAt(
                product.getUpdatedAt()
        );

        // =====================================================
        // IMAGES
        // =====================================================

        if (product.getImages() != null) {

            response.setImageUrls(
                    product.getImages()
                            .stream()
                            .map(image ->
                                    image.getImageUrl()
                            )
                            .collect(Collectors.toList())
            );

        } else {

            response.setImageUrls(
                    List.of()
            );
        }

        // =====================================================
        // VARIANTS
        // =====================================================

        if (product.getVariants() != null) {

            List<ProductVariantResponse>
                    variants =
                    product.getVariants()
                            .stream()
                            .map(variant -> {

                                ProductVariantResponse
                                        variantResponse =
                                        new ProductVariantResponse();

                                variantResponse.setVariantId(
                                        variant.getVariantId()
                                );

                                variantResponse.setSku(
                                        variant.getSku()
                                );

                                variantResponse.setColor(
                                        variant.getColor()
                                );

                                variantResponse.setSize(
                                        variant.getSize()
                                );

                                variantResponse.setPrice(
                                        variant.getPrice()
                                );

                                variantResponse.setStockQuantity(
                                        variant.getStockQuantity()
                                );

                                if (variant.getStatus() != null) {
                                    variantResponse.setStatus(
                                            variant.getStatus().name()
                                    );
                                }

                                return variantResponse;
                            })
                            .collect(Collectors.toList());

            response.setVariants(variants);

        } else {

            response.setVariants(List.of());
        }

        return response;
    }
}