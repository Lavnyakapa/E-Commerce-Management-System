import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import "../styles/Wishlist.css";

const Wishlist: React.FC = () => {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

    // ==========================================
    // IMAGE URL RESOLVER (Matched with ProductCard)
    // ==========================================
    const getImageUrl = (product: any) => {
        const p = product as Record<string, unknown>;
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

        // If no images came from backend, map multiple defaults based on product type
        if (rawImages.length === 0) {
            const name = (product.productName || "").toLowerCase();
            if (name.includes("samsung") || name.includes("ultra") || name.includes("phone")) {
                rawImages.push("images/products/s25ultra-back.jpg");
            } else if (name.includes("maybelline") || name.includes("foundation") || name.includes("cosmetics")) {
                rawImages.push("images/cosmetics/fitme-foundation.jpg");
            } else if (name.includes("shirt") || name.includes("cotton") || name.includes("clothing")) {
                rawImages.push("images/products/mens-blue-shirt.jpg");
            }
        }

        const image = rawImages[0];
        if (!image) {
            return "/placeholder.png";
        }

        if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
            return image;
        }

        const cleanPath = image.startsWith("/") ? image : `/${image}`;
        return `http://localhost:8080${cleanPath}`;
    };

    // ==========================================
    // EMPTY STATE
    // ==========================================
    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-empty">
                    <Heart size={70} strokeWidth={1.5} />
                    <h2>Your Wishlist is Empty</h2>
                    <p>Save products you love and find them here later.</p>
                    <button onClick={() => navigate("/products")}>
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // FILLED STATE
    // ==========================================
    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <div>
                    <h1>My Wishlist</h1>
                    <p>
                        {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
                    </p>
                </div>

                <button className="clear-wishlist-button" onClick={clearWishlist}>
                    Clear Wishlist
                </button>
            </div>

            <div className="wishlist-grid">
                {wishlist.map((product) => {
                    const price =
                        product.variants && product.variants.length > 0
                            ? product.variants[0].price
                            : 0;

                    return (
                        <div className="wishlist-card" key={product.productId}>
                            <div className="wishlist-image">
                                <img
                                    src={getImageUrl(product)}
                                    alt={product.productName}
                                    onError={(event) => {
                                        const imgElement = event.currentTarget;
                                        if (!imgElement.src.endsWith("/placeholder.png")) {
                                            imgElement.src = "/placeholder.png";
                                        }
                                    }}
                                />
                            </div>

                            <div className="wishlist-details">
                                {product.brand && (
                                    <span className="wishlist-brand">{product.brand}</span>
                                )}

                                <h3>{product.productName}</h3>

                                <p className="wishlist-price">
                                    ${price.toFixed(2)}
                                </p>

                                <button
                                    className="remove-wishlist-button"
                                    onClick={() => removeFromWishlist(product.productId)}
                                >
                                    <Trash2 size={17} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wishlist;