import React, {useState, useMemo} from "react";
import {Heart} from "lucide-react";
import {useWishlist} from "../context/WishlistContext";
import type {WishlistProduct} from "../context/WishlistContext";
import "../styles/ProductCard.css";

interface ProductCardProps {
    product: WishlistProduct;
    onAddToCart?: (product: WishlistProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({product, onAddToCart}) => {
    const {isInWishlist, toggleWishlist} = useWishlist();
    const inWishlist = isInWishlist(product.productId);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    // Memoize price calculation
    const price: number = useMemo(() => {
        return product.variants && product.variants.length > 0
            ? product.variants[0].price
            : 0;
    }, [product.variants]);

    // Gather all available images into a clean array
    const imageUrls = useMemo(() => {
        const p = product as unknown as Record<string, unknown>;
        const rawImages: string[] = [];

        // Check if backend provides an array of images
        if (Array.isArray(p.images)) {
            p.images.forEach((img) => {
                if (typeof img === "string" && img.trim().length > 0) rawImages.push(img.trim());
            });
        }

        // Check individual string image fields
        const singleFields = [product.imageUrl, product.imagePath, p.image, p.image_url, p.photo];
        singleFields.forEach((field) => {
            if (typeof field === "string" && field.trim().length > 0 && !rawImages.includes(field.trim())) {
                rawImages.push(field.trim());
            }
        });

        // If no images came from the backend, map multiple defaults based on product type
        if (rawImages.length === 0) {
            const name = (product.productName || "").toLowerCase();
            if (name.includes("samsung") || name.includes("ultra") || name.includes("phone")) {
                rawImages.push(
                    "images/products/s25ultra-back.jpg",
                    "images/products/s25ultra-front.jpg",
                    "images/products/s25ultra-side.jpg"
                );
            } else if (name.includes("maybelline") || name.includes("foundation") || name.includes("cosmetics")) {
                rawImages.push("images/cosmetics/fitme-foundation.jpg",
                    "images/cosmetics/fitme-foundation1.jpg");
            } else if (name.includes("shirt") || name.includes("cotton") || name.includes("clothing")) {
                rawImages.push("images/products/mens-blue-shirt.jpg",
                    "images/products/mens-blue-shirt_b.jpg");
            }
        }

        // Format paths into absolute URLs or keep relative path endpoints correctly
        return rawImages.map((img) => {
            if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
                return img;
            }
            const cleanPath = img.startsWith("/") ? img : `/${img}`;
            return `http://localhost:8080${cleanPath}`;
        });
    }, [product]);

    // Current active image to display
    const activeImageSrc = imageUrls[currentImageIndex] || "/placeholder.png";

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={activeImageSrc}
                    alt={product.productName}
                    className="product-image"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                    }}
                />

                <button
                    type="button"
                    className={`wishlist-btn ${inWishlist ? "active" : ""}`}
                    onClick={() => toggleWishlist(product)}
                >
                    <Heart fill={inWishlist ? "red" : "none"} color={inWishlist ? "red" : "currentColor"}/>
                </button>
            </div>

            {/* Thumbnail selector if multiple images exist */}
            {imageUrls.length > 1 && (
                <div className="product-thumbnails"
                     style={{display: "flex", gap: "6px", padding: "8px 12px", justifyContent: "center"}}>
                    {imageUrls.map((url, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentImageIndex(idx)}
                            style={{
                                border: currentImageIndex === idx ? "2px solid #007bff" : "1px solid #ccc",
                                padding: "2px",
                                background: "transparent",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            <img src={url} alt=""
                                 style={{width: "35px", height: "35px", objectFit: "cover", display: "block"}}/>
                        </button>
                    ))}
                </div>
            )}

            <div className="product-info">
                <h3 className="product-name">{product.productName}</h3>
                {product.brand && (
                    <p className="product-brand">{product.brand}</p>
                )}
                <p className="product-price">${price.toFixed(2)}</p>
                {onAddToCart && (
                    <button
                        type="button"
                        className="add-to-cart-btn"
                        onClick={() => onAddToCart(product)}
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;