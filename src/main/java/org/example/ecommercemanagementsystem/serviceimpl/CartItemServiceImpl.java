package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CartItemDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CartItemRequest;
import org.example.ecommercemanagementsystem.dto.CartItemResponse;
import org.example.ecommercemanagementsystem.entity.CartEntity;
import org.example.ecommercemanagementsystem.entity.CartItemEntity;
import org.example.ecommercemanagementsystem.entity.ProductVariantEntity;
import org.example.ecommercemanagementsystem.exception.CartItemNotFoundException;
import org.example.ecommercemanagementsystem.exception.CartNotFoundException;
import org.example.ecommercemanagementsystem.exception.InsufficientStockException;
import org.example.ecommercemanagementsystem.repository.CartItemRepository;
import org.example.ecommercemanagementsystem.repository.CartRepository;
import org.example.ecommercemanagementsystem.repository.ProductVariantRepository;
import org.example.ecommercemanagementsystem.service.CartItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    // ===================== ADD TO CART =====================
    @Override
    public CartItemResponse addToCart(CartItemRequest request) {

        CartEntity cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() ->
                        new CartNotFoundException("Cart not found with id : " + request.getCartId()));

        ProductVariantEntity variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() ->
                        new RuntimeException("Product Variant not found with id : " + request.getVariantId()));

        if (request.getQuantity() > variant.getStockQuantity()) {
            throw new InsufficientStockException(
                    "Only " + variant.getStockQuantity() + " items available in stock.");
        }

        CartItemEntity cartItem = cartItemRepository
                .findByCartAndProductVariant(cart, variant)
                .orElse(null);

        if (cartItem != null) {

            int updatedQty = cartItem.getQuantity() + request.getQuantity();

            if (updatedQty > variant.getStockQuantity()) {
                throw new InsufficientStockException("Cannot add more than available stock.");
            }

            cartItem.setQuantity(updatedQty);

        } else {

            cartItem = new CartItemEntity();
            cartItem.setCart(cart);
            cartItem.setProductVariant(variant);
            cartItem.setQuantity(request.getQuantity());
        }

        cartItem = cartItemRepository.save(cartItem);

        return mapToResponse(cartItem);
    }

    // ===================== GET BY ID =====================
    @Override
    @Transactional(readOnly = true)
    public CartItemResponse getCartItemById(Long cartItemId) {

        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new CartItemNotFoundException("Cart Item not found with id : " + cartItemId));

        return mapToResponse(cartItem);
    }

    // ===================== GET CART ITEMS =====================
    @Override
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(Long cartId) {

        CartEntity cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new CartNotFoundException("Cart not found with id : " + cartId));

        return cartItemRepository.findByCart(cart)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ===================== UPDATE CART ITEM =====================
    @Override
    public CartItemResponse updateCartItem(Long cartItemId, CartItemRequest request) {

        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new CartItemNotFoundException("Cart Item not found with id : " + cartItemId));

        ProductVariantEntity variant = cartItem.getProductVariant();

        if (request.getQuantity() > variant.getStockQuantity()) {
            throw new InsufficientStockException(
                    "Only " + variant.getStockQuantity() + " items available in stock.");
        }

        cartItem.setQuantity(request.getQuantity());

        return mapToResponse(cartItemRepository.save(cartItem));
    }

    // ===================== REMOVE ITEM =====================
    @Override
    public CartItemDeleteResponse removeCartItem(Long cartItemId) {

        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new CartItemNotFoundException("Cart Item not found with id : " + cartItemId));

        cartItemRepository.delete(cartItem);

        return CartItemDeleteResponse.builder()
                .cartItemId(cartItemId)
                .message("Cart item deleted successfully")
                .build();
    }

    // ===================== CLEAR CART =====================
    @Override
    public void clearCart(Long cartId) {

        CartEntity cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new CartNotFoundException("Cart not found with id : " + cartId));

        cartItemRepository.deleteByCart(cart);
    }

    // ===================== MAPPER =====================
    private CartItemResponse mapToResponse(CartItemEntity cartItem) {

        ProductVariantEntity variant = cartItem.getProductVariant();

        double totalPrice = variant.getPrice() * cartItem.getQuantity();

        return CartItemResponse.builder()
                .cartItemId(cartItem.getCartItemId())
                .cartId(cartItem.getCart().getCartId())
                .variantId(variant.getVariantId())
                .productName(variant.getProduct().getProductName())
                .sku(variant.getSku())
                .color(variant.getColor())
                .size(variant.getSize())
                .price(variant.getPrice())
                .quantity(cartItem.getQuantity())
                .stockQuantity(variant.getStockQuantity())
                .totalPrice(totalPrice)
                .build();
    }
}