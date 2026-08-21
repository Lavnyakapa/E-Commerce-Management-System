package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.WishlistResponse;

public interface WishlistService {

    WishlistResponse getWishlist(String email);

    WishlistResponse addToWishlist(
            String email,
            Long productId
    );

    WishlistResponse removeFromWishlist(
            String email,
            Long productId
    );

    WishlistResponse clearWishlist(
            String email
    );
}