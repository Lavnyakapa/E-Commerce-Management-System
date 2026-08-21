import { useEffect, useState } from "react";
import {
    getSubCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
} from "../services/subCategoryService";


interface Category {
    categoryId: number;
    categoryName: string;
}


interface SubCategory {

    subCategoryId: number;
    subCategoryName: string;
    subCategoryDescription: string;
    status: string;

    category?: Category;
    categoryId?: number;

}


interface SubCategoryForm {

    subCategoryName: string;
    subCategoryDescription: string;
    status: string;
    categoryId: string;

}


function SubCategoryList() {

    const [subCategories, setSubCategories] =
        useState<SubCategory[]>([]);

    const [showForm, setShowForm] =
        useState(false);

    const [editId, setEditId] =
        useState<number | null>(null);

    const [form, setForm] =
        useState<SubCategoryForm>({
            subCategoryName: "",
            subCategoryDescription: "",
            status: "ACTIVE",
            categoryId: ""
        });


    // Load subcategories
    const loadSubCategories = () => {

        getSubCategories()
            .then((response) => {

                console.log(response.data);

                setSubCategories(response.data);

            })
            .catch((error) => {

                console.error(
                    "Error loading subcategories:",
                    error
                );

            });

    };


    useEffect(() => {

        loadSubCategories();

    }, []);


    // Handle input
    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // Add
    const handleAdd = () => {

        setEditId(null);

        setForm({
            subCategoryName: "",
            subCategoryDescription: "",
            status: "ACTIVE",
            categoryId: ""
        });

        setShowForm(true);

    };


    // Edit
    const handleEdit = (sub: SubCategory) => {

        setEditId(sub.subCategoryId);

        setForm({
            subCategoryName: sub.subCategoryName,
            subCategoryDescription:
            sub.subCategoryDescription,
            status: sub.status,
            categoryId: String(
                sub.category?.categoryId ??
                sub.categoryId ??
                ""
            )
        });

        setShowForm(true);

    };


    // Create / Update
    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();


        if (!form.subCategoryName.trim()) {

            alert("Please enter subcategory name");

            return;

        }


        if (!form.categoryId) {

            alert("Please enter category ID");

            return;

        }


        const request = {

            subCategoryName:
            form.subCategoryName,

            subCategoryDescription:
            form.subCategoryDescription,

            status:
            form.status,

            categoryId:
                Number(form.categoryId)

        };


        try {

            if (editId !== null) {

                await updateSubCategory(
                    editId,
                    request
                );

                alert(
                    "Subcategory updated successfully"
                );

            } else {

                await createSubCategory(
                    request
                );

                alert(
                    "Subcategory created successfully"
                );

            }


            setShowForm(false);

            setEditId(null);

            loadSubCategories();

        } catch (error) {

            console.error(
                "Error saving subcategory:",
                error
            );

            alert("Failed to save subcategory");

        }

    };


    // Delete
    const handleDelete = async (id: number) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this subcategory?"
        );


        if (!confirmed) {

            return;

        }


        try {

            await deleteSubCategory(id);

            alert(
                "Subcategory deleted successfully"
            );

            loadSubCategories();

        } catch (error) {

            console.error(
                "Error deleting subcategory:",
                error
            );

            alert(
                "Unable to delete subcategory."
            );

        }

    };


    return (

        <div style={{ padding: "20px" }}>

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}
            >

                <h2>
                    Sub Categories List
                </h2>


                <button
                    onClick={handleAdd}
                    style={{
                        padding: "10px 16px",
                        cursor: "pointer"
                    }}
                >
                    + Add Sub Category
                </button>

            </div>


            {/* Add / Edit Form */}

            {showForm && (

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        marginBottom: "25px",
                        borderRadius: "8px"
                    }}
                >

                    <h3>
                        {editId !== null
                            ? "Edit Sub Category"
                            : "Add Sub Category"}
                    </h3>


                    <form onSubmit={handleSubmit}>

                        {/* Name */}

                        <div style={{ marginBottom: "15px" }}>

                            <label>
                                Sub Category Name
                            </label>

                            <br />

                            <input
                                type="text"
                                name="subCategoryName"
                                value={
                                    form.subCategoryName
                                }
                                onChange={handleChange}
                                placeholder="Enter subcategory name"
                            />

                        </div>


                        {/* Category ID */}

                        <div style={{ marginBottom: "15px" }}>

                            <label>
                                Category ID
                            </label>

                            <br />

                            <input
                                type="number"
                                name="categoryId"
                                value={
                                    form.categoryId
                                }
                                onChange={handleChange}
                                placeholder="Enter category ID"
                            />

                        </div>


                        {/* Description */}

                        <div style={{ marginBottom: "15px" }}>

                            <label>
                                Description
                            </label>

                            <br />

                            <textarea
                                name="subCategoryDescription"
                                value={
                                    form.subCategoryDescription
                                }
                                onChange={handleChange}
                                placeholder="Enter description"
                            />

                        </div>


                        {/* Status */}

                        <div style={{ marginBottom: "15px" }}>

                            <label>
                                Status
                            </label>

                            <br />

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >

                                <option value="ACTIVE">
                                    ACTIVE
                                </option>

                                <option value="INACTIVE">
                                    INACTIVE
                                </option>

                            </select>

                        </div>


                        {/* Buttons */}

                        <button
                            type="submit"
                            style={{
                                marginRight: "10px",
                                padding: "8px 15px",
                                cursor: "pointer"
                            }}
                        >

                            {editId !== null
                                ? "Update"
                                : "Save"}

                        </button>


                        <button
                            type="button"
                            onClick={() => {

                                setShowForm(false);

                                setEditId(null);

                            }}
                            style={{
                                padding: "8px 15px",
                                cursor: "pointer"
                            }}
                        >

                            Cancel

                        </button>

                    </form>

                </div>

            )}


            {/* Table */}

            <table
                border={1}
                cellPadding={10}
                cellSpacing={0}
                style={{
                    border: "3px solid #ccc",
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >

                <thead>

                <tr style={{borderBottom: "2px solid #ccc" , backgroundColor: "#f2f2f2" , textAlign: "center"}}>


                    <th>ID</th>

                    <th>Name</th>

                    <th>Category ID</th>

                    <th>Description</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

                </thead>


                <tbody>

                {subCategories.map((sub) => (

                    <tr key={sub.subCategoryId}
                    style={{borderBottom: "3Fpx solid #ccc" , textAlign: "center" , backgroundColor: "#f9f9f9"}}>

                        <td>
                            {sub.subCategoryId}
                        </td>


                        <td>
                            {sub.subCategoryName}
                        </td>


                        <td>

                            {
                                sub.category
                                    ? sub.category.categoryId
                                    : sub.categoryId
                            }

                        </td>


                        <td>
                            {sub.subCategoryDescription}
                        </td>


                        <td>
                            {sub.status}
                        </td>


                        <td>

                            <button
                                onClick={() =>
                                    handleEdit(sub)
                                }
                                style={{
                                    marginRight: "8px",
                                    cursor: "pointer"
                                }}
                            >
                                ✏️ Edit
                            </button>


                            <button
                                onClick={() =>
                                    handleDelete(
                                        sub.subCategoryId
                                    )
                                }
                                style={{
                                    cursor: "pointer"
                                }}
                            >
                                🗑️ Delete
                            </button>

                        </td>

                    </tr>

                ))}


                {subCategories.length === 0 && (

                    <tr>

                        <td
                            colSpan={6}
                            style={{
                                textAlign: "center"
                            }}
                        >
                            No subcategories found
                        </td>

                    </tr>

                )}

                </tbody>

            </table>

        </div>

    );

}


export default SubCategoryList;