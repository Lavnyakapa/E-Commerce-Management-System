package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CartDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CartRequest;
import org.example.ecommercemanagementsystem.dto.CartResponse;
import org.example.ecommercemanagementsystem.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.ecommercemanagementsystem.dto.CartDeleteResponse;
import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 1. Create Cart
    @PostMapping
    public ResponseEntity<CartResponse> createCart(@RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.createCart(request));
    }

    // 2. Get Cart by ID
    @GetMapping("/{cartId}")
    public ResponseEntity<CartResponse> getCartById(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartService.getCartById(cartId));
    }

    // 3. Get Cart by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCartByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // 4. Get All Carts
    @GetMapping
    public ResponseEntity<List<CartResponse>> getAllCarts() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    // 5. Delete Cart
    @DeleteMapping("/{cartId}")
    public ResponseEntity<CartDeleteResponse> deleteCart(@PathVariable Long cartId) {
        return ResponseEntity.ok( cartService.deleteCart(cartId));
    }

    // 6. Add Item to Cart
    @PostMapping("/user/{userId}/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @PathVariable Long userId,
            @RequestParam Long variantId,
            @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(
                cartService.addItemToCart(userId, variantId, quantity)
        );
    }

    // 7. Update Cart Item Quantity
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(
                cartService.updateCartItem(cartItemId, quantity)
        );
    }

    // 8. Remove Cart Item
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long cartItemId
    ) {
        return ResponseEntity.ok(
                cartService.removeCartItem(cartItemId)
        );
    }

    // 9. Clear Cart by User
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}