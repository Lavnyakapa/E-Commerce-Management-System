package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository
        extends JpaRepository<ProductVariantEntity, Long> {

    boolean existsBySku(String sku);
}