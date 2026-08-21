package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.CartResponse;

public interface CartService {

    CartResponse addToCart(
            Long variantId,
            Integer quantity
    );

    CartResponse getMyCart();

    CartResponse updateQuantity(
            Long cartItemId,
            Integer quantity
    );

    CartResponse removeFromCart(
            Long cartItemId
    );

    CartResponse clearCart();
}