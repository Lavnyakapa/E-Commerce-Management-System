import { useEffect, useState } from "react";
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
} from "../services/categoryService";
import type { Category } from "../types/Category";

function Categories() {

    const [categories, setCategories] = useState<Category[]>([]);

    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    // =========================================
    // GET LOGGED-IN USER ROLE
    // =========================================

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const isAdmin = user?.role === "ADMIN";

    // =========================================
    // LOAD CATEGORIES
    // =========================================

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {

        getCategories()
            .then((response) => {

                console.log("Categories response:", response.data);

                setCategories(response.data);

            })
            .catch((error) => {

                console.error(
                    "Error loading categories:",
                    error
                );

            });
    };

    // =========================================
    // CLEAR FORM
    // =========================================

    const clearForm = () => {

        setCategoryName("");
        setCategoryDescription("");
        setEditingId(null);

    };

    // =========================================
    // ADD / UPDATE CATEGORY
    // =========================================

    const handleSubmit = () => {

        if (
            categoryName.trim() === "" ||
            categoryDescription.trim() === ""
        ) {

            alert("Please enter all fields.");
            return;

        }

        const category = {
            categoryName: categoryName.trim(),
            categoryDescription: categoryDescription.trim(),
        };

        // =====================================
        // ADD CATEGORY
        // =====================================

        if (editingId === null) {

            addCategory(category)
                .then(() => {

                    alert(
                        "Category Added Successfully"
                    );

                    clearForm();

                    loadCategories();

                })
                .catch((error) => {

                    console.error(
                        "Error adding category:",
                        error
                    );

                    alert(
                        "Failed to add category."
                    );

                });

        }

            // =====================================
            // UPDATE CATEGORY
        // =====================================

        else {

            updateCategory(
                editingId,
                category
            )
                .then(() => {

                    alert(
                        "Category Updated Successfully"
                    );

                    clearForm();

                    loadCategories();

                })
                .catch((error) => {

                    console.error(
                        "Error updating category:",
                        error
                    );

                    alert(
                        "Failed to update category."
                    );

                });

        }
    };

    // =========================================
    // EDIT CATEGORY
    // =========================================

    const handleEdit = (
        category: Category
    ) => {

        setEditingId(
            category.categoryId
        );

        setCategoryName(
            category.categoryName
        );

        setCategoryDescription(
            category.categoryDescription
        );

        // Scroll to top so the form is visible
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================
    // DELETE CATEGORY
    // =========================================

    const handleDelete = (
        id: number
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmDelete) {
            return;
        }

        deleteCategory(id)
            .then(() => {

                alert(
                    "Category Deleted Successfully"
                );

                loadCategories();

            })
            .catch((error) => {

                console.error(
                    "Error deleting category:",
                    error
                );

                alert(
                    "Failed to delete category."
                );

            });
    };

    // =========================================
    // UI
    // =========================================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >

            {/* =================================
                PAGE TITLE
            ================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: "28px",
                    }}
                >
                    Category Management
                </h1>

                {isAdmin && (
                    <span
                        style={{
                            backgroundColor: "#dcfce7",
                            color: "#166534",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        ADMIN
                    </span>
                )}

            </div>


            {/* =================================
                ADMIN ONLY - ADD / UPDATE FORM
            ================================= */}

            {isAdmin && (

                <div
                    style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "25px",
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "15px",
                            fontSize: "20px",
                        }}
                    >
                        {editingId === null
                            ? "Add Category"
                            : "Edit Category"}
                    </h2>


                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >

                        {/* CATEGORY NAME */}

                        <input
                            type="text"
                            placeholder="Category Name"
                            value={categoryName}
                            onChange={(e) =>
                                setCategoryName(
                                    e.target.value
                                )
                            }
                            style={{
                                padding: "10px",
                                width: "220px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                            }}
                        />


                        {/* DESCRIPTION */}

                        <input
                            type="text"
                            placeholder="Category Description"
                            value={
                                categoryDescription
                            }
                            onChange={(e) =>
                                setCategoryDescription(
                                    e.target.value
                                )
                            }
                            style={{
                                padding: "10px",
                                width: "320px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                            }}
                        />


                        {/* ADD / UPDATE */}

                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: "10px 18px",
                                backgroundColor:
                                    "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                        >
                            {editingId === null
                                ? "Add Category"
                                : "Update Category"}
                        </button>


                        {/* CANCEL */}

                        {editingId !== null && (

                            <button
                                onClick={clearForm}
                                style={{
                                    padding: "10px 18px",
                                    backgroundColor:
                                        "#64748b",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </div>

            )}


            {/* =================================
                CATEGORY TABLE
            ================================= */}

            <div
                style={{
                    overflowX: "auto",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >

                    <thead>

                    <tr
                        style={{
                            backgroundColor: "#f1f5f9",
                        }}
                    >

                        <th
                            style={{
                                padding: "14px",
                                textAlign: "left",
                                borderBottom:
                                    "1px solid #cbd5e1",
                            }}
                        >
                            ID
                        </th>


                        <th
                            style={{
                                padding: "14px",
                                textAlign: "left",
                                borderBottom:
                                    "1px solid #cbd5e1",
                            }}
                        >
                            Category Name
                        </th>


                        <th
                            style={{
                                padding: "14px",
                                textAlign: "left",
                                borderBottom:
                                    "1px solid #cbd5e1",
                            }}
                        >
                            Description
                        </th>


                        {/* ADMIN ONLY */}

                        {isAdmin && (

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "center",
                                    borderBottom:
                                        "1px solid #cbd5e1",
                                }}
                            >
                                Actions
                            </th>

                        )}

                    </tr>

                    </thead>


                    <tbody>

                    {categories.length > 0 ? (

                        categories.map(
                            (category) => (

                                <tr
                                    key={
                                        category.categoryId
                                    }
                                    style={{
                                        borderBottom:
                                            "1px solid #e2e8f0",
                                    }}
                                >

                                    {/* ID */}

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {
                                            category.categoryId
                                        }
                                    </td>


                                    {/* NAME */}

                                    <td
                                        style={{
                                            padding: "14px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {
                                            category.categoryName
                                        }
                                    </td>


                                    {/* DESCRIPTION */}

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {
                                            category.categoryDescription
                                        }
                                    </td>


                                    {/* ADMIN ACTIONS */}

                                    {isAdmin && (

                                        <td
                                            style={{
                                                padding: "14px",
                                                textAlign:
                                                    "center",
                                            }}
                                        >

                                            {/* EDIT */}

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        category
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        "#2563eb",
                                                    color:
                                                        "white",
                                                    border:
                                                        "none",
                                                    padding:
                                                        "7px 14px",
                                                    marginRight:
                                                        "8px",
                                                    borderRadius:
                                                        "5px",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                Edit
                                            </button>


                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        category.categoryId
                                                    )
                                                }
                                                style={{
                                                    backgroundColor:
                                                        "#dc2626",
                                                    color:
                                                        "white",
                                                    border:
                                                        "none",
                                                    padding:
                                                        "7px 14px",
                                                    borderRadius:
                                                        "5px",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    )}

                                </tr>

                            )

                        )

                    ) : (

                        <tr>

                            <td
                                colSpan={
                                    isAdmin
                                        ? 4
                                        : 3
                                }
                                style={{
                                    padding: "30px",
                                    textAlign: "center",
                                    color: "#64748b",
                                }}
                            >
                                No Categories Found
                            </td>

                        </tr>

                    )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Categories;