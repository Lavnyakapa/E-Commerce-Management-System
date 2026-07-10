package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.CartItemDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CartItemRequest;
import org.example.ecommercemanagementsystem.dto.CartItemResponse;

import java.util.List;

public interface CartItemService {

    // Add product to cart
    CartItemResponse addToCart(CartItemRequest request);

    // Get cart item by id
    CartItemResponse getCartItemById(Long cartItemId);

    // Get all items of a cart
    List<CartItemResponse> getCartItems(Long cartId);

    // Update quantity
    CartItemResponse updateCartItem(Long cartItemId,
                                    CartItemRequest request);

    // Remove one item from cart
    CartItemDeleteResponse removeCartItem(Long cartItemId);

    // Clear complete cart
    void clearCart(Long cartId);
}