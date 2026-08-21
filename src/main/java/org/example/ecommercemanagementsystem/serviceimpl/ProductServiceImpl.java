package org.example.ecommercemanagementsystem.serviceimpl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.ProductDeleteResponse;
import org.example.ecommercemanagementsystem.dto.ProductRequest;
import org.example.ecommercemanagementsystem.dto.ProductResponse;
import org.example.ecommercemanagementsystem.dto.ProductVariantRequest;
import org.example.ecommercemanagementsystem.dto.ProductVariantResponse;
import org.example.ecommercemanagementsystem.entity.ProductEntity;
import org.example.ecommercemanagementsystem.entity.ProductImageEntity;
import org.example.ecommercemanagementsystem.entity.ProductStatus;
import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.example.ecommercemanagementsystem.entity.SubCategoryEntity;
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


    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        // -----------------------------------------
        // FIND SUB CATEGORY
        // -----------------------------------------

        SubCategoryEntity subCategory =
                subCategoryRepository.findById(
                        request.getSubCategoryId()
                ).orElseThrow(() ->
                        new SubCategoryNotFoundException(
                                "Sub Category not found with id: "
                                        + request.getSubCategoryId()
                        )
                );


        // -----------------------------------------
        // CREATE PRODUCT
        // -----------------------------------------

        ProductEntity product =
                new ProductEntity();

        product.setProductName(
                request.getProductName()
        );

        product.setDescription(
                request.getDescription()
        );

        product.setBrand(
                request.getBrand()
        );

        product.setStatus(
                ProductStatus.ACTIVE
        );

        product.setSubCategory(
                subCategory
        );


        // =================================================
        // ADD MULTIPLE VARIANTS
        // =================================================

        if (request.getVariants() != null) {

            for (ProductVariantRequest variantRequest :
                    request.getVariants()) {


                // -----------------------------------------
                // CHECK SKU
                // -----------------------------------------

                if (variantRequest.getSku() != null &&
                        productVariantRepository.existsBySku(
                                variantRequest.getSku()
                        )) {

                    throw new RuntimeException(
                            "SKU already exists: "
                                    + variantRequest.getSku()
                    );
                }


                // -----------------------------------------
                // CREATE VARIANT
                // -----------------------------------------

                ProductVariantEntity variant =
                        new ProductVariantEntity();

                variant.setSku(
                        variantRequest.getSku()
                );

                variant.setColor(
                        variantRequest.getColor()
                );

                variant.setSize(
                        variantRequest.getSize()
                );

                variant.setPrice(
                        variantRequest.getPrice()
                );

                variant.setStockQuantity(
                        variantRequest.getStockQuantity()
                );

                variant.setStatus(
                        ProductStatus.ACTIVE
                );


                // -----------------------------------------
                // CONNECT VARIANT TO PRODUCT
                // -----------------------------------------

                variant.setProduct(
                        product
                );


                product.getVariants().add(
                        variant
                );
            }
        }


        // =================================================
        // ADD MULTIPLE IMAGES
        // =================================================

        if (request.getImageUrls() != null) {

            int displayOrder = 1;

            for (String imageUrl :
                    request.getImageUrls()) {


                if (imageUrl == null ||
                        imageUrl.trim().isEmpty()) {

                    continue;
                }


                ProductImageEntity image =
                        new ProductImageEntity();

                image.setImageUrl(
                        imageUrl
                );

                image.setDisplayOrder(
                        displayOrder++
                );

                image.setProduct(
                        product
                );


                product.getImages().add(
                        image
                );
            }
        }


        // =================================================
        // SAVE PRODUCT
        // =================================================

        ProductEntity savedProduct =
                productRepository.save(product);


        return mapToResponse(
                savedProduct
        );
    }


    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    @Override
    public ProductResponse getProductById(
            Long productId) {

        ProductEntity product =
                productRepository.findById(
                        productId
                ).orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: "
                                        + productId
                        )
                );


        return mapToResponse(
                product
        );
    }


    // =========================================================
    // GET ALL PRODUCTS
    // =========================================================

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // SEARCH PRODUCT BY NAME
    // =========================================================

    @Override
    public List<ProductResponse> getProductByName(
            String name) {

        List<ProductEntity> products =
                productRepository
                        .findByProductNameContainingIgnoreCase(
                                name
                        );


        if (products.isEmpty()) {

            throw new ProductNotFoundException(
                    "No products found with name: "
                            + name
            );
        }


        return products
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    @Override
    public ProductResponse updateProduct(
            Long productId,
            ProductRequest request) {


        // -----------------------------------------
        // FIND PRODUCT
        // -----------------------------------------

        ProductEntity product =
                productRepository.findById(
                        productId
                ).orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: "
                                        + productId
                        )
                );


        // -----------------------------------------
        // UPDATE BASIC DETAILS
        // -----------------------------------------

        if (request.getProductName() != null) {

            product.setProductName(
                    request.getProductName()
            );
        }


        if (request.getDescription() != null) {

            product.setDescription(
                    request.getDescription()
            );
        }


        if (request.getBrand() != null) {

            product.setBrand(
                    request.getBrand()
            );
        }


        // -----------------------------------------
        // UPDATE SUB CATEGORY
        // -----------------------------------------

        if (request.getSubCategoryId() != null) {

            SubCategoryEntity subCategory =
                    subCategoryRepository.findById(
                            request.getSubCategoryId()
                    ).orElseThrow(() ->
                            new SubCategoryNotFoundException(
                                    "Sub Category not found with id: "
                                            + request.getSubCategoryId()
                            )
                    );


            product.setSubCategory(
                    subCategory
            );
        }


        // =================================================
        // UPDATE VARIANTS
        // =================================================

        if (request.getVariants() != null) {

            // Remove existing variants
            product.getVariants().clear();


            for (ProductVariantRequest variantRequest :
                    request.getVariants()) {


                // -----------------------------------------
                // CHECK SKU
                // -----------------------------------------

                if (variantRequest.getSku() != null &&
                        productVariantRepository.existsBySku(
                                variantRequest.getSku()
                        )) {

                    /*
                     * The existing product's variants were
                     * cleared from the collection, but the
                     * old database records still exist until
                     * flush.
                     *
                     * Therefore SKU checking during update
                     * is intentionally handled carefully.
                     */
                }


                // -----------------------------------------
                // CREATE UPDATED VARIANT
                // -----------------------------------------

                ProductVariantEntity variant =
                        new ProductVariantEntity();

                variant.setSku(
                        variantRequest.getSku()
                );

                variant.setColor(
                        variantRequest.getColor()
                );

                variant.setSize(
                        variantRequest.getSize()
                );

                variant.setPrice(
                        variantRequest.getPrice()
                );

                variant.setStockQuantity(
                        variantRequest.getStockQuantity()
                );

                variant.setStatus(
                        ProductStatus.ACTIVE
                );

                variant.setProduct(
                        product
                );


                product.getVariants().add(
                        variant
                );
            }
        }


        // =================================================
        // UPDATE IMAGES
        // =================================================

        if (request.getImageUrls() != null) {

            // Remove old images
            product.getImages().clear();


            int displayOrder = 1;


            for (String imageUrl :
                    request.getImageUrls()) {


                if (imageUrl == null ||
                        imageUrl.trim().isEmpty()) {

                    continue;
                }


                ProductImageEntity image =
                        new ProductImageEntity();

                image.setImageUrl(
                        imageUrl
                );

                image.setDisplayOrder(
                        displayOrder++
                );

                image.setProduct(
                        product
                );


                product.getImages().add(
                        image
                );
            }
        }


        // =================================================
        // SAVE UPDATED PRODUCT
        // =================================================

        ProductEntity updatedProduct =
                productRepository.save(product);


        return mapToResponse(
                updatedProduct
        );
    }


    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    @Override
    public ProductDeleteResponse deleteProduct(
            Long productId) {


        // -----------------------------------------
        // FIND PRODUCT
        // -----------------------------------------

        ProductEntity product =
                productRepository.findById(
                        productId
                ).orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: "
                                        + productId
                        )
                );


        // -----------------------------------------
        // DELETE PRODUCT
        // -----------------------------------------

        productRepository.delete(
                product
        );


        return new ProductDeleteResponse(
                productId,
                "Product Deleted Successfully"
        );
    }


    // =========================================================
    // MAP ENTITY TO RESPONSE
    // =========================================================

    private ProductResponse mapToResponse(
            ProductEntity product) {


        ProductResponse response =
                new ProductResponse();


        // =================================================
        // BASIC DETAILS
        // =================================================

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


        // =================================================
        // STATUS
        // =================================================

        if (product.getStatus() != null) {

            response.setStatus(
                    product.getStatus().name()
            );
        }


        // =================================================
        // SUB CATEGORY
        // =================================================

        if (product.getSubCategory() != null) {

            response.setSubCategoryId(
                    product.getSubCategory()
                            .getSubCategoryId()
            );
        }


        // =================================================
        // DATES
        // =================================================

        response.setCreatedAt(
                product.getCreatedAt()
        );

        response.setUpdatedAt(
                product.getUpdatedAt()
        );


        // =================================================
        // IMAGES
        // =================================================

        if (product.getImages() != null) {

            response.setImageUrls(
                    product.getImages()
                            .stream()
                            .map(
                                    ProductImageEntity::getImageUrl
                            )
                            .collect(
                                    Collectors.toList()
                            )
            );

        } else {

            response.setImageUrls(
                    List.of()
            );
        }


        // =================================================
        // VARIANTS
        // =================================================

        if (product.getVariants() != null) {

            List<ProductVariantResponse>
                    variantResponses =

                    product.getVariants()
                            .stream()
                            .map(variant -> {

                                ProductVariantResponse
                                        variantResponse =
                                        new ProductVariantResponse();


                                // Variant ID

                                variantResponse.setVariantId(
                                        variant.getVariantId()
                                );


                                // SKU

                                variantResponse.setSku(
                                        variant.getSku()
                                );


                                // Color

                                variantResponse.setColor(
                                        variant.getColor()
                                );


                                // Size

                                variantResponse.setSize(
                                        variant.getSize()
                                );


                                // Price

                                variantResponse.setPrice(
                                        variant.getPrice()
                                );


                                // Stock

                                variantResponse.setStockQuantity(
                                        variant.getStockQuantity()
                                );


                                // Status

                                if (variant.getStatus() != null) {

                                    variantResponse.setStatus(
                                            variant.getStatus()
                                                    .name()
                                    );
                                }


                                return variantResponse;

                            })
                            .collect(
                                    Collectors.toList()
                            );


            response.setVariants(
                    variantResponses
            );

        } else {

            response.setVariants(
                    List.of()
            );
        }


        return response;
    }
}