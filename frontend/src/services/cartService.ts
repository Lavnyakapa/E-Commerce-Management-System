import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

export const cartService = {

    addToCart: async (variantId: number, quantity: number = 1) => {

        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/items`,
            null,
            {
                params: {
                    variantId,
                    quantity,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    },

    getMyCart: async () => {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            API_URL,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    },
};