import api from "./api";
import type { Category } from "../types/Category";

export const getCategories = () => {
    return api.get<Category[]>("/categories");
};

export const addCategory = (
    category: Omit<Category, "categoryId">
) => {
    return api.post("/categories", category);
};

export const updateCategory = (
    id: number,
    category: Omit<Category, "categoryId">
) => {
    return api.put(`/categories/${id}`, category);
};

export const deleteCategory = (id: number) => {
    return api.delete(`/categories/${id}`);
};