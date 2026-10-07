import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Inventory.css";

interface ProductVariant {
    variantId: number;
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    stockQuantity?: number;
    status?: string;
}

interface Product {
    productId: number;
    productName: string;
    brand?: string;
    status?: string;
    variants?: ProductVariant[];
}

const API_URL = "http://localhost:8080/api/inventory";

const Inventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingVariantId, setUpdatingVariantId] = useState<number | null>(
        null
    );

    const [stockValues, setStockValues] = useState<{
        [key: number]: number;
    }>({});

    const token = localStorage.getItem("token");

    const loadInventory = async () => {
        try {
            setLoading(true);

            const response = await axios.get<Product[]>(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const inventoryData = response.data;

            setProducts(inventoryData);

            const initialStockValues: {
                [key: number]: number;
            } = {};

            inventoryData.forEach((product) => {
                product.variants?.forEach((variant) => {
                    initialStockValues[variant.variantId] =
                        variant.stockQuantity ?? 0;
                });
            });

            setStockValues(initialStockValues);
        } catch (error) {
            console.error("Failed to load inventory:", error);
            alert("Failed to load inventory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const handleStockChange = (
        variantId: number,
        value: string
    ) => {
        const stock = Number(value);

        setStockValues((previous) => ({
            ...previous,
            [variantId]: stock,
        }));
    };

    const updateStock = async (variantId: number) => {
        const stockQuantity = stockValues[variantId];

        if (stockQuantity === undefined || stockQuantity < 0) {
            alert("Stock quantity cannot be negative.");
            return;
        }

        try {
            setUpdatingVariantId(variantId);

            await axios.put(
                `${API_URL}/variant/${variantId}/stock`,
                {
                    stockQuantity: stockQuantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Stock updated successfully.");

            await loadInventory();
        } catch (error) {
            console.error("Failed to update stock:", error);
            alert("Failed to update stock.");
        } finally {
            setUpdatingVariantId(null);
        }
    };

    if (loading) {
        return (
            <div className="inventory-page">
                <div className="inventory-loading">
                    Loading inventory...
                </div>
            </div>
        );
    }

    return (
        <div className="inventory-page">
            <div className="inventory-header">
                <div>
                    <h1>Inventory</h1>
                    <p>
                        View and update product stock quantities.
                    </p>
                </div>
            </div>

            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>SKU</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={9}
                                className="inventory-empty"
                            >
                                No inventory found.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) =>
                            product.variants?.map((variant) => (
                                <tr key={variant.variantId}>
                                    <td>
                                        <strong>
                                            {product.productName}
                                        </strong>
                                    </td>

                                    <td>
                                        {product.brand || "-"}
                                    </td>

                                    <td>
                                        {variant.sku || "-"}
                                    </td>

                                    <td>
                                        {variant.color || "-"}
                                    </td>

                                    <td>
                                        {variant.size || "-"}
                                    </td>

                                    <td>
                                        ₹
                                        {variant.price?.toFixed(2) ||
                                            "0.00"}
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                stockValues[
                                                    variant.variantId
                                                    ] ?? 0
                                            }
                                            onChange={(event) =>
                                                handleStockChange(
                                                    variant.variantId,
                                                    event.target.value
                                                )
                                            }
                                            className="stock-input"
                                        />
                                    </td>

                                    <td>
                                            <span
                                                className={`stock-status ${
                                                    (stockValues[
                                                        variant.variantId
                                                        ] ?? 0) === 0
                                                        ? "out-of-stock"
                                                        : (stockValues[
                                                            variant.variantId
                                                            ] ?? 0) <= 5
                                                            ? "low-stock"
                                                            : "in-stock"
                                                }`}
                                            >
                                                {(stockValues[
                                                    variant.variantId
                                                    ] ?? 0) === 0
                                                    ? "Out of Stock"
                                                    : (stockValues[
                                                        variant.variantId
                                                        ] ?? 0) <= 5
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                            </span>
                                    </td>

                                    <td>
                                        <button
                                            className="update-stock-button"
                                            onClick={() =>
                                                updateStock(
                                                    variant.variantId
                                                )
                                            }
                                            disabled={
                                                updatingVariantId ===
                                                variant.variantId
                                            }
                                        >
                                            {updatingVariantId ===
                                            variant.variantId
                                                ? "Updating..."
                                                : "Update"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;