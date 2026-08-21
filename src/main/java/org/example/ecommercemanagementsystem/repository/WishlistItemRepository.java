package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.WishlistEntity;
import org.example.ecommercemanagementsystem.entity.WishlistItemEntity;
import org.example.ecommercemanagementsystem.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistItemRepository
        extends JpaRepository<WishlistItemEntity, Long> {

    Optional<WishlistItemEntity> findByWishlistAndProduct(
            WishlistEntity wishlist,
            ProductEntity product
    );

    boolean existsByWishlistAndProduct(
            WishlistEntity wishlist,
            ProductEntity product
    );

    void deleteByWishlistAndProduct(
            WishlistEntity wishlist,
            ProductEntity product
    );

    void deleteByWishlist(WishlistEntity wishlist);
}