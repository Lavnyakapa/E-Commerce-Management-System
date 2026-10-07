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

    // ==========================================
    // ADD PRODUCT TO CART
    // ==========================================
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam Long variantId,
            @RequestParam(defaultValue = "1") Integer quantity
    ) {

        System.out.println("======================================");
        System.out.println("ADD TO CART CONTROLLER CALLED");
        System.out.println("Variant ID : " + variantId);
        System.out.println("Quantity   : " + quantity);
        System.out.println("======================================");

        CartResponse response =
                cartService.addToCart(variantId, quantity);

        System.out.println("ADD TO CART SUCCESS");
        System.out.println("======================================");

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // GET MY CART
    // ==========================================
    @GetMapping
    public ResponseEntity<CartResponse> getMyCart() {

        System.out.println("GET CART CONTROLLER CALLED");

        CartResponse response =
                cartService.getMyCart();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // UPDATE CART ITEM QUANTITY
    // ==========================================
    @PatchMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity
    ) {

        System.out.println("UPDATE CART CONTROLLER CALLED");
        System.out.println("Cart Item ID : " + cartItemId);
        System.out.println("Quantity     : " + quantity);

        CartResponse response =
                cartService.updateQuantity(
                        cartItemId,
                        quantity
                );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // REMOVE CART ITEM
    // ==========================================
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable Long cartItemId
    ) {

        System.out.println("REMOVE CART ITEM CONTROLLER CALLED");
        System.out.println("Cart Item ID : " + cartItemId);

        CartResponse response =
                cartService.removeFromCart(cartItemId);

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // CLEAR CART
    // ==========================================
    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart() {

        System.out.println("CLEAR CART CONTROLLER CALLED");

        CartResponse response =
                cartService.clearCart();

        return ResponseEntity.ok(response);
    }
}