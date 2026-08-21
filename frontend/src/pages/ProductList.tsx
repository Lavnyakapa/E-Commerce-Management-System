import { useEffect, useState } from "react";
import "../styles/ProductCard.css";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const ProductList = () => {

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const data = await getProducts();

                console.log("Products:", data);

                setProducts(data);

            } catch (error) {

                console.error(
                    "Failed to fetch products:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProducts();

    }, []);

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
                    />

                ))}

            </div>

        </div>
    );
};

export default ProductList;