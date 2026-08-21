package org.example.ecommercemanagementsystem.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CartItemResponse;
import org.example.ecommercemanagementsystem.dto.CartResponse;
import org.example.ecommercemanagementsystem.entity.CartEntity;
import org.example.ecommercemanagementsystem.entity.CartItemEntity;
import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.example.ecommercemanagementsystem.entity.UserEntity;
import org.example.ecommercemanagementsystem.repository.CartItemRepository;
import org.example.ecommercemanagementsystem.repository.CartRepository;
import org.example.ecommercemanagementsystem.repository.ProductVariantRepository;
import org.example.ecommercemanagementsystem.repository.UserRepository;
import org.example.ecommercemanagementsystem.service.CartService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public CartResponse addToCart(
            Long variantId,
            Integer quantity
    ) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        // Get logged-in username/email from JWT
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find user
        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // Find variant
        ProductVariantEntity variant =
                productVariantRepository
                        .findById(variantId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product variant not found"
                                )
                        );

        // Check stock
        if (variant.getStockQuantity() == null ||
                variant.getStockQuantity() <= 0) {

            throw new RuntimeException(
                    "Product is out of stock"
            );
        }

        // Get existing cart or create new cart
        CartEntity cart =
                cartRepository
                        .findByUserUserId(user.getUserId())
                        .orElseGet(() -> {

                            CartEntity newCart =
                                    new CartEntity();

                            newCart.setUser(user);

                            newCart.setCartItems(
                                    new ArrayList<>()
                            );

                            return cartRepository.save(newCart);
                        });

        // Check if variant already exists in cart
        CartItemEntity cartItem =
                cartItemRepository
                        .findByCartAndProductVariant(
                                cart,
                                variant
                        )
                        .orElse(null);

        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity() + quantity;

            // Prevent adding more than stock
            if (newQuantity >
                    variant.getStockQuantity()) {

                throw new RuntimeException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem.setQuantity(newQuantity);

        } else {

            if (quantity >
                    variant.getStockQuantity()) {

                throw new RuntimeException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem =
                    new CartItemEntity();

            cartItem.setCart(cart);
            cartItem.setProductVariant(variant);
            cartItem.setQuantity(quantity);

            cart.getCartItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);

        return buildCartResponse(
                cart,
                "Product added to cart successfully"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getMyCart() {

        String email = getLoggedInEmail();

        UserEntity user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        CartEntity cart =
                cartRepository
                        .findByUserUserId(user.getUserId())
                        .orElse(null);

        if (cart == null) {
            return new CartResponse(
                    null,
                    "Cart is empty",
                    new ArrayList<>(),
                    0.0
            );
        }

        return buildCartResponse(
                cart,
                "Cart fetched successfully"
        );
    }

    @Override
    public CartResponse updateQuantity(
            Long cartItemId,
            Integer quantity
    ) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        String email = getLoggedInEmail();

        UserEntity user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        CartItemEntity item =
                cartItemRepository
                        .findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        // Security check:
        // cart item must belong to logged-in user
        if (!item.getCart()
                .getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new RuntimeException(
                    "You cannot modify this cart item"
            );
        }

        ProductVariantEntity variant =
                item.getProductVariant();

        if (quantity >
                variant.getStockQuantity()) {

            throw new RuntimeException(
                    "Requested quantity exceeds available stock"
            );
        }

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return buildCartResponse(
                item.getCart(),
                "Cart quantity updated successfully"
        );
    }

    @Override
    public CartResponse removeFromCart(
            Long cartItemId
    ) {

        String email = getLoggedInEmail();

        UserEntity user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        CartItemEntity item =
                cartItemRepository
                        .findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        if (!item.getCart()
                .getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new RuntimeException(
                    "You cannot remove this cart item"
            );
        }

        CartEntity cart = item.getCart();

        cart.getCartItems().remove(item);

        cartItemRepository.delete(item);

        return buildCartResponse(
                cart,
                "Product removed from cart"
        );
    }

    @Override
    public CartResponse clearCart() {

        String email = getLoggedInEmail();

        UserEntity user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        CartEntity cart =
                cartRepository
                        .findByUserUserId(user.getUserId())
                        .orElse(null);

        if (cart == null) {
            return new CartResponse(
                    null,
                    "Cart is already empty",
                    new ArrayList<>(),
                    0.0
            );
        }

        cart.getCartItems().clear();

        cartRepository.save(cart);

        return new CartResponse(
                cart.getCartId(),
                "Cart cleared successfully",
                new ArrayList<>(),
                0.0
        );
    }

    private String getLoggedInEmail() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    private CartResponse buildCartResponse(
            CartEntity cart,
            String message
    ) {

        List<CartItemResponse> items =
                new ArrayList<>();

        double total = 0.0;

        for (CartItemEntity item :
                cart.getCartItems()) {

            ProductVariantEntity variant =
                    item.getProductVariant();

            double price =
                    variant.getPrice() == null
                            ? 0.0
                            : variant.getPrice();

            double subtotal =
                    price * item.getQuantity();

            CartItemResponse response =
                    new CartItemResponse();

            response.setCartItemId(
                    item.getCartItemId()
            );

            response.setVariantId(
                    variant.getVariantId()
            );

            response.setProductId(
                    variant.getProduct()
                            .getProductId()
            );

            response.setProductName(
                    variant.getProduct()
                            .getProductName()
            );

            response.setBrand(
                    variant.getProduct()
                            .getBrand()
            );

            response.setPrice(price);

            response.setQuantity(
                    item.getQuantity()
            );

            response.setSubtotal(
                    subtotal
            );

            items.add(response);

            total += subtotal;
        }

        return new CartResponse(
                cart.getCartId(),
                message,
                items,
                total
        );
    }
}