import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

/* =========================================================
   PRODUCT VARIANT
========================================================= */

export interface ProductVariant {
    variantId: number;
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    stockQuantity?: number;
    status?: string;
}


/* =========================================================
   PRODUCT
========================================================= */

export interface Product {
    productId: number;
    productName: string;
    description?: string;
    brand?: string;
    status?: string;
    subCategoryId?: number;

    variants?: ProductVariant[];

    imageUrl?: string;
    imagePath?: string;
    imageUrls?: string[];

    createdAt?: string;
    updatedAt?: string;
}


/* =========================================================
   PRODUCT VARIANT REQUEST
========================================================= */

export interface ProductVariantRequest {
    sku: string;
    size: string;
    color: string;
    price: number;
    stockQuantity: number;
}


/* =========================================================
   PRODUCT REQUEST
========================================================= */

export interface ProductRequest {
    productName: string;
    description: string;
    brand: string;
    subCategoryId: number;

    variants: ProductVariantRequest[];

    imageUrls: string[];
}


/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export const getProducts = async (): Promise<Product[]> => {

    const response = await axios.get(API_URL);

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response.data?.data)) {
        return response.data.data;
    }

    return [];
};


/* =========================================================
   PRODUCT SERVICE
========================================================= */

export const productService = {

    /* -----------------------------------------------------
       GET ALL PRODUCTS
    ----------------------------------------------------- */

    getAllProducts: getProducts,


    /* -----------------------------------------------------
       GET PRODUCT BY ID
    ----------------------------------------------------- */

    getProductById: async (
        id: number
    ): Promise<Product> => {

        const response =
            await axios.get(
                `${API_URL}/${id}`
            );

        return response.data;
    },


    /* -----------------------------------------------------
       CREATE PRODUCT
    ----------------------------------------------------- */

    createProduct: async (
        request: ProductRequest
    ): Promise<Product> => {

        const response =
            await axios.post(
                API_URL,
                request
            );

        return response.data;
    },


    /* -----------------------------------------------------
       UPDATE PRODUCT
    ----------------------------------------------------- */

    updateProduct: async (
        id: number,
        request: ProductRequest
    ): Promise<Product> => {

        const response =
            await axios.put(
                `${API_URL}/${id}`,
                request
            );

        return response.data;
    },


    /* -----------------------------------------------------
       DELETE PRODUCT
    ----------------------------------------------------- */

    deleteProduct: async (
        id: number
    ) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );

        return response.data;
    }
};


export default productService;