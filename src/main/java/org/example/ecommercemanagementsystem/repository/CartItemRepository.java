package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.CartEntity;
import org.example.ecommercemanagementsystem.entity.CartItemEntity;
import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    Optional<CartItemEntity> findByCartAndProductVariant(
            CartEntity cart,
            ProductVariantEntity productVariant
    );

    List<CartItemEntity> findByCart(CartEntity cart);

    void deleteByCart(CartEntity cart);
}