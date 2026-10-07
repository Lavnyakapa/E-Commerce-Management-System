import React, {
    useEffect,
    useState
} from "react";

import ProductCard from "../../components/ProductCard";

import productService from "../../services/productService";

import type {
    Product,
    ProductRequest,
    ProductVariantRequest
} from "../../services/productService";

import cartService from "../../services/cartService";

import { useCart } from "../../context/CartContext";

import "../../styles/Products.css";


/* =========================================================
   USER TYPE
========================================================= */

interface UserData {

    id?: number;

    userId?: number;

    name?: string;

    email?: string;

    role?: string;

    authority?: string;

    user?: {

        id?: number;

        userId?: number;

        name?: string;

        email?: string;

        role?: string;

        authority?: string;
    };
}


/* =========================================================
   PRODUCT FORM
========================================================= */

interface ProductForm {

    productName: string;

    description: string;

    brand: string;

    subCategoryId: string;

    sku: string;

    size: string;

    color: string;

    price: string;

    stockQuantity: string;

    imageUrls: string;
}


/* =========================================================
   COMPONENT
========================================================= */

const Products: React.FC = () => {


    /* =====================================================
       CART
    ===================================================== */

    const {
        loadCart
    } = useCart();


    /* =====================================================
       PRODUCTS STATE
    ===================================================== */

    const [
        products,
        setProducts
    ] = useState<Product[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    /* =====================================================
       ADMIN FORM STATE
    ===================================================== */

    const [
        showForm,
        setShowForm
    ] = useState(false);


    const [
        editId,
        setEditId
    ] = useState<number | null>(null);


    const [
        form,
        setForm
    ] = useState<ProductForm>({

        productName: "",

        description: "",

        brand: "",

        subCategoryId: "",

        sku: "",

        size: "",

        color: "",

        price: "",

        stockQuantity: "",

        imageUrls: ""
    });


    /* =====================================================
       USER STATE
    ===================================================== */

    const [
        user,
        setUser
    ] = useState<UserData | null>(null);


    /* =====================================================
       LOAD USER
       SAME ROLE LOGIC AS NAVBAR
    ===================================================== */

    useEffect(() => {

        const loadUser = () => {

            const storedUser =
                localStorage.getItem("user");


            if (!storedUser) {

                setUser(null);

                return;
            }


            try {

                const parsedUser =
                    JSON.parse(
                        storedUser
                    );

                setUser(
                    parsedUser
                );

            } catch (error) {

                console.error(
                    "Failed to parse user:",
                    error
                );

                setUser(null);
            }
        };


        loadUser();


        /*
         * This allows the page to update
         * if login/logout changes the user.
         */

        window.addEventListener(
            "storage",
            loadUser
        );


        window.addEventListener(
            "authChanged",
            loadUser
        );


        return () => {

            window.removeEventListener(
                "storage",
                loadUser
            );


            window.removeEventListener(
                "authChanged",
                loadUser
            );
        };

    }, []);


    /* =====================================================
       ROLE
    ===================================================== */

    const rawRole =
        user?.role ||
        user?.authority ||
        user?.user?.role ||
        user?.user?.authority ||
        "";


    const role =
        rawRole
            .toString()
            .replace(
                "ROLE_",
                ""
            )
            .toUpperCase();


    const isAdmin =
        role === "ADMIN";


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const loadProducts =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await productService
                        .getAllProducts();


                setProducts(
                    data
                );

            } catch (error) {

                console.error(
                    "Error loading products:",
                    error
                );


                setError(
                    "Failed to load products."
                );

            } finally {

                setLoading(false);
            }
        };


    /* =====================================================
       INITIAL PRODUCT LOAD
    ===================================================== */

    useEffect(() => {

        loadProducts();

    }, []);


    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (
        event:
        React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]: value
            })
        );
    };


    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm = () => {

        setForm({

            productName: "",

            description: "",

            brand: "",

            subCategoryId: "",

            sku: "",

            size: "",

            color: "",

            price: "",

            stockQuantity: "",

            imageUrls: ""
        });


        setEditId(null);
    };


    /* =====================================================
       ADD PRODUCT
    ===================================================== */

    const handleAdd = () => {

        resetForm();

        setShowForm(true);
    };


    /* =====================================================
       EDIT PRODUCT
    ===================================================== */

    const handleEdit = (
        product: Product
    ) => {


        const variant =
            product.variants &&
            product.variants.length > 0
                ? product.variants[0]
                : undefined;


        setEditId(
            product.productId
        );


        setForm({

            productName:
                product.productName ||
                "",


            description:
                product.description ||
                "",


            brand:
                product.brand ||
                "",


            subCategoryId:
                product.subCategoryId !==
                undefined
                    ? String(
                        product.subCategoryId
                    )
                    : "",


            sku:
                variant?.sku ||
                "",


            size:
                variant?.size ||
                "",


            color:
                variant?.color ||
                "",


            price:
                variant?.price !==
                undefined
                    ? String(
                        variant.price
                    )
                    : "",


            stockQuantity:
                variant?.stockQuantity !==
                undefined
                    ? String(
                        variant.stockQuantity
                    )
                    : "",


            imageUrls:
                product.imageUrls
                    ? product.imageUrls.join(
                        "\n"
                    )
                    : ""
        });


        setShowForm(true);
    };


    /* =====================================================
       CREATE / UPDATE PRODUCT
    ===================================================== */

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (
            !form.productName.trim()
        ) {

            alert(
                "Please enter product name"
            );

            return;
        }


        if (
            !form.brand.trim()
        ) {

            alert(
                "Please enter brand"
            );

            return;
        }


        if (
            !form.subCategoryId ||
            Number(
                form.subCategoryId
            ) <= 0
        ) {

            alert(
                "Please enter a valid subcategory ID"
            );

            return;
        }


        if (
            !form.sku.trim()
        ) {

            alert(
                "Please enter SKU"
            );

            return;
        }


        if (
            form.price === "" ||
            Number(
                form.price
            ) < 0
        ) {

            alert(
                "Please enter a valid price"
            );

            return;
        }


        if (
            form.stockQuantity === "" ||
            Number(
                form.stockQuantity
            ) < 0
        ) {

            alert(
                "Please enter a valid stock quantity"
            );

            return;
        }


        /* -------------------------------------------------
           VARIANT
        ------------------------------------------------- */

        const variant:
            ProductVariantRequest = {

            sku:
                form.sku.trim(),

            size:
                form.size.trim(),

            color:
                form.color.trim(),

            price:
                Number(
                    form.price
                ),

            stockQuantity:
                Number(
                    form.stockQuantity
                )
        };


        /* -------------------------------------------------
           IMAGE URLS
        ------------------------------------------------- */

        const imageUrls =
            form.imageUrls
                .split("\n")
                .map(
                    url =>
                        url.trim()
                )
                .filter(
                    url =>
                        url.length > 0
                );


        /* -------------------------------------------------
           PRODUCT REQUEST
        ------------------------------------------------- */

        const request:
            ProductRequest = {

            productName:
                form.productName.trim(),

            description:
                form.description.trim(),

            brand:
                form.brand.trim(),

            subCategoryId:
                Number(
                    form.subCategoryId
                ),

            variants: [
                variant
            ],

            imageUrls
        };


        try {

            /* ---------------------------------------------
               UPDATE
            --------------------------------------------- */

            if (
                editId !== null
            ) {

                await productService
                    .updateProduct(
                        editId,
                        request
                    );


                alert(
                    "Product updated successfully"
                );

            }

            /* ---------------------------------------------
               CREATE
            --------------------------------------------- */

            else {

                await productService
                    .createProduct(
                        request
                    );


                alert(
                    "Product created successfully"
                );
            }


            setShowForm(false);

            resetForm();


            await loadProducts();

        } catch (error: any) {

            console.error(
                "Error saving product:",
                error
            );


            console.error(
                "Backend response:",
                error?.response?.data
            );


            alert(
                error?.response?.data?.message ||
                "Failed to save product."
            );
        }
    };


    /* =====================================================
       DELETE PRODUCT
    ===================================================== */

    const handleDelete = async (
        id: number
    ) => {


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmed) {

            return;
        }


        try {

            await productService
                .deleteProduct(
                    id
                );


            alert(
                "Product deleted successfully"
            );


            await loadProducts();

        } catch (error: any) {

            console.error(
                "Error deleting product:",
                error
            );


            console.error(
                "Backend response:",
                error?.response?.data
            );


            alert(
                error?.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };


    /* =====================================================
       ADD TO CART
       EXISTING CUSTOMER FUNCTIONALITY
    ===================================================== */

    const handleAddToCart = async (
        product: Product
    ) => {

        try {

            console.log(
                "Added to cart:",
                product
            );


            /* ---------------------------------------------
               CHECK VARIANT
            --------------------------------------------- */

            if (
                !product.variants ||
                product.variants.length === 0
            ) {

                alert(
                    "This product has no available variant."
                );

                return;
            }


            const variant =
                product.variants[0];


            /* ---------------------------------------------
               CHECK VARIANT ID
            --------------------------------------------- */

            if (
                !variant.variantId
            ) {

                alert(
                    "Product variant ID is missing."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK STOCK
            --------------------------------------------- */

            if (
                variant.stockQuantity !==
                undefined &&
                variant.stockQuantity <= 0
            ) {

                alert(
                    "This product is out of stock."
                );

                return;
            }


            /* ---------------------------------------------
               ADD TO CART API
            --------------------------------------------- */

            await cartService
                .addToCart(
                    Number(
                        variant.variantId
                    ),
                    1
                );


            /* ---------------------------------------------
               REFRESH CART
            --------------------------------------------- */

            await loadCart();


            /* ---------------------------------------------
               NAVBAR CART UPDATE
            --------------------------------------------- */

            window.dispatchEvent(
                new Event(
                    "cartUpdated"
                )
            );


            alert(
                "Product added to cart successfully!"
            );

        } catch (error: any) {

            console.error(
                "Error adding product to cart:",
                error
            );


            if (
                error?.response?.status ===
                401
            ) {

                alert(
                    "Please login to add products to cart."
                );

            } else if (
                error?.response?.status ===
                403
            ) {

                alert(
                    "You are not authorized to add this product to cart."
                );

            } else {

                alert(
                    "Failed to add product to cart."
                );
            }
        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div
                style={{
                    padding: "30px"
                }}
            >

                Loading products...

            </div>
        );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <div
                style={{
                    padding: "30px"
                }}
            >

                <p>
                    {error}
                </p>


                <button
                    onClick={
                        loadProducts
                    }
                >
                    Retry
                </button>

            </div>
        );
    }


    /* =====================================================
       MAIN RETURN
    ===================================================== */

    return (

        <div
            style={{
                padding: "20px"
            }}
        >


            {/* =================================================
                ADMIN HEADER
            ================================================= */}

            {isAdmin && (

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom:
                            "20px"
                    }}
                >

                    <div>

                        <h1>
                            Products
                        </h1>


                        <p>
                            Manage your products
                        </p>

                    </div>


                    <button
                        onClick={
                            handleAdd
                        }
                        style={{
                            padding:
                                "10px 16px",
                            cursor:
                                "pointer",
                            fontSize:
                                "15px",
                            fontWeight:
                                "bold"
                        }}
                    >

                        + Add Product

                    </button>

                </div>
            )}


            {/* =================================================
                ADMIN ADD / EDIT FORM
            ================================================= */}

            {isAdmin &&
                showForm && (

                    <div
                        style={{
                            border:
                                "1px solid #ccc",
                            padding:
                                "20px",
                            marginBottom:
                                "25px",
                            borderRadius:
                                "8px"
                        }}
                    >

                        <h2>

                            {editId !== null
                                ? "Edit Product"
                                : "Add Product"}

                        </h2>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* PRODUCT NAME */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Product Name
                                </label>

                                <br />

                                <input
                                    type="text"
                                    name="productName"
                                    value={
                                        form.productName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter product name"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* BRAND */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Brand
                                </label>

                                <br />

                                <input
                                    type="text"
                                    name="brand"
                                    value={
                                        form.brand
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter brand"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* SUBCATEGORY */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Sub Category ID
                                </label>

                                <br />

                                <input
                                    type="number"
                                    name="subCategoryId"
                                    value={
                                        form.subCategoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter subcategory ID"
                                    min="1"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Description
                                </label>

                                <br />

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter product description"
                                    rows={4}
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* SKU */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    SKU
                                </label>

                                <br />

                                <input
                                    type="text"
                                    name="sku"
                                    value={
                                        form.sku
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter SKU"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* SIZE */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Size
                                </label>

                                <br />

                                <input
                                    type="text"
                                    name="size"
                                    value={
                                        form.size
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter size"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* COLOR */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Color
                                </label>

                                <br />

                                <input
                                    type="text"
                                    name="color"
                                    value={
                                        form.color
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter color"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* PRICE */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Price
                                </label>

                                <br />

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* STOCK */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Stock Quantity
                                </label>

                                <br />

                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={
                                        form.stockQuantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter stock quantity"
                                    min="0"
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* IMAGE URLS */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <label>
                                    Image URLs
                                </label>

                                <br />

                                <textarea
                                    name="imageUrls"
                                    value={
                                        form.imageUrls
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter one image URL per line"
                                    rows={3}
                                    style={{
                                        width:
                                            "100%",
                                        padding:
                                            "8px"
                                    }}
                                />

                            </div>


                            {/* BUTTONS */}

                            <button
                                type="submit"
                                style={{
                                    marginRight:
                                        "10px",
                                    padding:
                                        "8px 15px",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                {editId !== null
                                    ? "Update"
                                    : "Save"}

                            </button>


                            <button
                                type="button"
                                onClick={() => {

                                    setShowForm(
                                        false
                                    );

                                    resetForm();

                                }}
                                style={{
                                    padding:
                                        "8px 15px",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                Cancel

                            </button>

                        </form>

                    </div>
                )}


            {/* =================================================
                ADMIN PRODUCT TABLE
            ================================================= */}

            {isAdmin ? (

                <>

                    <h2>
                        Products List
                    </h2>


                    <table
                        border={1}
                        cellPadding={10}
                        cellSpacing={0}
                        style={{
                            border:
                                "3px solid #ccc",
                            width:
                                "100%",
                            borderCollapse:
                                "collapse"
                        }}
                    >

                        <thead>

                        <tr
                            style={{
                                borderBottom:
                                    "2px solid #ccc",
                                backgroundColor:
                                    "#f2f2f2",
                                textAlign:
                                    "center"
                            }}
                        >

                            <th>
                                ID
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Brand
                            </th>

                            <th>
                                Sub Category
                            </th>

                            <th>
                                Variant
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Stock
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {products.map(
                            product => {

                                const variant =
                                    product.variants &&
                                    product.variants.length > 0
                                        ? product.variants[0]
                                        : undefined;


                                return (

                                    <tr
                                        key={
                                            product.productId
                                        }
                                        style={{
                                            borderBottom:
                                                "3px solid #ccc",
                                            textAlign:
                                                "center",
                                            backgroundColor:
                                                "#f9f9f9"
                                        }}
                                    >

                                        <td>
                                            {
                                                product.productId
                                            }
                                        </td>


                                        <td>
                                            {
                                                product.productName
                                            }
                                        </td>


                                        <td>
                                            {
                                                product.brand ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                product.subCategoryId ??
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                variant?.sku ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                variant?.price ??
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                variant?.stockQuantity ??
                                                "-"
                                            }
                                        </td>


                                        <td>

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        product
                                                    )
                                                }
                                                style={{
                                                    marginRight:
                                                        "8px",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >

                                                ✏️ Edit

                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product.productId
                                                    )
                                                }
                                                style={{
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >

                                                🗑️ Delete

                                            </button>

                                        </td>

                                    </tr>
                                );
                            }
                        )}


                        {products.length === 0 && (

                            <tr>

                                <td
                                    colSpan={8}
                                    style={{
                                        textAlign:
                                            "center"
                                    }}
                                >

                                    No products found

                                </td>

                            </tr>
                        )}

                        </tbody>

                    </table>

                </>

            ) : (

                /* =================================================
                   CUSTOMER PRODUCT CARDS
                ================================================= */

                <>

                    <div
                        style={{
                            marginBottom:
                                "20px"
                        }}
                    >

                        <h1>
                            Products
                        </h1>


                        <p>
                            Browse our available products
                        </p>

                    </div>


                    <div
                        className="products-grid"
                    >

                        {products.map(
                            product => (

                                <ProductCard
                                    key={
                                        product.productId
                                    }
                                    product={
                                        product
                                    }
                                    onAddToCart={
                                        handleAddToCart
                                    }
                                />

                            )
                        )}

                    </div>

                </>
            )}

        </div>
    );
};


export default Products;