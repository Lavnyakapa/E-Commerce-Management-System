import React, { useEffect, useState } from "react";
import { cartService } from "../api/cartService";

interface CartItem {
    cartItemId: number;
    cartId: number;
    productId: number;
    variantId: number;

    productName: string;
    brand: string;
    sku: string;

    color: string;
    size: string;

    price: number;
    quantity: number;
    stockQuantity: number;

    subtotal: number;
    totalPrice: number;
}

interface CartResponse {
    cartId: number;
    message: string;
    items: CartItem[];
    totalPrice: number;
}

const Cart: React.FC = () => {

    const [items, setItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const loadCart = async () => {

        try {

            const response: CartResponse =
                await cartService.getMyCart();

            console.log("CART RESPONSE:", response);

            setItems(response.items || []);

            setTotalPrice(response.totalPrice || 0);

        } catch (error) {

            console.error(
                "Failed to load cart:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadCart();

    }, []);

    /*
     * Loading
     */
    if (loading) {

        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >
                <h2>Loading cart...</h2>
            </div>
        );
    }

    /*
     * Cart UI
     */
    return (

        <div
            style={{
                padding: "40px",
                maxWidth: "1000px",
                margin: "0 auto"
            }}
        >

            <h1
                style={{
                    marginBottom: "30px"
                }}
            >
                My Cart
            </h1>


            {/* Empty Cart */}

            {items.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "50px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some products to your cart.
                    </p>

                </div>

            ) : (

                <>

                    {/* Cart Items */}

                    {items.map((item) => (

                        <div
                            key={item.cartItemId}
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                marginBottom: "20px",
                                borderRadius: "10px",
                                backgroundColor: "#fff"
                            }}
                        >

                            {/* Product Name */}

                            <h2
                                style={{
                                    marginBottom: "15px"
                                }}
                            >
                                {item.productName}
                            </h2>


                            {/* Brand */}

                            <p>
                                <strong>
                                    Brand:
                                </strong>{" "}
                                {item.brand}
                            </p>


                            {/* SKU */}

                            <p>
                                <strong>
                                    SKU:
                                </strong>{" "}
                                {item.sku}
                            </p>


                            {/* Color */}

                            <p>
                                <strong>
                                    Color:
                                </strong>{" "}
                                {item.color}
                            </p>


                            {/* Size */}

                            <p>
                                <strong>
                                    Size:
                                </strong>{" "}
                                {item.size}
                            </p>


                            {/* Price */}

                            <p>
                                <strong>
                                    Price:
                                </strong>{" "}
                                ₹{item.price}
                            </p>


                            {/* Quantity */}

                            <p>
                                <strong>
                                    Quantity:
                                </strong>{" "}
                                {item.quantity}
                            </p>


                            {/* Available Stock */}

                            <p>
                                <strong>
                                    Available Stock:
                                </strong>{" "}
                                {item.stockQuantity}
                            </p>


                            {/* Subtotal */}

                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold"
                                }}
                            >
                                <strong>
                                    Subtotal:
                                </strong>{" "}
                                ₹{item.subtotal}
                            </p>

                        </div>

                    ))}


                    {/* Total */}

                    <div
                        style={{
                            marginTop: "30px",
                            padding: "25px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            textAlign: "right"
                        }}
                    >

                        <h2>
                            Total: ₹{totalPrice}
                        </h2>

                    </div>

                </>

            )}

        </div>
    );
};

export default Cart;