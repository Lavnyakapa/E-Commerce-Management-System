package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CartResponse;
import org.example.ecommercemanagementsystem.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam Long variantId,
            @RequestParam(defaultValue = "1") Integer quantity
    ) {

        return ResponseEntity.ok(
                cartService.addToCart(
                        variantId,
                        quantity
                )
        );
    }

    @GetMapping
    public ResponseEntity<CartResponse> getMyCart() {

        return ResponseEntity.ok(
                cartService.getMyCart()
        );
    }

    @PatchMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity
    ) {

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        cartItemId,
                        quantity
                )
        );
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long cartItemId
    ) {

        return ResponseEntity.ok(
                cartService.removeFromCart(
                        cartItemId
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart() {

        return ResponseEntity.ok(
                cartService.clearCart()
        );
    }
}