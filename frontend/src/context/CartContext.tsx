import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WishlistProduct } from './WishlistContext';

export interface CartItem extends WishlistProduct {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: WishlistProduct) => void;
    removeFromCart: (productId: number | string) => void;
    isInCart: (productId: number | string) => boolean;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: WishlistProduct) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.productId === product.productId);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex].quantity += 1;
                return updated;
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number | string) => {
        setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    };

    const isInCart = (productId: number | string) => {
        return cart.some((item) => item.productId === productId);
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};