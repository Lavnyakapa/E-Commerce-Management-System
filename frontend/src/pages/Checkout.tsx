import React, {
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import addressService from "../services/addressService";
import type { Address } from "../services/addressService";

import orderService from "../services/orderService";
import type { OrderResponse } from "../services/orderService";

import { cartService } from "../services/cartService";

const Checkout: React.FC = () => {

    const navigate = useNavigate();

    const {
        cart,
        loadCart,
    } = useCart();

    const [addresses, setAddresses] =
        useState<Address[]>([]);

    const [selectedAddressId, setSelectedAddressId] =
        useState<number | null>(null);

    const [order, setOrder] =
        useState<OrderResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [error, setError] =
        useState("");

    const getUser = () => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            throw new Error(
                "User information not found. Please login again."
            );
        }

        const user =
            JSON.parse(storedUser);

        const userId =
            Number(user.userId);

        if (!userId) {
            throw new Error(
                "User ID not found. Please login again."
            );
        }

        return {
            ...user,
            userId,
        };
    };

    const loadCheckoutData =
        async () => {

            try {

                setLoading(true);
                setError("");

                const user =
                    getUser();

                const [
                    cartResponse,
                    userAddresses,
                ] = await Promise.all([
                    cartService.getMyCart(),

                    addressService
                        .getAddressesByUser(
                            user.userId
                        ),
                ]);

                if (
                    !cartResponse?.items ||
                    cartResponse.items.length === 0
                ) {
                    setError(
                        "Your cart is empty. Please add products before checkout."
                    );
                }

                setAddresses(
                    userAddresses || []
                );

                const defaultAddress =
                    (userAddresses || []).find(
                        (address) =>
                            address.isDefault === true
                    );

                if (defaultAddress) {

                    setSelectedAddressId(
                        defaultAddress.addressId
                    );

                } else if (
                    userAddresses &&
                    userAddresses.length > 0
                ) {

                    setSelectedAddressId(
                        userAddresses[0].addressId
                    );
                }

            } catch (err: any) {

                console.error(
                    "CHECKOUT LOAD ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load checkout details."
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {
        loadCheckoutData();
    }, []);

    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.subtotal || 0),
            0
        );

    const handlePlaceOrder =
        async () => {

            try {

                setError("");

                const user =
                    getUser();

                if (cart.length === 0) {

                    setError(
                        "Your cart is empty."
                    );

                    return;
                }

                if (!selectedAddressId) {

                    setError(
                        "Please select a delivery address."
                    );

                    return;
                }

                setPlacingOrder(true);

                const createdOrder =
                    await orderService.createOrder({
                        userId: user.userId,
                        addressId:
                        selectedAddressId,
                    });

                setOrder(
                    createdOrder
                );

                await loadCart();

            } catch (err: any) {

                console.error(
                    "PLACE ORDER ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to place order."
                );

            } finally {

                setPlacingOrder(false);
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
                    Loading checkout...
                </h2>
            </div>
        );
    }

    if (order) {

        return (
            <div
                style={{
                    padding: "40px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <h1>
                    Order Placed Successfully
                </h1>

                <p
                    style={{
                        fontSize: "18px",
                        marginTop: "20px",
                    }}
                >
                    Thank you for your order.
                </p>

                <div
                    style={{
                        marginTop: "30px",
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        textAlign: "left",
                    }}
                >
                    <p>
                        <strong>
                            Order Number:
                        </strong>{" "}
                        {order.orderNumber}
                    </p>

                    <p>
                        <strong>
                            Total Amount:
                        </strong>{" "}
                        ₹
                        {Number(
                            order.totalAmount || 0
                        ).toFixed(2)}
                    </p>

                    <p>
                        <strong>
                            Order Status:
                        </strong>{" "}
                        {order.orderStatus}
                    </p>

                    <p>
                        <strong>
                            Payment Status:
                        </strong>{" "}
                        {order.paymentStatus}
                    </p>
                </div>

                <div
                    style={{
                        marginTop: "30px",
                        display: "flex",
                        justifyContent:
                            "center",
                        gap: "15px",
                    }}
                >
                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                        style={{
                            padding: "12px 25px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            border: "none",
                        }}
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() =>
                            navigate("/cart")
                        }
                        style={{
                            padding: "12px 25px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            border: "none",
                        }}
                    >
                        View Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "900px",
                margin: "0 auto",
            }}
        >
            <h1>
                Checkout
            </h1>

            {error && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                    }}
                >
                    {error}
                </div>
            )}

            <section
                style={{
                    marginTop: "30px",
                }}
            >
                <h2>
                    Delivery Address
                </h2>

                {addresses.length === 0 ? (

                    <div
                        style={{
                            marginTop: "15px",
                            padding: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                        }}
                    >
                        <p>
                            No delivery address found.
                        </p>

                        <p>
                            Please add an address
                            before placing the order.
                        </p>
                    </div>

                ) : (

                    addresses.map(
                        (address) => (

                            <label
                                key={
                                    address.addressId
                                }
                                style={{
                                    display:
                                        "block",
                                    marginTop:
                                        "15px",
                                    padding:
                                        "20px",
                                    border:
                                        selectedAddressId ===
                                        address.addressId
                                            ? "2px solid #000"
                                            : "1px solid #ddd",
                                    borderRadius:
                                        "10px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                <input
                                    type="radio"
                                    name="address"
                                    value={
                                        address.addressId
                                    }
                                    checked={
                                        selectedAddressId ===
                                        address.addressId
                                    }
                                    onChange={() =>
                                        setSelectedAddressId(
                                            address.addressId
                                        )
                                    }
                                    style={{
                                        marginRight:
                                            "10px",
                                    }}
                                />

                                <strong>
                                    {
                                        address.fullName
                                    }
                                </strong>

                                {address.isDefault && (
                                    <span
                                        style={{
                                            marginLeft:
                                                "10px",
                                        }}
                                    >
                                        (Default)
                                    </span>
                                )}

                                <p>
                                    {
                                        address.addressLine1
                                    }

                                    {address.addressLine2
                                        ? `, ${address.addressLine2}`
                                        : ""}
                                </p>

                                <p>
                                    {
                                        address.city
                                    }
                                    ,{" "}
                                    {
                                        address.state
                                    }
                                    ,{" "}
                                    {
                                        address.country
                                    }{" "}
                                    -{" "}
                                    {
                                        address.postalCode
                                    }
                                </p>

                                <p>
                                    Phone:{" "}
                                    {
                                        address.phoneNumber
                                    }
                                </p>
                            </label>
                        )
                    )
                )}
            </section>

            <section
                style={{
                    marginTop: "35px",
                }}
            >
                <h2>
                    Order Summary
                </h2>

                {cart.length === 0 ? (

                    <p>
                        Your cart is empty.
                    </p>

                ) : (

                    cart.map(
                        (item) => (

                            <div
                                key={
                                    item.cartItemId
                                }
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    padding:
                                        "15px 0",
                                    borderBottom:
                                        "1px solid #ddd",
                                }}
                            >
                                <span>
                                    {
                                        item.productName
                                    }{" "}
                                    ×{" "}
                                    {
                                        item.quantity
                                    }
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        item.subtotal ||
                                        0
                                    ).toFixed(2)}
                                </strong>
                            </div>
                        )
                    )
                )}

                <h2
                    style={{
                        textAlign:
                            "right",
                        marginTop:
                            "25px",
                    }}
                >
                    Total: ₹
                    {totalPrice.toFixed(2)}
                </h2>
            </section>

            <button
                onClick={
                    handlePlaceOrder
                }
                disabled={
                    placingOrder ||
                    cart.length === 0 ||
                    !selectedAddressId ||
                    addresses.length === 0
                }
                style={{
                    marginTop: "30px",
                    width: "100%",
                    padding: "15px",
                    fontSize: "17px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "none",
                }}
            >
                {placingOrder
                    ? "Placing Order..."
                    : "Place Order"}
            </button>
        </div>
    );
};

export default Checkout;