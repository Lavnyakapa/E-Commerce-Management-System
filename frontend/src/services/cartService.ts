import axios from "axios";

console.log("🔥 CURRENT CARTSERVICE.TS IS RUNNING 🔥");

const API_URL = "http://localhost:8080/api/cart";

// ==========================================
// GET JWT TOKEN
// ==========================================
const getToken = (): string => {
    const token = localStorage.getItem("token");

    console.log(
        "CART TOKEN:",
        token ? "TOKEN EXISTS" : "NO TOKEN"
    );

    if (!token) {
        throw new Error(
            "User is not logged in. JWT token not found."
        );
    }

    return token;
};

// ==========================================
// GET AUTH HEADERS
// ==========================================
const getHeaders = () => {
    const token = getToken();

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

// ==========================================
// CART UPDATED EVENT
// ==========================================
const notifyCartUpdated = () => {
    window.dispatchEvent(new Event("cartUpdated"));
};

// ==========================================
// CART SERVICE
// ==========================================
export const cartService = {

    // ==========================================
    // ADD TO CART
    // ==========================================
    addToCart: async (
        variantId: number,
        quantity: number = 1
    ) => {

        console.log("======================================");
        console.log("🔥 ADD TO CART STARTED");
        console.log("Variant ID:", variantId);
        console.log("Quantity:", quantity);
        console.log("URL:", `${API_URL}/items`);

        try {
            const token = getToken();

            console.log(
                "Authorization:",
                `Bearer ${token.substring(0, 20)}...`
            );

            const response = await axios.post(
                `${API_URL}/items`,
                null,
                {
                    params: {
                        variantId: variantId,
                        quantity: quantity,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("======================================");
            console.log("✅ ADD TO CART SUCCESS");
            console.log("Status:", response.status);
            console.log("Response:", response.data);
            console.log("======================================");

            // Tell Navbar that cart has changed
            notifyCartUpdated();

            return response.data;

        } catch (error: any) {

            console.error("======================================");
            console.error("❌ ADD TO CART FAILED");

            if (error.response) {

                console.error(
                    "HTTP STATUS:",
                    error.response.status
                );

                console.error(
                    "RESPONSE DATA:",
                    error.response.data
                );

                console.error(
                    "RESPONSE HEADERS:",
                    error.response.headers
                );

            } else if (error.request) {

                console.error(
                    "REQUEST SENT BUT NO RESPONSE RECEIVED"
                );

                console.error(error.request);

            } else {

                console.error(
                    "REQUEST ERROR:",
                    error.message
                );
            }

            console.error("======================================");

            throw error;
        }
    },

    // ==========================================
    // GET MY CART
    // ==========================================
    getMyCart: async () => {

        console.log("🛒 GET CART STARTED");

        try {

            const response = await axios.get(
                API_URL,
                {
                    headers: getHeaders(),
                }
            );

            console.log(
                "🛒 GET CART SUCCESS:",
                response.data
            );

            return response.data;

        } catch (error: any) {

            console.error(
                "GET CART ERROR:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },

    // ==========================================
    // UPDATE QUANTITY
    // ==========================================
    updateQuantity: async (
        cartItemId: number,
        quantity: number
    ) => {

        console.log(
            "UPDATE CART:",
            cartItemId,
            quantity
        );

        try {

            const response = await axios.patch(
                `${API_URL}/items/${cartItemId}`,
                null,
                {
                    params: {
                        quantity: quantity,
                    },
                    headers: getHeaders(),
                }
            );

            // Tell Navbar that cart has changed
            notifyCartUpdated();

            return response.data;

        } catch (error: any) {

            console.error(
                "UPDATE CART ERROR:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },

    // ==========================================
    // REMOVE ITEM
    // ==========================================
    removeFromCart: async (
        cartItemId: number
    ) => {

        console.log(
            "REMOVE CART ITEM:",
            cartItemId
        );

        try {

            const response = await axios.delete(
                `${API_URL}/items/${cartItemId}`,
                {
                    headers: getHeaders(),
                }
            );

            // Tell Navbar that cart has changed
            notifyCartUpdated();

            return response.data;

        } catch (error: any) {

            console.error(
                "REMOVE CART ERROR:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },

    // ==========================================
    // CLEAR CART
    // ==========================================
    clearCart: async () => {

        console.log("CLEAR CART STARTED");

        try {

            const response = await axios.delete(
                API_URL,
                {
                    headers: getHeaders(),
                }
            );

            // Tell Navbar that cart has changed
            notifyCartUpdated();

            return response.data;

        } catch (error: any) {

            console.error(
                "CLEAR CART ERROR:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    },
};

export default cartService;