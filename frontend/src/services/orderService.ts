import axios from "axios";

const API_URL = "http://localhost:8080/orders";

export interface OrderRequest {
    userId: number;
    addressId: number;
}

export interface OrderItemResponse {
    orderItemId: number;
    variantId: number;

    productName: string;
    sku: string;

    size: string;
    color: string;

    quantity: number;
    price: number;
    totalPrice: number;
}

export interface OrderHistoryResponse {
    historyId: number;
    status: string;
    changedAt: string;
}

export interface OrderResponse {
    orderId: number;
    orderNumber: string;

    userId: number;

    customerName: string;
    email: string;

    addressId: number;

    fullName: string;
    phoneNumber: string;

    addressLine1: string;
    addressLine2: string;

    city: string;
    state: string;
    country: string;
    postalCode: string;

    totalAmount: number;

    orderStatus: string;
    paymentStatus: string;

    items: OrderItemResponse[];

    orderHistory: OrderHistoryResponse[];

    createdAt: string;
    updatedAt: string;
}

const getHeaders = () => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("User is not logged in.");
    }

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const orderService = {

    // ================= CREATE ORDER =================

    createOrder: async (
        request: OrderRequest
    ): Promise<OrderResponse> => {

        const response =
            await axios.post<OrderResponse>(
                API_URL,
                request,
                {
                    headers: getHeaders(),
                }
            );

        return response.data;
    },


    // ================= GET ORDER BY ID =================

    getOrderById: async (
        orderId: number
    ): Promise<OrderResponse> => {

        const response =
            await axios.get<OrderResponse>(
                `${API_URL}/${orderId}`,
                {
                    headers: getHeaders(),
                }
            );

        return response.data;
    },


    // ================= GET USER ORDERS =================

    getOrdersByUser: async (
        userId: number
    ): Promise<OrderResponse[]> => {

        const response =
            await axios.get<OrderResponse[]>(
                `${API_URL}/user/${userId}`,
                {
                    headers: getHeaders(),
                }
            );

        return response.data;
    },
};

export default orderService;