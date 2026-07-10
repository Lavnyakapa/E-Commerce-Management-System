package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.CartDeleteResponse;
import org.example.ecommercemanagementsystem.dto.CartItemResponse;
import org.example.ecommercemanagementsystem.dto.CartRequest;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    // ---------------- CREATE CART ----------------
    @Override
    public CartResponse createCart(CartRequest request) {

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartEntity cart = new CartEntity();
        cart.setUser(user);
        cart.setCartItems(new ArrayList<>());

        cart = cartRepository.save(cart);

        return mapToResponse(cart);
    }

    // ---------------- GET BY ID ----------------
    @Override
    public CartResponse getCartById(Long cartId) {

        CartEntity cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToResponse(cart);
    }

    // ---------------- GET BY USER ----------------
    @Override
    public CartResponse getCartByUserId(Long userId) {

        CartEntity cart = cartRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToResponse(cart);
    }

    // ---------------- GET ALL ----------------
    @Override
    public List<CartResponse> getAllCarts() {

        return cartRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ---------------- DELETE CART ----------------
    @Override
    public CartDeleteResponse deleteCart(Long cartId) {

        CartEntity cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartRepository.delete(cart);

        return CartDeleteResponse.builder()
                .cartId(cartId)
                .message("Cart deleted successfully")
                .build();
    }

    // ---------------- ADD ITEM ----------------
    @Override
    public CartResponse addItemToCart(Long userId, Long variantId, Integer quantity) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductVariantEntity variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        CartEntity cart = cartRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity();
                    newCart.setUser(user);
                    newCart.setCartItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });

        for (CartItemEntity item : cart.getCartItems()) {
            if (item.getProductVariant().getVariantId().equals(variantId)) {
                item.setQuantity(item.getQuantity() + quantity);
                cartRepository.save(cart);
                return mapToResponse(cart);
            }
        }

        CartItemEntity newItem = new CartItemEntity();
        newItem.setCart(cart);
        newItem.setProductVariant(variant);
        newItem.setQuantity(quantity);

        cart.getCartItems().add(newItem);

        cartRepository.save(cart);

        return mapToResponse(cart);
    }
    // ---------------- UPDATE ITEM ----------------
    @Override
    public CartResponse updateCartItem(Long cartItemId, Integer quantity) {

        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return mapToResponse(item.getCart());
    }

    // ---------------- REMOVE ITEM ----------------
    @Override
    public CartResponse removeCartItem(Long cartItemId) {

        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        CartEntity cart = item.getCart();

        cart.getCartItems().remove(item);

        cartItemRepository.delete(item);

        return mapToResponse(cart);
    }

    // ---------------- CLEAR CART ----------------
    @Override
    public void clearCart(Long userId) {

        CartEntity cart = cartRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteAll(cart.getCartItems());

        cart.getCartItems().clear();

        cartRepository.save(cart);
    }

    // ---------------- MAPPER ----------------
    private CartResponse mapToResponse(CartEntity cart) {

        CartResponse response = new CartResponse();

        // Cart Details
        response.setCartId(cart.getCartId());
        response.setCreatedAt(cart.getCreatedAt());
        response.setUpdatedAt(cart.getUpdatedAt());

        // User Details
        if (cart.getUser() != null) {
            response.setUserId(cart.getUser().getUserId());
            response.setFirstName(cart.getUser().getFirstName());
            response.setLastName(cart.getUser().getLastName());
            response.setEmail(cart.getUser().getEmail());
        }

        // Cart Items
        List<CartItemResponse> items = cart.getCartItems()
                .stream()
                .map(item -> {
                    CartItemResponse dto = new CartItemResponse();

                    dto.setCartItemId(item.getCartItemId());
                    dto.setVariantId(item.getProductVariant().getVariantId());
                    dto.setQuantity(item.getQuantity());

                    return dto;
                })
                .collect(Collectors.toList());

        response.setItems(items);

        return response;
    }
}