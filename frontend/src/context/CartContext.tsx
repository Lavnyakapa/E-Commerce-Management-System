import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import type { ReactNode } from "react";
import { cartService } from "../services/cartService";

export interface CartItem {
    cartItemId: number;
    cartId: number;
    productId: number;
    variantId: number;
    productName: string;
    brand: string;
    sku: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    stockQuantity: number;
    subtotal: number;
    totalPrice?: number;
}

interface CartContextType {
    cart: CartItem[];
    loadCart: () => Promise<void>;
    updateQuantity: (
        cartItemId: number,
        quantity: number
    ) => Promise<void>;
    removeFromCart: (
        cartItemId: number
    ) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext =
    createContext<CartContextType | undefined>(
        undefined
    );

export const CartProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {

    const [cart, setCart] =
        useState<CartItem[]>([]);

    const loadCart = useCallback(
        async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {
                setCart([]);
                return;
            }

            try {

                const response =
                    await cartService.getMyCart();

                console.log(
                    "CART API RESPONSE:",
                    response
                );

                const items =
                    Array.isArray(response?.items)
                        ? response.items
                        : [];

                setCart(items);

            } catch (error: any) {

                console.error(
                    "FAILED TO LOAD CART:",
                    error
                );

                if (error?.response) {

                    console.error(
                        "CART HTTP STATUS:",
                        error.response.status
                    );

                    console.error(
                        "CART RESPONSE DATA:",
                        error.response.data
                    );
                }

                setCart([]);

                throw error;
            }
        },
        []
    );

    useEffect(() => {

        loadCart().catch((error) => {

            console.error(
                "INITIAL CART LOAD FAILED:",
                error
            );

        });

        const handleAuthChanged = () => {

            loadCart().catch((error) => {

                console.error(
                    "CART LOAD AFTER LOGIN FAILED:",
                    error
                );

            });
        };

        window.addEventListener(
            "auth-changed",
            handleAuthChanged
        );

        return () => {

            window.removeEventListener(
                "auth-changed",
                handleAuthChanged
            );
        };

    }, [loadCart]);

    const updateQuantity = async (
        cartItemId: number,
        quantity: number
    ): Promise<void> => {

        if (quantity < 1) {
            return;
        }

        try {

            await cartService.updateQuantity(
                cartItemId,
                quantity
            );

            await loadCart();

        } catch (error) {

            console.error(
                "FAILED TO UPDATE CART QUANTITY:",
                error
            );

            throw error;
        }
    };

    const removeFromCart = async (
        cartItemId: number
    ): Promise<void> => {

        try {

            await cartService.removeFromCart(
                cartItemId
            );

            await loadCart();

        } catch (error) {

            console.error(
                "FAILED TO REMOVE CART ITEM:",
                error
            );

            throw error;
        }
    };

    const clearCart = async (): Promise<void> => {

        try {

            await cartService.clearCart();

            setCart([]);

        } catch (error) {

            console.error(
                "FAILED TO CLEAR CART:",
                error
            );

            throw error;
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loadCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {

    const context =
        useContext(CartContext);

    if (!context) {

        throw new Error(
            "useCart must be used within a CartProvider"
        );
    }

    return context;
};