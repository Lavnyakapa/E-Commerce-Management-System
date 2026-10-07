import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

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

    loadWishlist: () => Promise<void>;

    addToWishlist: (
        product: WishlistProduct
    ) => Promise<void>;

    removeFromWishlist: (
        productId: number | string
    ) => Promise<void>;

    clearWishlist: () => Promise<void>;

    isInWishlist: (
        productId: number | string
    ) => boolean;

    toggleWishlist: (
        product: WishlistProduct
    ) => Promise<void>;
}

const WishlistContext =
    createContext<WishlistContextType | undefined>(
        undefined
    );

const WISHLIST_API =
    "http://localhost:8080/api/wishlist";

const PRODUCT_API =
    "http://localhost:8080/api/products";

// ======================================================
// GET LOGGED-IN USER EMAIL
// ======================================================

const getLoggedInEmail = (): string | null => {
    try {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        const user = JSON.parse(
            storedUser
        );

        const email =
            user.email ??
            user.userEmail ??
            user.username;

        if (!email) {
            return null;
        }

        return String(email);

    } catch (error) {

        console.error(
            "FAILED TO READ LOGGED-IN USER:",
            error
        );

        return null;
    }
};

// ======================================================
// GET JWT TOKEN
// ======================================================

const getToken = (): string | null => {

    const token =
        localStorage.getItem("token");

    if (!token) {

        console.error(
            "WISHLIST: JWT TOKEN NOT FOUND"
        );

        return null;
    }

    return token;
};

// ======================================================
// WISHLIST PROVIDER
// ======================================================

export const WishlistProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {

    const [wishlist, setWishlist] =
        useState<WishlistProduct[]>([]);

    // ==================================================
    // LOAD WISHLIST
    // ==================================================

    const loadWishlist = useCallback(
        async () => {

            const email =
                getLoggedInEmail();

            const token =
                getToken();

            if (!email || !token) {

                setWishlist([]);

                return;
            }

            try {

                console.log(
                    "❤️ LOADING WISHLIST"
                );

                const wishlistResponse =
                    await fetch(
                        `${WISHLIST_API}?email=${encodeURIComponent(
                            email
                        )}`,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                console.log(
                    "❤️ WISHLIST STATUS:",
                    wishlistResponse.status
                );

                if (!wishlistResponse.ok) {

                    const errorText =
                        await wishlistResponse.text();

                    throw new Error(
                        errorText ||
                        `Wishlist request failed: ${wishlistResponse.status}`
                    );
                }

                const wishlistData =
                    await wishlistResponse.json();

                console.log(
                    "❤️ WISHLIST LOADED:",
                    wishlistData
                );

                // ==========================================
                // GET PRODUCT IDS
                // ==========================================

                const productIds: number[] =
                    Array.isArray(
                        wishlistData.productIds
                    )
                        ? wishlistData.productIds
                        : [];

                if (
                    productIds.length === 0
                ) {

                    setWishlist([]);

                    return;
                }

                // ==========================================
                // LOAD PRODUCTS
                // ==========================================

                const productResponse =
                    await fetch(
                        PRODUCT_API,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                if (!productResponse.ok) {

                    throw new Error(
                        `Products request failed: ${productResponse.status}`
                    );
                }

                const productsData =
                    await productResponse.json();

                const products:
                    WishlistProduct[] =
                    Array.isArray(
                        productsData
                    )
                        ? productsData
                        : Array.isArray(
                            productsData?.data
                        )
                            ? productsData.data
                            : [];

                // ==========================================
                // MATCH WISHLIST PRODUCTS
                // ==========================================

                const wishlistProducts =
                    productIds
                        .map(
                            (productId) =>
                                products.find(
                                    (product) =>
                                        String(
                                            product.productId
                                        ) ===
                                        String(
                                            productId
                                        )
                                )
                        )
                        .filter(
                            (
                                product
                            ): product is WishlistProduct =>
                                product !== undefined
                        );

                setWishlist(
                    wishlistProducts
                );

            } catch (error) {

                console.error(
                    "LOAD WISHLIST ERROR:",
                    error
                );

                setWishlist([]);
            }
        },
        []
    );

    // ==================================================
    // LOAD WISHLIST WHEN APP STARTS
    // ==================================================

    useEffect(() => {

        loadWishlist();

        const handleAuthChanged = () => {

            console.log(
                "🔐 AUTH CHANGED - RELOADING WISHLIST"
            );

            loadWishlist();
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

    }, [loadWishlist]);

    // ==================================================
    // CHECK IF PRODUCT IS IN WISHLIST
    // ==================================================

    const isInWishlist = useCallback(
        (
            productId: number | string
        ): boolean => {

            return wishlist.some(
                (item) =>
                    String(
                        item.productId
                    ) ===
                    String(
                        productId
                    )
            );
        },
        [wishlist]
    );

    // ==================================================
    // ADD TO WISHLIST
    // ==================================================

    const addToWishlist = async (
        product: WishlistProduct
    ): Promise<void> => {

        console.log(
            "❤️ ADD TO WISHLIST STARTED"
        );

        console.log(
            "PRODUCT ID:",
            product.productId
        );

        const email =
            getLoggedInEmail();

        const token =
            getToken();

        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!email) {

            throw new Error(
                "Please login before adding products to wishlist."
            );
        }

        if (!token) {

            throw new Error(
                "JWT token not found. Please login again."
            );
        }

        // ==========================================
        // CHECK DUPLICATE
        // ==========================================

        if (
            isInWishlist(
                product.productId
            )
        ) {

            console.log(
                "❤️ PRODUCT ALREADY IN WISHLIST"
            );

            return;
        }

        try {

            const url =
                `${WISHLIST_API}/add?email=${encodeURIComponent(
                    email
                )}&productId=${product.productId}`;

            console.log(
                "❤️ WISHLIST ADD URL:",
                url
            );

            console.log(
                "❤️ AUTHORIZATION HEADER: PRESENT"
            );

            // ==========================================
            // POST REQUEST WITH JWT
            // ==========================================

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            console.log(
                "❤️ ADD WISHLIST STATUS:",
                response.status
            );

            // ==========================================
            // ERROR
            // ==========================================

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "ADD WISHLIST RESPONSE:",
                    errorText
                );

                throw new Error(
                    errorText ||
                    "Failed to add product to wishlist."
                );
            }

            // ==========================================
            // SUCCESS RESPONSE
            // ==========================================

            const responseData =
                await response.json();

            console.log(
                "❤️ ADD WISHLIST SUCCESS:",
                responseData
            );

            // ==========================================
            // UPDATE FRONTEND STATE
            // ==========================================

            setWishlist(
                (previous) => {

                    const alreadyExists =
                        previous.some(
                            (item) =>
                                String(
                                    item.productId
                                ) ===
                                String(
                                    product.productId
                                )
                        );

                    if (
                        alreadyExists
                    ) {

                        return previous;
                    }

                    return [
                        ...previous,
                        product,
                    ];
                }
            );

            // ==========================================
            // NOTIFY OTHER COMPONENTS
            // ==========================================

            window.dispatchEvent(
                new Event("wishlistUpdated")
            );

            console.log(
                "❤️ PRODUCT ADDED TO WISHLIST:",
                product
            );

        } catch (error) {

            console.error(
                "❌ ADD WISHLIST ERROR:",
                error
            );

            throw error;
        }
    };

    // ==================================================
    // REMOVE FROM WISHLIST
    // ==================================================

    const removeFromWishlist =
        async (
            productId: number | string
        ): Promise<void> => {

            console.log(
                "💔 REMOVE WISHLIST STARTED"
            );

            const email =
                getLoggedInEmail();

            const token =
                getToken();

            // ==========================================
            // CHECK LOGIN
            // ==========================================

            if (!email) {

                throw new Error(
                    "Please login before modifying wishlist."
                );
            }

            if (!token) {

                throw new Error(
                    "JWT token not found. Please login again."
                );
            }

            try {

                const response =
                    await fetch(
                        `${WISHLIST_API}/remove?email=${encodeURIComponent(
                            email
                        )}&productId=${productId}`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                console.log(
                    "💔 REMOVE WISHLIST STATUS:",
                    response.status
                );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Failed to remove product from wishlist."
                    );
                }

                // ==========================================
                // UPDATE STATE
                // ==========================================

                setWishlist(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                String(
                                    item.productId
                                ) !==
                                String(
                                    productId
                                )
                        )
                );

                window.dispatchEvent(
                    new Event("wishlistUpdated")
                );

                console.log(
                    "💔 PRODUCT REMOVED FROM WISHLIST"
                );

            } catch (error) {

                console.error(
                    "REMOVE WISHLIST ERROR:",
                    error
                );

                throw error;
            }
        };

    // ==================================================
    // CLEAR WISHLIST
    // ==================================================

    const clearWishlist =
        async (): Promise<void> => {

            console.log(
                "🧹 CLEAR WISHLIST STARTED"
            );

            const email =
                getLoggedInEmail();

            const token =
                getToken();

            // ==========================================
            // CHECK LOGIN
            // ==========================================

            if (!email) {

                throw new Error(
                    "Please login before modifying wishlist."
                );
            }

            if (!token) {

                throw new Error(
                    "JWT token not found. Please login again."
                );
            }

            if (
                wishlist.length === 0
            ) {

                return;
            }

            try {

                const response =
                    await fetch(
                        `${WISHLIST_API}/clear?email=${encodeURIComponent(
                            email
                        )}`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                console.log(
                    "🧹 CLEAR WISHLIST STATUS:",
                    response.status
                );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Failed to clear wishlist."
                    );
                }

                setWishlist([]);

                window.dispatchEvent(
                    new Event("wishlistUpdated")
                );

                console.log(
                    "🧹 WISHLIST CLEARED"
                );

            } catch (error) {

                console.error(
                    "CLEAR WISHLIST ERROR:",
                    error
                );

                throw error;
            }
        };

    // ==================================================
    // TOGGLE WISHLIST
    // ==================================================

    const toggleWishlist =
        async (
            product: WishlistProduct
        ): Promise<void> => {

            console.log(
                "❤️ WISHLIST TOGGLE:",
                product.productId
            );

            if (
                isInWishlist(
                    product.productId
                )
            ) {

                await removeFromWishlist(
                    product.productId
                );

            } else {

                await addToWishlist(
                    product
                );
            }
        };

    // ==================================================
    // PROVIDER
    // ==================================================

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loadWishlist,
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

// ======================================================
// USE WISHLIST HOOK
// ======================================================

export const useWishlist =
    (): WishlistContextType => {

        const context =
            useContext(
                WishlistContext
            );

        if (!context) {

            throw new Error(
                "useWishlist must be used within a WishlistProvider"
            );
        }

        return context;
    };