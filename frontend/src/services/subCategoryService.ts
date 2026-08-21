import axios from "axios";

const API_URL = "http://localhost:8080/api/subcategories";

/*
 * Get JWT token from localStorage.
 *
 * IMPORTANT:
 * Change "token" below if your Login.tsx
 * stores the JWT using a different key.
 */
const getAuthHeaders = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};


// ============================================================
// GET ALL SUBCATEGORIES
// ============================================================

export const getSubCategories = () => {

    return axios.get(
        API_URL,
        getAuthHeaders()
    );
};


// ============================================================
// GET SUBCATEGORY BY ID
// ============================================================

export const getSubCategoryById = (id: number) => {

    return axios.get(
        `${API_URL}/${id}`,
        getAuthHeaders()
    );
};


// ============================================================
// CREATE SUBCATEGORY
// ============================================================

export const createSubCategory = (subCategory: {
    subCategoryName: string;
    subCategoryDescription: string;
    status: string;
    categoryId: number;
}) => {

    return axios.post(
        API_URL,
        subCategory,
        getAuthHeaders()
    );
};


// ============================================================
// UPDATE SUBCATEGORY
// ============================================================

export const updateSubCategory = (
    id: number,
    subCategory: {
        subCategoryName: string;
        subCategoryDescription: string;
        status: string;
        categoryId: number;
    }
) => {

    return axios.put(
        `${API_URL}/${id}`,
        subCategory,
        getAuthHeaders()
    );
};


// ============================================================
// DELETE SUBCATEGORY
// ============================================================

export const deleteSubCategory = (id: number) => {

    return axios.delete(
        `${API_URL}/${id}`,
        getAuthHeaders()
    );
};