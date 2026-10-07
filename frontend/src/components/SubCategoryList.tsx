import React, { useEffect, useState } from "react";
import {
    getSubCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
} from "../services/subCategoryService";

interface SubCategory {
    subCategoryId: number;
    subCategoryName: string;
    subCategoryDescription: string;
    status: string;
    categoryId: number;
}

const SubCategoryList: React.FC = () => {

    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string>("");

    const [showForm, setShowForm] = useState<boolean>(false);

    const [editId, setEditId] = useState<number | null>(null);

    const [form, setForm] = useState({
        subCategoryName: "",
        subCategoryDescription: "",
        status: "ACTIVE",
        categoryId: 1
    });


    /* =========================================================
       LOAD SUBCATEGORIES
    ========================================================= */

    const loadSubCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getSubCategories();

            const data = response.data;

            if (Array.isArray(data)) {

                setSubCategories(data);

            } else if (Array.isArray(data?.data)) {

                setSubCategories(data.data);

            } else {

                setSubCategories([]);

            }

        } catch (err) {

            console.error(
                "Error loading subcategories:",
                err
            );

            setError(
                "Failed to load subcategories."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        loadSubCategories();

    }, []);


    /* =========================================================
       INPUT CHANGE
    ========================================================= */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                name === "categoryId"
                    ? Number(value)
                    : value
        }));

    };


    /* =========================================================
       RESET FORM
    ========================================================= */

    const resetForm = () => {

        setForm({
            subCategoryName: "",
            subCategoryDescription: "",
            status: "ACTIVE",
            categoryId: 1
        });

        setEditId(null);

        setShowForm(false);

    };


    /* =========================================================
       ADD
    ========================================================= */

    const handleAdd = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await createSubCategory(form);

            alert("Subcategory created successfully.");

            resetForm();

            await loadSubCategories();

        } catch (err) {

            console.error(
                "Error creating subcategory:",
                err
            );

            alert(
                "Failed to create subcategory."
            );

        }

    };


    /* =========================================================
       EDIT
    ========================================================= */

    const handleEdit = (
        subCategory: SubCategory
    ) => {

        setEditId(subCategory.subCategoryId);

        setForm({
            subCategoryName:
                subCategory.subCategoryName || "",

            subCategoryDescription:
                subCategory.subCategoryDescription || "",

            status:
                subCategory.status || "ACTIVE",

            categoryId:
                Number(subCategory.categoryId) || 1
        });

        setShowForm(true);

    };


    /* =========================================================
       UPDATE
    ========================================================= */

    const handleUpdate = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (editId === null) {
            return;
        }

        try {

            await updateSubCategory(
                editId,
                form
            );

            alert(
                "Subcategory updated successfully."
            );

            resetForm();

            await loadSubCategories();

        } catch (err) {

            console.error(
                "Error updating subcategory:",
                err
            );

            alert(
                "Failed to update subcategory."
            );

        }

    };


    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = async (
        id: number
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this subcategory?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteSubCategory(id);

            alert(
                "Subcategory deleted successfully."
            );

            await loadSubCategories();

        } catch (err) {

            console.error(
                "Error deleting subcategory:",
                err
            );

            alert(
                "Failed to delete subcategory."
            );

        }

    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <div
                style={{
                    padding: "20px",
                    textAlign: "center"
                }}
            >
                Loading subcategories...
            </div>
        );

    }


    /* =========================================================
       UI
    ========================================================= */

    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >

                <h2>
                    Subcategory Management
                </h2>

                <button
                    type="button"
                    onClick={() => {

                        if (showForm) {

                            resetForm();

                        } else {

                            setShowForm(true);

                        }

                    }}
                    style={{
                        padding: "10px 18px",
                        cursor: "pointer"
                    }}
                >
                    {showForm
                        ? "Cancel"
                        : "Add Subcategory"}
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        color: "red",
                        marginBottom: "15px"
                    }}
                >
                    {error}
                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            {showForm && (

                <form
                    onSubmit={
                        editId === null
                            ? handleAdd
                            : handleUpdate
                    }
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        marginBottom: "25px"
                    }}
                >

                    <h3>
                        {editId === null
                            ? "Add Subcategory"
                            : "Edit Subcategory"}
                    </h3>


                    {/* NAME */}

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <label>
                            Subcategory Name
                        </label>

                        <input
                            type="text"
                            name="subCategoryName"
                            value={
                                form.subCategoryName
                            }
                            onChange={handleChange}
                            required
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <label>
                            Description
                        </label>

                        <textarea
                            name="subCategoryDescription"
                            value={
                                form.subCategoryDescription
                            }
                            onChange={handleChange}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />

                    </div>


                    {/* STATUS */}

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            style={{
                                display: "block",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        >

                            <option value="ACTIVE">
                                ACTIVE
                            </option>

                            <option value="INACTIVE">
                                INACTIVE
                            </option>

                        </select>

                    </div>


                    {/* CATEGORY ID */}

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <label>
                            Category ID
                        </label>

                        <input
                            type="number"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            required
                            min="1"
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px"
                            }}
                        />

                    </div>


                    {/* BUTTONS */}

                    <div>

                        <button
                            type="submit"
                            style={{
                                padding: "9px 16px",
                                marginRight: "10px",
                                cursor: "pointer"
                            }}
                        >
                            {editId === null
                                ? "Create"
                                : "Update"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                padding: "9px 16px",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            {subCategories.length === 0 ? (

                <div
                    style={{
                        padding: "20px",
                        textAlign: "center"
                    }}
                >
                    No subcategories found.
                </div>

            ) : (

                <div
                    style={{
                        overflowX: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                        <tr>

                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px"
                                }}
                            >
                                ID
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px"
                                }}
                            >
                                Name
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px"
                                }}
                            >
                                Description
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px"
                                }}
                            >
                                Status
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px"
                                }}
                            >
                                Category ID
                            </th>

                            <th
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px"
                                }}
                            >
                                Actions
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {subCategories.map(
                            (subCategory) => (

                                <tr
                                    key={
                                        subCategory.subCategoryId
                                    }
                                >

                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px"
                                        }}
                                    >
                                        {
                                            subCategory.subCategoryId
                                        }
                                    </td>

                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px"
                                        }}
                                    >
                                        {
                                            subCategory.subCategoryName
                                        }
                                    </td>

                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px"
                                        }}
                                    >
                                        {
                                            subCategory.subCategoryDescription
                                        }
                                    </td>

                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px"
                                        }}
                                    >
                                        {
                                            subCategory.status
                                        }
                                    </td>

                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px"
                                        }}
                                    >
                                        {
                                            subCategory.categoryId
                                        }
                                    </td>

                                    <td
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px"
                                        }}
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    subCategory
                                                )
                                            }
                                            style={{
                                                marginRight: "8px",
                                                padding: "6px 12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    subCategory.subCategoryId
                                                )
                                            }
                                            style={{
                                                padding: "6px 12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
};

export default SubCategoryList;