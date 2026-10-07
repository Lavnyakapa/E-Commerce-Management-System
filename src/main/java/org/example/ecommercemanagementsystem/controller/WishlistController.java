package org.example.ecommercemanagementsystem.controller;

import org.example.ecommercemanagementsystem.dto.WishlistResponse;
import org.example.ecommercemanagementsystem.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(
                wishlistService.getWishlist(email)
        );
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistResponse> addToWishlist(
            @RequestParam String email,
            @RequestParam Long productId
    ) {
        return ResponseEntity.ok(
                wishlistService.addToWishlist(
                        email,
                        productId
                )
        );
    }

    @DeleteMapping("/remove")
    public ResponseEntity<WishlistResponse> removeFromWishlist(
            @RequestParam String email,
            @RequestParam Long productId
    ) {
        return ResponseEntity.ok(
                wishlistService.removeFromWishlist(
                        email,
                        productId
                )
        );
    }

    @DeleteMapping("/clear")
    public ResponseEntity<WishlistResponse> clearWishlist(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(
                wishlistService.clearWishlist(email)
        );
    }
}