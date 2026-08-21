
import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { productService } from "../../services/productService";
import type { WishlistProduct } from "../../context/WishlistContext";
import "/src/styles/Products.css";

const Products: React.FC = () => {
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);
                setError("Failed to load products. Please check if backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (product: WishlistProduct) => {

        try {

            if (!product.variants || product.variants.length === 0) {
                alert("No variant available for this product.");
                return;
            }

            const variantId = product.variants[0].variantId;

            console.log("Product ID:", product.productId);
            console.log("Variant ID:", variantId);

            if (!variantId) {
                alert("Variant ID is missing.");
                return;
            }

            const data = await cartService.addToCart(
                variantId,
                1
            );

            console.log("Cart response:", data);

            alert("Product added to cart successfully!");

        } catch (error: any) {

            console.error("Add to cart error:", error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to add product to cart.");
            }
        }
    };

    if (loading) {
        return <div className="products-loading">Loading products...</div>;
    }

    if (error) {
        return <div className="products-error">{error}</div>;
    }

    return (
        <div className="products-container">
            <h2 className="products-title">All Products</h2>

            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.productId}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;