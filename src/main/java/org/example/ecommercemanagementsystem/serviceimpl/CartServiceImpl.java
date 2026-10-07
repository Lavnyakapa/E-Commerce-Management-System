
package org.example.ecommercemanagementsystem.serviceimpl;

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

    // =========================================================
    // ADD TO CART
    // =========================================================
    @Override
    public CartResponse addToCart(
            Long variantId,
            Integer quantity
    ) {

        System.out.println("======================================");
        System.out.println("CART SERVICE ADD TO CART CALLED");
        System.out.println("Variant ID : " + variantId);
        System.out.println("Quantity   : " + quantity);
        System.out.println("======================================");

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        String email = getLoggedInEmail();

        System.out.println("Logged-in email: " + email);

        UserEntity user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: " + email
                                )
                        );

        System.out.println("User found. User ID: " + user.getUserId());

        ProductVariantEntity variant =
                productVariantRepository
                        .findById(variantId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product variant not found with id: "
                                                + variantId
                                )
                        );

        System.out.println(
                "Variant found. Variant ID: "
                        + variant.getVariantId()
        );

        if (variant.getStockQuantity() == null ||
                variant.getStockQuantity() <= 0) {

            throw new RuntimeException(
                    "Product is out of stock"
            );
        }

        System.out.println(
                "Available stock: "
                        + variant.getStockQuantity()
        );

        if (quantity > variant.getStockQuantity()) {
            throw new RuntimeException(
                    "Requested quantity exceeds available stock"
            );
        }

        CartEntity cart =
                cartRepository
                        .findByUserUserId(user.getUserId())
                        .orElseGet(() -> {

                            System.out.println(
                                    "Cart not found. Creating new cart."
                            );

                            CartEntity newCart =
                                    new CartEntity();

                            newCart.setUser(user);
                            newCart.setCartItems(
                                    new ArrayList<>()
                            );

                            CartEntity savedCart =
                                    cartRepository.save(newCart);

                            System.out.println(
                                    "New cart created. Cart ID: "
                                            + savedCart.getCartId()
                            );

                            return savedCart;
                        });

        System.out.println(
                "Using Cart ID: "
                        + cart.getCartId()
        );

        CartItemEntity cartItem =
                cartItemRepository
                        .findByCartAndProductVariant(
                                cart,
                                variant
                        )
                        .orElse(null);

        if (cartItem != null) {

            System.out.println(
                    "Existing cart item found. Cart Item ID: "
                            + cartItem.getCartItemId()
            );

            int newQuantity =
                    cartItem.getQuantity() + quantity;

            System.out.println(
                    "Old quantity: "
                            + cartItem.getQuantity()
            );

            System.out.println(
                    "New quantity: "
                            + newQuantity
            );

            if (newQuantity >
                    variant.getStockQuantity()) {

                throw new RuntimeException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem.setQuantity(newQuantity);

        } else {

            System.out.println(
                    "Cart item does not exist. Creating new cart item."
            );

            cartItem = new CartItemEntity();

            cartItem.setCart(cart);
            cartItem.setProductVariant(variant);
            cartItem.setQuantity(quantity);

            cart.getCartItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);

        System.out.println(
                "Cart item saved successfully. Cart Item ID: "
                        + cartItem.getCartItemId()
        );

        System.out.println(
                "BUILDING CART RESPONSE..."
        );

        CartResponse response =
                buildCartResponse(
                        cart,
                        "Product added to cart successfully"
                );

        System.out.println(
                "ADD TO CART SUCCESS"
        );

        System.out.println(
                "Cart ID: " + response.getCartId()
        );

        System.out.println(
                "Number of items: "
                        + response.getItems().size()
        );

        System.out.println("======================================");

        return response;
    }

    // =========================================================
    // GET MY CART
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public CartResponse getMyCart() {

        System.out.println("======================================");
        System.out.println("GET MY CART SERVICE CALLED");

        String email = getLoggedInEmail();

        System.out.println(
                "Logged-in email: " + email
        );

        UserEntity user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: "
                                                + email
                                )
                        );

        CartEntity cart =
                cartRepository
                        .findByUserUserId(user.getUserId())
                        .orElse(null);

        if (cart == null) {

            System.out.println(
                    "No cart found for user."
            );

            return new CartResponse(
                    null,
                    "Cart is empty",
                    new ArrayList<>(),
                    0.0
            );
        }

        System.out.println(
                "Cart found. Cart ID: "
                        + cart.getCartId()
        );

        return buildCartResponse(
                cart,
                "Cart fetched successfully"
        );
    }

    // =========================================================
    // UPDATE QUANTITY
    // =========================================================
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

        if (variant.getStockQuantity() == null ||
                quantity > variant.getStockQuantity()) {

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

    // =========================================================
    // REMOVE FROM CART
    // =========================================================
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

        cartItemRepository.delete(item);

        cart.getCartItems().remove(item);

        return buildCartResponse(
                cart,
                "Product removed from cart"
        );
    }

    // =========================================================
    // CLEAR CART
    // =========================================================
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

        cartItemRepository.deleteByCart(cart);

        cart.getCartItems().clear();

        return new CartResponse(
                cart.getCartId(),
                "Cart cleared successfully",
                new ArrayList<>(),
                0.0
        );
    }

    // =========================================================
    // GET LOGGED-IN EMAIL
    // =========================================================
    private String getLoggedInEmail() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        System.out.println("======================================");
        System.out.println("CURRENT AUTHENTICATED USER");
        System.out.println("Email/Username: " + email);
        System.out.println("======================================");

        return email;
    }

    // =========================================================
    // BUILD CART RESPONSE
    // =========================================================
    private CartResponse buildCartResponse(
            CartEntity cart,
            String message
    ) {

        List<CartItemEntity> cartItems =
                cartItemRepository.findByCart(cart);

        List<CartItemResponse> items =
                new ArrayList<>();

        double total = 0.0;

        for (CartItemEntity item : cartItems) {

            ProductVariantEntity variant =
                    item.getProductVariant();

            double price =
                    variant.getPrice() == null
                            ? 0.0
                            : variant.getPrice();

            int quantity =
                    item.getQuantity() == null
                            ? 0
                            : item.getQuantity();

            double subtotal =
                    price * quantity;

            CartItemResponse response =
                    new CartItemResponse();

            response.setCartItemId(
                    item.getCartItemId()
            );

            response.setCartId(
                    cart.getCartId()
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

            response.setSku(
                    variant.getSku()
            );

            response.setColor(
                    variant.getColor()
            );

            response.setSize(
                    variant.getSize()
            );

            response.setPrice(
                    price
            );

            response.setQuantity(
                    quantity
            );

            response.setStockQuantity(
                    variant.getStockQuantity()
            );

            response.setSubtotal(
                    subtotal
            );

            response.setTotalPrice(
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
