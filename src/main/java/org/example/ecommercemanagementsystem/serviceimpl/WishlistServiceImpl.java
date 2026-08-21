package org.example.ecommercemanagementsystem.serviceimpl;

import org.example.ecommercemanagementsystem.dto.WishlistResponse;
import org.example.ecommercemanagementsystem.entity.ProductEntity;
import org.example.ecommercemanagementsystem.entity.UserEntity;
import org.example.ecommercemanagementsystem.entity.WishlistEntity;
import org.example.ecommercemanagementsystem.entity.WishlistItemEntity;
import org.example.ecommercemanagementsystem.repository.ProductRepository;
import org.example.ecommercemanagementsystem.repository.UserRepository;
import org.example.ecommercemanagementsystem.repository.WishlistItemRepository;
import org.example.ecommercemanagementsystem.repository.WishlistRepository;
import org.example.ecommercemanagementsystem.service.WishlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(String email) {

        UserEntity user = findUserByEmail(email);

        WishlistEntity wishlist = wishlistRepository
                .findByUser(user)
                .orElse(null);

        if (wishlist == null) {
            return new WishlistResponse(
                    null,
                    "Wishlist is empty",
                    List.of()
            );
        }

        List<Long> productIds = wishlist.getItems()
                .stream()
                .map(item -> item.getProduct().getProductId())
                .toList();

        return new WishlistResponse(
                wishlist.getWishlistId(),
                "Wishlist retrieved successfully",
                productIds
        );
    }

    @Override
    public WishlistResponse addToWishlist(
            String email,
            Long productId
    ) {

        UserEntity user = findUserByEmail(email);

        ProductEntity product = findProductById(productId);

        WishlistEntity wishlist = wishlistRepository
                .findByUser(user)
                .orElseGet(() -> {

                    WishlistEntity newWishlist = new WishlistEntity();
                    newWishlist.setUser(user);

                    return wishlistRepository.save(newWishlist);
                });

        if (wishlistItemRepository
                .existsByWishlistAndProduct(wishlist, product)) {

            return buildResponse(
                    wishlist,
                    "Product is already in wishlist"
            );
        }

        WishlistItemEntity item = new WishlistItemEntity();
        item.setWishlist(wishlist);
        item.setProduct(product);
        item.setCreatedAt(LocalDateTime.now()); // Explicitly sets the date here

        wishlist.getItems().add(item);

        wishlistItemRepository.save(item);

        return buildResponse(
                wishlist,
                "Product added to wishlist successfully"
        );
    }

    @Override
    public WishlistResponse removeFromWishlist(
            String email,
            Long productId
    ) {

        UserEntity user = findUserByEmail(email);

        WishlistEntity wishlist = wishlistRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wishlist not found")
                );

        ProductEntity product = findProductById(productId);

        if (!wishlistItemRepository
                .existsByWishlistAndProduct(wishlist, product)) {

            return buildResponse(
                    wishlist,
                    "Product is not in wishlist"
            );
        }

        wishlistItemRepository.deleteByWishlistAndProduct(
                wishlist,
                product
        );

        wishlist.getItems().removeIf(
                item -> item.getProduct()
                        .getProductId()
                        .equals(productId)
        );

        return buildResponse(
                wishlist,
                "Product removed from wishlist successfully"
        );
    }

    @Override
    public WishlistResponse clearWishlist(String email) {

        UserEntity user = findUserByEmail(email);

        WishlistEntity wishlist = wishlistRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wishlist not found")
                );

        wishlistItemRepository.deleteByWishlist(wishlist);

        wishlist.getItems().clear();

        return buildResponse(
                wishlist,
                "Wishlist cleared successfully"
        );
    }

    private UserEntity findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );
    }

    private ProductEntity findProductById(Long productId) {

        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + productId
                        )
                );
    }

    private WishlistResponse buildResponse(
            WishlistEntity wishlist,
            String message
    ) {

        List<Long> productIds = wishlist.getItems()
                .stream()
                .map(item -> item.getProduct().getProductId())
                .toList();

        return new WishlistResponse(
                wishlist.getWishlistId(),
                message,
                productIds
        );
    }
}