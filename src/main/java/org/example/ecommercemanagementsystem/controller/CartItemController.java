package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CartItemDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CartItemRequest;
import org.example.ecommercemanagementsystem.dto.CartItemResponse;
import org.example.ecommercemanagementsystem.service.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart-items")
@RequiredArgsConstructor
public class CartItemController {

    private final CartItemService cartItemService;

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
            @RequestBody CartItemRequest request) {

        return ResponseEntity.ok(cartItemService.addToCart(request));
    }

    @GetMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponse> getCartItemById(
            @PathVariable Long cartItemId) {

        return ResponseEntity.ok(cartItemService.getCartItemById(cartItemId));
    }

    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItemResponse>> getCartItems(
            @PathVariable Long cartId) {

        return ResponseEntity.ok(cartItemService.getCartItems(cartId));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody CartItemRequest request) {

        return ResponseEntity.ok(cartItemService.updateCartItem(cartItemId, request));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<CartItemDeleteResponse> removeCartItem(
            @PathVariable Long cartItemId) {

        CartItemDeleteResponse response = cartItemService.removeCartItem(cartItemId);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear/{cartId}")
    public ResponseEntity<String> clearCart(
            @PathVariable Long cartId) {

        cartItemService.clearCart(cartId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}