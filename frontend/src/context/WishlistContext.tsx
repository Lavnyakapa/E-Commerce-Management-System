import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";

export interface WishlistProduct {
    productId: number | string;
    productName: string;
    brand?: string;
    imageUrl?: string;
    imagePath?: string;
    variants?: { price: number }[];
    [key: string]: unknown;
}

interface WishlistContextType {
    wishlist: WishlistProduct[];
    addToWishlist: (product: WishlistProduct) => Promise<void>;
    removeFromWishlist: (productId: number | string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: number | string) => boolean;
    toggleWishlist: (product: WishlistProduct) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const USER_EMAIL = "logintest@gmail.com";

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistProduct[]>(() => {
        try {
            const saved = localStorage.getItem(`wishlist_${USER_EMAIL}`);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(`wishlist_${USER_EMAIL}`, JSON.stringify(wishlist));
        } catch (error) {
            console.error("Failed to save wishlist", error);
        }
    }, [wishlist]);

    const isInWishlist = useCallback((productId: number | string) => {
        return wishlist.some((item) => String(item.productId) === String(productId));
    }, [wishlist]);

    const addToWishlist = async (product: WishlistProduct) => {
        if (isInWishlist(product.productId)) return;
        setWishlist((prev) => [...prev, product]);

        try {
            await fetch(`http://localhost:8080/api/wishlist/add?email=${USER_EMAIL}&productId=${product.productId}`, {
                method: "POST",
            });
        } catch (error) {
            console.error("Backend add failed", error);
        }
    };

    const removeFromWishlist = async (productId: number | string) => {
        setWishlist((prev) => prev.filter((item) => String(item.productId) !== String(productId)));

        try {
            await fetch(`http://localhost:8080/api/wishlist/remove?email=${USER_EMAIL}&productId=${productId}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("Backend remove failed", error);
        }
    };

    const clearWishlist = async () => {
        setWishlist([]);
        try {
            await fetch(`http://localhost:8080/api/wishlist/clear?email=${USER_EMAIL}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("Backend clear failed", error);
        }
    };

    const toggleWishlist = async (product: WishlistProduct) => {
        if (isInWishlist(product.productId)) {
            await removeFromWishlist(product.productId);
        } else {
            await addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                isInWishlist,
                toggleWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};