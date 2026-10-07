import React, { useEffect, useState } from "react";
import "../styles/Orders.css";

interface OrderItem {
    orderItemId?: number;
    variantId?: number;
    productName?: string;
    sku?: string;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

interface OrderHistory {
    historyId?: number;
    status: string;
    changedAt?: string;
}

interface Order {
    orderId: number;
    orderNumber: string;
    userId: number;
    customerName: string;
    email: string;

    addressId?: number;
    fullName?: string;
    phoneNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;

    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;

    items: OrderItem[];
    orderHistory?: OrderHistory[];

    createdAt: string;
    updatedAt?: string;
}

const API_URL = "http://localhost:8080/orders";

/*
 * Frontend value -> Backend value
 *
 * SHIPPED is displayed to the user,
 * but backend expects DISPATCHED.
 */
const ORDER_STATUSES = [
    {
        value: "PENDING",
        label: "Pending",
    },
    {
        value: "CONFIRMED",
        label: "Confirmed",
    },
    {
        value: "PROCESSING",
        label: "Processing",
    },
    {
        value: "DISPATCHED",
        label: "Shipped",
    },
    {
        value: "OUT_FOR_DELIVERY",
        label: "Out for Delivery",
    },
    {

        value: "DELIVERED",
        label: "Delivered",
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
    },
];

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] =
        useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            console.log("====================================");
            console.log("🔥 FETCHING ORDERS");
            console.log("URL:", API_URL);
            console.log("Token exists:", !!token);
            console.log("====================================");

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token
                        ? {
                            Authorization: `Bearer ${token}`,
                        }
                        : {}),
                },
            });

            console.log(
                "Orders response status:",
                response.status
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch orders. Status: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("====================================");
            console.log("✅ ORDERS API RESPONSE:");
            console.log(data);
            console.log(
                "Number of orders:",
                Array.isArray(data)
                    ? data.length
                    : 0
            );
            console.log("====================================");

            if (Array.isArray(data)) {

                // Newest orders first
                const sortedOrders = [...data].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                setOrders(sortedOrders);

            } else {
                setOrders([]);
                setError(
                    "Invalid orders response from server."
                );
            }
        } catch (err) {
            console.error(
                "❌ ERROR FETCHING ORDERS:",
                err
            );

            setError(
                "Failed to load orders."
            );

            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (
        orderId: number,
        status: string
    ) => {
        try {
            setUpdatingOrderId(orderId);
            setError("");

            const token = getToken();

            console.log(
                `Updating Order ${orderId} → ${status}`
            );

            const response = await fetch(
                `${API_URL}/${orderId}/status?status=${encodeURIComponent(
                    status
                )}`,
                {
                    method: "PATCH",
                    headers: {
                        ...(token
                            ? {
                                Authorization: `Bearer ${token}`,
                            }
                            : {}),
                    },
                }
            );

            if (!response.ok) {
                const errorText =
                    await response.text();

                console.error(
                    "Status update failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Failed to update order status. Status: ${response.status}`
                );
            }

            const updatedOrder: Order =
                await response.json();

            console.log(
                "✅ ORDER STATUS UPDATED:",
                updatedOrder
            );

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order.orderId === orderId
                        ? updatedOrder
                        : order
                )
            );
        } catch (err) {
            console.error(
                "❌ ERROR UPDATING ORDER:",
                err
            );

            setError(
                "Failed to update order status."
            );
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const formatStatus = (
        status: string
    ) => {
        if (!status) {
            return "-";
        }

        return status
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) => letter.toUpperCase()
            );
    };

    const formatDate = (
        date: string
    ) => {
        if (!date) {
            return "-";
        }

        try {
            return new Date(
                date
            ).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return date;
        }
    };

    const getStatusClass = (
        status: string
    ) => {
        return (
            status
                ?.toLowerCase()
                .replace(/_/g, "-") || ""
        );
    };

    const getCustomerName = (
        order: Order
    ) => {
        return (
            order.customerName ||
            order.fullName ||
            order.email ||
            `User #${order.userId}`
        );
    };

    const formatCurrency = (
        amount: number
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }
        ).format(Number(amount) || 0);
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-header">
                    <div>
                        <h1>Orders</h1>
                        <p>
                            Manage customer orders
                        </p>
                    </div>
                </div>

                <div className="orders-loading">
                    Loading orders...
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">

            <div className="orders-header">
                <div>
                    <h1>Orders</h1>
                    <p>
                        Manage customer orders
                    </p>
                </div>

                <button
                    className="refresh-orders-button"
                    onClick={fetchOrders}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="orders-error">
                    {error}
                </div>
            )}

            <div className="orders-summary">

                <div className="summary-card">
                    <span>
                        Total Orders
                    </span>

                    <strong>
                        {orders.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Pending
                    </span>

                    <strong>
                        {
                            orders.filter(
                                (order) =>
                                    order.orderStatus ===
                                    "PENDING"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Processing
                    </span>

                    <strong>
                        {
                            orders.filter(
                                (order) =>
                                    order.orderStatus ===
                                    "PROCESSING"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span>
                        Delivered
                    </span>

                    <strong>
                        {
                            orders.filter(
                                (order) =>
                                    order.orderStatus ===
                                    "DELIVERED"
                            ).length
                        }
                    </strong>
                </div>

            </div>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <h2>
                        No orders found
                    </h2>

                    <p>
                        Customer orders will appear
                        here once an order is created.
                    </p>
                </div>
            ) : (
                <div className="orders-table-container">

                    <table className="orders-table">

                        <thead>
                        <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Order Date</th>
                        </tr>
                        </thead>

                        <tbody>

                        {orders.map(
                            (order) => (

                                <tr
                                    key={
                                        order.orderId
                                    }
                                >

                                    <td>
                                        <div className="order-number">
                                            {
                                                order.orderNumber
                                            }
                                        </div>

                                        <div className="order-id">
                                            ID:{" "}
                                            {
                                                order.orderId
                                            }
                                        </div>
                                    </td>

                                    <td>
                                        <div className="customer-name">
                                            {
                                                getCustomerName(
                                                    order
                                                )
                                            }
                                        </div>

                                        <div className="customer-email">
                                            {
                                                order.email
                                            }
                                        </div>
                                    </td>

                                    <td>

                                        <div className="order-products">

                                            {order.items &&
                                            order.items.length >
                                            0 ? (

                                                order.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <div
                                                            className="order-product"
                                                            key={
                                                                item.orderItemId ??
                                                                index
                                                            }
                                                        >

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        item.productName ||
                                                                        "Product"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>

                                                                {item.sku && (
                                                                    <span>
                                                                        SKU:{" "}
                                                                        {
                                                                            item.sku
                                                                        }
                                                                    </span>
                                                                )}

                                                            </div>

                                                            <span>
                                                                {
                                                                    formatCurrency(
                                                                        item.totalPrice
                                                                    )
                                                                }
                                                            </span>

                                                        </div>
                                                    )
                                                )

                                            ) : (

                                                <span>
                                                    No products
                                                </span>

                                            )}

                                        </div>

                                    </td>

                                    <td>

                                        <strong className="order-total">
                                            {
                                                formatCurrency(
                                                    order.totalAmount
                                                )
                                            }
                                        </strong>

                                    </td>

                                    <td>

                                        <span
                                            className={`payment-badge ${getStatusClass(
                                                order.paymentStatus
                                            )}`}
                                        >
                                            {
                                                formatStatus(
                                                    order.paymentStatus
                                                )
                                            }
                                        </span>

                                    </td>

                                    <td>

                                        <select
                                            className={`order-status-select ${getStatusClass(
                                                order.orderStatus
                                            )}`}
                                            value={
                                                order.orderStatus
                                            }
                                            disabled={
                                                updatingOrderId ===
                                                order.orderId
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateOrderStatus(
                                                    order.orderId,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >

                                            {ORDER_STATUSES.map(
                                                (
                                                    status
                                                ) => (

                                                    <option
                                                        key={
                                                            status.value
                                                        }
                                                        value={
                                                            status.value
                                                        }
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {updatingOrderId ===
                                            order.orderId && (
                                                <small className="updating-text">
                                                    Updating...
                                                </small>
                                            )}

                                    </td>

                                    <td>

                                        <span className="order-date">
                                            {
                                                formatDate(
                                                    order.createdAt
                                                )
                                            }
                                        </span>

                                    </td>

                                </tr>
                            )
                        )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
};

export default Orders;