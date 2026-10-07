import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {

    const navigate = useNavigate();

    const {
        cart,
        loadCart,
        updateQuantity,
        removeFromCart,
    } = useCart();

    const [loading, setLoading] =
        useState(true);

    const [processingItem, setProcessingItem] =
        useState<number | null>(null);

    useEffect(() => {

        const load = async () => {

            setLoading(true);

            try {
                await loadCart();
            } finally {
                setLoading(false);
            }
        };

        load();

    }, [loadCart]);

    const totalPrice = useMemo(() => {

        return cart.reduce(
            (total, item) =>
                total +
                Number(item.subtotal || 0),
            0
        );

    }, [cart]);

    const handleIncrease = async (
        cartItemId: number,
        quantity: number,
        stockQuantity: number
    ) => {

        if (quantity >= stockQuantity) {

            alert(
                "Maximum available stock reached."
            );

            return;
        }

        try {

            setProcessingItem(
                cartItemId
            );

            await updateQuantity(
                cartItemId,
                quantity + 1
            );

        } catch (error: any) {

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update quantity."
            );

        } finally {

            setProcessingItem(null);
        }
    };

    const handleDecrease = async (
        cartItemId: number,
        quantity: number
    ) => {

        if (quantity <= 1) {
            return;
        }

        try {

            setProcessingItem(
                cartItemId
            );

            await updateQuantity(
                cartItemId,
                quantity - 1
            );

        } catch (error: any) {

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update quantity."
            );

        } finally {

            setProcessingItem(null);
        }
    };

    const handleRemove = async (
        cartItemId: number
    ) => {

        try {

            setProcessingItem(
                cartItemId
            );

            await removeFromCart(
                cartItemId
            );

        } catch (error: any) {

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove item."
            );

        } finally {

            setProcessingItem(null);
        }
    };

    if (loading) {

        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                }}
            >
                <h2>
                    Loading cart...
                </h2>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1000px",
                margin: "0 auto",
            }}
        >

            <h1
                style={{
                    marginBottom: "30px",
                }}
            >
                My Cart
            </h1>

            {cart.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "50px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                    }}
                >

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some products to your cart.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                        style={{
                            marginTop: "20px",
                            padding: "12px 25px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            border: "none",
                        }}
                    >
                        Browse Products
                    </button>

                </div>

            ) : (

                <>

                    {cart.map((item) => (

                        <div
                            key={
                                item.cartItemId
                            }
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                marginBottom: "20px",
                                borderRadius: "10px",
                                backgroundColor: "#fff",
                            }}
                        >

                            <h2>
                                {item.productName}
                            </h2>

                            <p>
                                <strong>
                                    Brand:
                                </strong>{" "}
                                {item.brand}
                            </p>

                            <p>
                                <strong>
                                    SKU:
                                </strong>{" "}
                                {item.sku}
                            </p>

                            <p>
                                <strong>
                                    Color:
                                </strong>{" "}
                                {item.color || "N/A"}
                            </p>

                            <p>
                                <strong>
                                    Size:
                                </strong>{" "}
                                {item.size || "N/A"}
                            </p>

                            <p>
                                <strong>
                                    Price:
                                </strong>{" "}
                                ₹
                                {Number(
                                    item.price || 0
                                ).toFixed(2)}
                            </p>

                            <p>
                                <strong>
                                    Available Stock:
                                </strong>{" "}
                                {item.stockQuantity}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginTop: "15px",
                                }}
                            >

                                <strong>
                                    Quantity:
                                </strong>

                                <button
                                    onClick={() =>
                                        handleDecrease(
                                            item.cartItemId,
                                            item.quantity
                                        )
                                    }
                                    disabled={
                                        item.quantity <= 1 ||
                                        processingItem ===
                                        item.cartItemId
                                    }
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        cursor: "pointer",
                                    }}
                                >
                                    -
                                </button>

                                <span
                                    style={{
                                        minWidth: "30px",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        handleIncrease(
                                            item.cartItemId,
                                            item.quantity,
                                            item.stockQuantity
                                        )
                                    }
                                    disabled={
                                        item.quantity >=
                                        item.stockQuantity ||
                                        processingItem ===
                                        item.cartItemId
                                    }
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        cursor: "pointer",
                                    }}
                                >
                                    +
                                </button>

                            </div>

                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    marginTop: "15px",
                                }}
                            >
                                <strong>
                                    Subtotal:
                                </strong>{" "}
                                ₹
                                {Number(
                                    item.subtotal || 0
                                ).toFixed(2)}
                            </p>

                            <button
                                onClick={() =>
                                    handleRemove(
                                        item.cartItemId
                                    )
                                }
                                disabled={
                                    processingItem ===
                                    item.cartItemId
                                }
                                style={{
                                    marginTop: "10px",
                                    padding: "10px 18px",
                                    cursor: "pointer",
                                    borderRadius: "6px",
                                    border: "none",
                                }}
                            >
                                Remove
                            </button>

                        </div>
                    ))}

                    <div
                        style={{
                            marginTop: "30px",
                            padding: "25px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            textAlign: "right",
                        }}
                    >

                        <h2>
                            Total: ₹
                            {totalPrice.toFixed(2)}
                        </h2>

                        <button
                            onClick={() =>
                                navigate("/checkout")
                            }
                            style={{
                                marginTop: "20px",
                                padding: "12px 25px",
                                fontSize: "16px",
                                cursor: "pointer",
                                borderRadius: "6px",
                                border: "none",
                            }}
                        >
                            Proceed to Checkout
                        </button>

                    </div>

                </>
            )}

        </div>
    );
};

export default Cart;