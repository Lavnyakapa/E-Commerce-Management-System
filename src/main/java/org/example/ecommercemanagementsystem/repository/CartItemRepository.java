package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.CartEntity;
import org.example.ecommercemanagementsystem.entity.CartItemEntity;
import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    // Get all items of a cart
    List<CartItemEntity> findByCart(CartEntity cart);

    // Check whether a product variant already exists in the cart
    Optional<CartItemEntity> findByCartAndProductVariant(
            CartEntity cart,
            ProductVariantEntity productVariant);

    // Remove all items from a cart
    void deleteByCart(CartEntity cart);

    // Get total number of items in a cart
    long countByCart(CartEntity cart);

    // Check if a variant already exists in a cart
    boolean existsByCartAndProductVariant(
            CartEntity cart,
            ProductVariantEntity productVariant);
}