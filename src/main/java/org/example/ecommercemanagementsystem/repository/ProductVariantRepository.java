package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductVariantRepository
        extends JpaRepository<ProductVariantEntity, Long> {

    boolean existsBySku(String sku);

    Optional<ProductVariantEntity> findBySku(String sku);
}