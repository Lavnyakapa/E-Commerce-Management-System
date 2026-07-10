package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.CartDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CartRequest;
import org.example.ecommercemanagementsystem.dto.CartResponse;
import org.example.ecommercemanagementsystem.dto.CartDeleteResponse;
import java.util.List;

public interface CartService {

    CartResponse createCart(CartRequest request);

    CartResponse getCartById(Long cartId);

    CartResponse getCartByUserId(Long userId);

    List<CartResponse> getAllCarts();

    CartDeleteResponse deleteCart(Long cartId);

    // 🔥 ADD THESE MISSING METHODS
    CartResponse addItemToCart(Long userId, Long variantId, Integer quantity);

    CartResponse updateCartItem(Long cartItemId, Integer quantity);

    CartResponse removeCartItem(Long cartItemId);

    void clearCart(Long userId);
}