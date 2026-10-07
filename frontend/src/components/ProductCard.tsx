import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import { Heart } from "lucide-react";

import {
    useWishlist
} from "../context/WishlistContext";

import type {
    WishlistProduct
} from "../context/WishlistContext";

import type {
    Product
} from "../services/productService";

import "../styles/ProductCard.css";


interface ProductCardProps {

    product: Product;

    onAddToCart?: (
        product: Product
    ) => void;
}


/* =========================================================
   BACKEND URL
========================================================= */

const BACKEND_URL =
    "http://localhost:8080";


/* =========================================================
   CONVERT IMAGE PATH TO BROWSER URL
========================================================= */

const getImageUrl = (
    image: string
): string => {

    const cleanImage =
        image.trim();


    if (!cleanImage) {

        return "/placeholder.png";
    }


    /* -----------------------------------------------------
       Already a complete URL
    ----------------------------------------------------- */

    if (
        cleanImage.startsWith(
            "http://"
        ) ||
        cleanImage.startsWith(
            "https://"
        ) ||
        cleanImage.startsWith(
            "data:"
        ) ||
        cleanImage.startsWith(
            "blob:"
        )
    ) {

        return cleanImage;
    }


    /* -----------------------------------------------------
       Backend path beginning with /
    ----------------------------------------------------- */

    if (
        cleanImage.startsWith("/")
    ) {

        return (
            `${BACKEND_URL}${cleanImage}`
        );
    }


    /* -----------------------------------------------------
       Relative backend path
    ----------------------------------------------------- */

    return (
        `${BACKEND_URL}/${cleanImage}`
    );
};


/* =========================================================
   FALLBACK IMAGES
========================================================= */

const getFallbackImages = (
    productName: string
): string[] => {

    const name =
        (
            productName || ""
        ).toLowerCase();


    /* =====================================================
       SAMSUNG GALAXY S25 ULTRA
    ===================================================== */

    if (
        name.includes("samsung") ||
        name.includes("galaxy") ||
        name.includes("ultra") ||
        name.includes("phone")
    ) {

        return [

            "images/products/s25ultra-back.jpg",

            "images/products/s25ultra-front.jpg",

            "images/products/s25ultra-side.jpg"

        ];
    }


    /* =====================================================
       MAYBELLINE
    ===================================================== */

    if (
        name.includes("maybelline") ||
        name.includes("foundation") ||
        name.includes("cosmetics")
    ) {

        return [

            "images/cosmetics/fitme-foundation.jpg",

            "images/cosmetics/fitme-foundation1.jpg"

        ];
    }


    /* =====================================================
       SHIRT
    ===================================================== */

    if (
        name.includes("shirt") ||
        name.includes("cotton") ||
        name.includes("clothing")
    ) {

        return [

            "images/products/mens-blue-shirt.jpg",

            "images/products/mens-blue-shirt_b.jpg"

        ];
    }


    /* =====================================================
       SMART WATCH
    ===================================================== */

    if (
        name.includes("watch") ||
        name.includes("smartwatch") ||
        name.includes("smart watch")
    ) {

        return [

            "images/products/SmartWatch.jpg"

        ];
    }


    return [];
};


/* =========================================================
   COMPONENT
========================================================= */

const ProductCard: React.FC<ProductCardProps> = React.memo(
    ({
         product,
         onAddToCart
     }) => {


        /* =====================================================
           WISHLIST
        ===================================================== */

        const {
            isInWishlist,
            toggleWishlist
        } = useWishlist();


        const inWishlist =
            isInWishlist(
                product.productId
            );


        const wishlistProduct:
            WishlistProduct = {

            productId:
            product.productId,

            productName:
            product.productName,

            brand:
            product.brand,

            imageUrl:
            product.imageUrl,

            imagePath:
            product.imagePath,

            variants:
                product.variants
                    ? product.variants.map(
                        variant => ({
                            price:
                            variant.price
                        })
                    )
                    : []
        };


        /* =====================================================
           IMAGE INDEX
        ===================================================== */

        const [
            currentImageIndex,
            setCurrentImageIndex
        ] = useState(0);


        /* =====================================================
           FAILED IMAGES
        ===================================================== */

        const [
            failedImages,
            setFailedImages
        ] = useState<
            Record<string, boolean>
        >({});


        /* =====================================================
           PRICE
        ===================================================== */

        const price =
            useMemo(() => {

                if (
                    product.variants &&
                    product.variants.length > 0
                ) {

                    return (
                        product
                            .variants[0]
                            .price || 0
                    );
                }


                return 0;

            }, [
                product.variants
            ]);


        /* =====================================================
           COLLECT ALL IMAGE PATHS
        ===================================================== */

        const imageUrls =
            useMemo(() => {

                const p =
                    product as unknown as Record<
                        string,
                        unknown
                    >;


                const images: string[] = [];


                /* -------------------------------------------------
                   ADD IMAGE
                ------------------------------------------------- */

                const addImage = (
                    image: unknown
                ) => {

                    if (
                        typeof image !==
                        "string"
                    ) {

                        return;
                    }


                    const clean =
                        image.trim();


                    if (
                        !clean
                    ) {

                        return;
                    }


                    if (
                        !images.includes(
                            clean
                        )
                    ) {

                        images.push(
                            clean
                        );
                    }
                };


                /* -------------------------------------------------
                   images
                ------------------------------------------------- */

                if (
                    Array.isArray(
                        p.images
                    )
                ) {

                    p.images.forEach(
                        addImage
                    );
                }


                /* -------------------------------------------------
                   imageUrls
                ------------------------------------------------- */

                if (
                    Array.isArray(
                        p.imageUrls
                    )
                ) {

                    p.imageUrls.forEach(
                        addImage
                    );
                }


                /* -------------------------------------------------
                   imageUrl
                ------------------------------------------------- */

                addImage(
                    product.imageUrl
                );


                /* -------------------------------------------------
                   imagePath
                ------------------------------------------------- */

                addImage(
                    product.imagePath
                );


                /* -------------------------------------------------
                   Other possible fields
                ------------------------------------------------- */

                addImage(
                    p.image
                );

                addImage(
                    p.image_url
                );

                addImage(
                    p.photo
                );


                /* -------------------------------------------------
                   FALLBACK
                ------------------------------------------------- */

                if (
                    images.length === 0
                ) {

                    return getFallbackImages(
                        product.productName
                    );
                }


                return images;

            }, [
                product
            ]);


        /* =====================================================
           CONVERT TO ACTUAL BROWSER URLS
        ===================================================== */

        const browserImageUrls =
            useMemo(() => {

                return imageUrls.map(
                    getImageUrl
                );

            }, [
                imageUrls
            ]);


        /* =====================================================
           AVAILABLE IMAGES
        ===================================================== */

        const availableImageUrls =
            useMemo(() => {

                const validImages =
                    browserImageUrls.filter(
                        image =>
                            !failedImages[
                                image
                                ]
                    );


                /*
                 * If API images failed,
                 * try product-name fallback.
                 */

                if (
                    validImages.length === 0
                ) {

                    const fallbackImages =
                        getFallbackImages(
                            product.productName
                        );


                    return fallbackImages
                        .map(
                            getImageUrl
                        )
                        .filter(
                            image =>
                                !failedImages[
                                    image
                                    ]
                        );
                }


                return validImages;

            }, [
                browserImageUrls,
                failedImages,
                product.productName
            ]);


        /* =====================================================
           CURRENT IMAGE
        ===================================================== */

        const activeImageSrc =
            availableImageUrls[
                currentImageIndex
                ] ||
            availableImageUrls[0] ||
            "/placeholder.png";


        /* =====================================================
           RESET WHEN PRODUCT CHANGES
        ===================================================== */

        useEffect(() => {

            setCurrentImageIndex(0);

            setFailedImages({});

        }, [
            product.productId
        ]);


        /* =====================================================
           IMAGE ERROR
        ===================================================== */

        const handleImageError = (
            event: React.SyntheticEvent<
                HTMLImageElement,
                Event
            >
        ) => {

            const image =
                event.currentTarget;


            const failedUrl =
                image.src;


            console.error(
                "❌ IMAGE FAILED:",
                failedUrl
            );


            setFailedImages(
                previous => ({
                    ...previous,
                    [failedUrl]: true
                })
            );


            setCurrentImageIndex(0);
        };


        /* =====================================================
           ADD TO CART
        ===================================================== */

        const handleAddToCartClick =
            () => {

                if (
                    !onAddToCart
                ) {

                    console.error(
                        "❌ onAddToCart IS UNDEFINED"
                    );


                    alert(
                        "Add to Cart function is not available."
                    );


                    return;
                }


                onAddToCart(
                    product
                );
            };


        /* =====================================================
           WISHLIST
        ===================================================== */

        const handleWishlistClick =
            async () => {

                try {

                    await toggleWishlist(
                        wishlistProduct
                    );

                } catch (
                    error
                    ) {

                    console.error(
                        "❌ WISHLIST FAILED:",
                        error
                    );
                }
            };


        /* =====================================================
           RETURN
        ===================================================== */

        return (

            <div className="product-card">


                {/* =================================================
                    IMAGE CONTAINER
                ================================================= */}

                <div
                    className="product-image-container"
                >

                    <img
                        src={
                            activeImageSrc
                        }
                        alt={
                            product.productName
                        }
                        className="product-image"
                        onError={
                            handleImageError
                        }
                    />


                    {/* =================================================
                        WISHLIST
                    ================================================= */}

                    <button
                        type="button"
                        className={
                            `wishlist-btn ${
                                inWishlist
                                    ? "active"
                                    : ""
                            }`
                        }
                        onClick={
                            handleWishlistClick
                        }
                        aria-label={
                            inWishlist
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                    >

                        <Heart
                            fill={
                                inWishlist
                                    ? "red"
                                    : "none"
                            }
                            color={
                                inWishlist
                                    ? "red"
                                    : "currentColor"
                            }
                        />

                    </button>

                </div>


                {/* =================================================
                    THUMBNAILS
                ================================================= */}

                {availableImageUrls.length > 1 && (

                    <div
                        className="product-thumbnails"
                        style={{
                            display:
                                "flex",

                            gap:
                                "6px",

                            padding:
                                "8px 12px",

                            justifyContent:
                                "center"
                        }}
                    >

                        {availableImageUrls.map(
                            (
                                url,
                                index
                            ) => (

                                <button
                                    key={
                                        `${url}-${index}`
                                    }
                                    type="button"
                                    onClick={() =>
                                        setCurrentImageIndex(
                                            index
                                        )
                                    }
                                    style={{
                                        border:
                                            currentImageIndex ===
                                            index
                                                ? "2px solid #007bff"
                                                : "1px solid #ccc",

                                        padding:
                                            "2px",

                                        background:
                                            "transparent",

                                        cursor:
                                            "pointer",

                                        borderRadius:
                                            "4px"
                                    }}
                                >

                                    <img
                                        src={
                                            url
                                        }
                                        alt=""
                                        onError={
                                            handleImageError
                                        }
                                        style={{
                                            width:
                                                "35px",

                                            height:
                                                "35px",

                                            objectFit:
                                                "cover",

                                            display:
                                                "block"
                                        }}
                                    />

                                </button>
                            )
                        )}

                    </div>
                )}


                {/* =================================================
                    PRODUCT INFO
                ================================================= */}

                <div
                    className="product-info"
                >

                    <h3
                        className="product-name"
                    >

                        {
                            product.productName
                        }

                    </h3>


                    {product.brand && (

                        <p
                            className="product-brand"
                        >

                            {
                                product.brand
                            }

                        </p>

                    )}


                    <p
                        className="product-price"
                    >

                        ₹
                        {price.toFixed(2)}

                    </p>


                    {/* =================================================
                        ADD TO CART
                    ================================================= */}

                    <button
                        type="button"
                        className="add-to-cart-btn"
                        onClick={
                            handleAddToCartClick
                        }
                    >

                        Add to Cart

                    </button>

                </div>

            </div>
        );
    }
);


ProductCard.displayName =
    "ProductCard";


export default ProductCard;