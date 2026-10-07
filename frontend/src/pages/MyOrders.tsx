import React, { useEffect, useState } from "react";
import orderService, {
    type OrderResponse,
} from "../services/orderService";
import "../styles/MyOrders.css";

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getUserId = (): number | null => {
        try {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            const user = JSON.parse(storedUser);

            const userId =
                user.userId ??
                user.id ??
                user.userID;

            if (!userId) {
                return null;
            }

            return Number(userId);
        } catch (error) {
            console.error("USER DATA ERROR:", error);
            return null;
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const userId = getUserId();

            console.log("MY ORDERS USER ID:", userId);

            if (!userId) {
                setError(
                    "User information not found. Please login again."
                );
                return;
            }

            const response =
                await orderService.getOrdersByUser(userId);

            console.log("MY ORDERS RESPONSE:", response);

            // Newest order first, oldest order last
            const sortedOrders = [...(response || [])].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

            setOrders(sortedOrders);

        } catch (error: any) {
            console.error("MY ORDERS ERROR:", error);

            console.error(
                "ERROR RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load orders."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const formatDate = (date: string) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(price || 0);
    };

    const getStatusClass = (status: string) => {
        return (
            status
                ?.toLowerCase()
                .replace(/\s+/g, "-") || "pending"
        );
    };

    if (loading) {
        return (
            <div className="my-orders-page">
                <div className="orders-loading">
                    Loading your orders...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-orders-page">
                <div className="orders-error">
                    <h2>Unable to Load Orders</h2>

                    <p>{error}</p>

                    <button onClick={loadOrders}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-page">

            <div className="my-orders-header">
                <div>
                    <h1>My Orders</h1>

                    <p>
                        View your order history and details
                    </p>
                </div>

                <div className="order-count">
                    {orders.length}{" "}
                    {orders.length === 1
                        ? "Order"
                        : "Orders"}
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="no-orders">

                    <div className="no-orders-icon">
                        📦
                    </div>

                    <h2>No Orders Yet</h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <button
                        onClick={() =>
                            window.location.href =
                                "/products"
                        }
                    >
                        Start Shopping
                    </button>

                </div>
            ) : (
                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.orderId}
                        >

                            {/* ORDER HEADER */}

                            <div className="order-card-header">

                                <div>
                                    <span className="order-label">
                                        Order Number
                                    </span>

                                    <strong>
                                        {order.orderNumber}
                                    </strong>
                                </div>

                                <div className="order-date">

                                    <span className="order-label">
                                        Ordered On
                                    </span>

                                    <span>
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </span>

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="order-status-section">

                                <div>
                                    <span className="order-label">
                                        Order Status
                                    </span>

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            order.orderStatus
                                        )}`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div>
                                    <span className="order-label">
                                        Payment Status
                                    </span>

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                <div className="order-total">

                                    <span className="order-label">
                                        Total
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            order.totalAmount
                                        )}
                                    </strong>

                                </div>

                            </div>

                            {/* ORDER ITEMS */}

                            <div className="order-items">

                                <h3>Items</h3>

                                {order.items &&
                                order.items.length > 0 ? (
                                    order.items.map(
                                        (item) => (

                                            <div
                                                className="order-item"
                                                key={
                                                    item.orderItemId
                                                }
                                            >

                                                <div className="order-item-info">

                                                    <strong>
                                                        {
                                                            item.productName
                                                        }
                                                    </strong>

                                                    <span>
                                                        SKU:{" "}
                                                        {
                                                            item.sku
                                                        }
                                                    </span>

                                                    {(
                                                        item.color ||
                                                        item.size
                                                    ) && (
                                                        <span>
                                                            {item.color &&
                                                                `Color: ${item.color}`}

                                                            {item.color &&
                                                                item.size &&
                                                                " | "}

                                                            {item.size &&
                                                                `Size: ${item.size}`}
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="order-item-quantity">
                                                    Qty:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </div>

                                                <div className="order-item-price">

                                                    <span>
                                                        {formatPrice(
                                                            item.price
                                                        )}{" "}
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <strong>
                                                        {formatPrice(
                                                            item.totalPrice
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>
                                        )
                                    )
                                ) : (
                                    <p>
                                        No items found for
                                        this order.
                                    </p>
                                )}

                            </div>

                            {/* DELIVERY ADDRESS */}

                            <div className="delivery-section">

                                <h3>
                                    Delivery Address
                                </h3>

                                <p>
                                    <strong>
                                        {order.fullName}
                                    </strong>
                                </p>

                                <p>
                                    {order.addressLine1}
                                </p>

                                {order.addressLine2 && (
                                    <p>
                                        {order.addressLine2}
                                    </p>
                                )}

                                <p>
                                    {order.city},{" "}
                                    {order.state}{" "}
                                    {order.postalCode}
                                </p>

                                <p>
                                    {order.country}
                                </p>

                                <p>
                                    Phone:{" "}
                                    {order.phoneNumber}
                                </p>

                            </div>

                            {/* ORDER HISTORY */}

                            {order.orderHistory &&
                                order.orderHistory.length >
                                0 && (

                                    <div className="order-history">

                                        <h3>
                                            Order History
                                        </h3>

                                        <div className="history-list">

                                            {order.orderHistory.map(
                                                (history) => (

                                                    <div
                                                        className="history-item"
                                                        key={
                                                            history.historyId
                                                        }
                                                    >

                                                        <span
                                                            className={`history-status ${getStatusClass(
                                                                history.status
                                                            )}`}
                                                        >
                                                            {
                                                                history.status
                                                            }
                                                        </span>

                                                        <span>
                                                            {formatDate(
                                                                history.changedAt
                                                            )}
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default MyOrders;