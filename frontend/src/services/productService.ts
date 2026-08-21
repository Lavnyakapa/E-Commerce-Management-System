import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export interface ProductVariant {
    id?: number;
    price: number;
    sku?: string;
    stockQuantity?: number;
}

export interface Product {
    productId: number;
    productName: string;
    description?: string;
    brand?: string;
    status?: string;
    subCategoryId?: number;
    imageUrl?: string;
    imagePath?: string;
    imageUrls?: string[];
    variants?: ProductVariant[];
    createdAt?: string;
    updatedAt?: string;
}

// Named function exports
export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(API_URL);

    console.log("Products API response:", response.data);

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response.data?.data)) {
        return response.data.data;
    }

    return [];
};

// Object export matching `Products.tsx` calls
export const productService = {
    getAllProducts: getProducts,
    getProductById: async (id: number): Promise<Product> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
};

export default productService;