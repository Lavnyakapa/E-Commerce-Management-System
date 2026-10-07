import { useEffect, useState } from "react";
import "../styles/ProductCard.css";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
// Import your cart service (adjust the path if your cart service is located elsewhere)
// import { addToCart } from "../services/cartService";

const ProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 1. Add this handler function to call your backend cart endpoint
    const handleAddToCart = async (product: any) => {
        try {
            // Replace this with your actual cart API call (e.g., axios.post('/api/cart', ...))
            // Example:
            // await axios.post("http://localhost:8080/api/cart", {
            //     productId: product.productId,
            //     quantity: 1
            // });

            alert(`Successfully added ${product.productName} to cart!`);
        } catch (error: any) {
            console.error("Cart error:", error);
            // This is where your "Failed to add product to cart" alert is likely coming from
            alert(error.response?.data?.message || "Failed to add product to cart.");
        }
    };

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    return (
        <div className="products-container">
            <h1>Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                        onAddToCart={handleAddToCart} {/* 2. Pass the function here */}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;