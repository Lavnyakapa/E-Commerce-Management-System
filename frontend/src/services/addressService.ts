import axios from "axios";

const API_URL = "http://localhost:8080/api/addresses";

export interface Address {
    addressId: number;
    userId: number;

    fullName: string;
    phoneNumber: string;

    addressLine1: string;
    addressLine2: string;
    landmark: string;

    city: string;
    state: string;
    country: string;
    postalCode: string;

    addressType: string;
    isDefault: boolean;

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

export const addressService = {

    getAddressesByUser: async (
        userId: number
    ): Promise<Address[]> => {

        const response = await axios.get<Address[]>(
            `${API_URL}/user/${userId}`,
            {
                headers: getHeaders(),
            }
        );

        return response.data;
    },
};

export default addressService;