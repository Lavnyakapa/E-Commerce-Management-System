import axios from "axios";
import type { User } from "../types/User";

const API_URL = "http://localhost:8080/api/users";

// =========================================
// GET AUTH HEADERS
// =========================================

const getAuthHeaders = () => {

    const token = localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


// =========================================
// GET ALL USERS
// =========================================

export const getUsers = () => {

    return axios.get<User[]>(
        API_URL
    );
};


// =========================================
// GET USER BY ID
// =========================================

export const getUserById = (
    userId: number
) => {

    return axios.get<User>(
        `${API_URL}/${userId}`
    );
};


// =========================================
// CREATE USER
// =========================================

export const addUser = (
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        roleId: number;
    }
) => {

    return axios.post<User>(
        API_URL,
        user
    );
};


// =========================================
// UPDATE USER
// =========================================

export const updateUser = (
    userId: number,
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        roleId: number;
    }
) => {

    return axios.put<User>(
        `${API_URL}/${userId}`,
        user,
        {
            headers: getAuthHeaders(),
        }
    );
};


// =========================================
// ACTIVATE / DEACTIVATE USER
// =========================================

export const updateUserStatus = (
    userId: number,
    status: "ACTIVE" | "INACTIVE" | "BLOCKED"
) => {

    return axios.patch<User>(
        `${API_URL}/${userId}/status`,
        null,
        {
            params: {
                status: status,
            },
            headers: getAuthHeaders(),
        }
    );
};


// =========================================
// DELETE USER
// =========================================

export const deleteUser = (
    userId: number
) => {

    return axios.delete(
        `${API_URL}/${userId}`,
        {
            headers: getAuthHeaders(),
        }
    );
};