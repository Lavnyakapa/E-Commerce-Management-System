import { useEffect, useState } from "react";

import {
    getUsers,
    addUser,
    updateUser,
    updateUserStatus,
    deleteUser,
} from "../services/userService";

import type { User } from "../types/User";

function Users() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // FORM STATE
    // =========================================

    const [showForm, setShowForm] = useState(false);

    const [editingUserId, setEditingUserId] =
        useState<number | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState<number>(3);

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const storedUser = localStorage.getItem("user");

    let loggedInUser: any = null;

    try {

        loggedInUser = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (e) {

        console.error(
            "Error parsing logged-in user:",
            e
        );
    }

    const isAdmin =
        loggedInUser?.role === "ADMIN";

    // =========================================
    // LOAD USERS
    // =========================================

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getUsers();

            console.log(
                "USERS DATA:",
                response.data
            );

            if (Array.isArray(response.data)) {

                setUsers(response.data);

            } else {

                setUsers([]);

                setError(
                    "Invalid users data received from server."
                );
            }

        } catch (error: any) {

            console.error(
                "ERROR LOADING USERS:",
                error
            );

            if (
                error?.response?.status === 403
            ) {

                setError(
                    "You do not have permission to view users."
                );

            } else if (
                error?.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else {

                setError(
                    "Failed to load users."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRoleId(3);

        setEditingUserId(null);

        setFormError("");

        setShowForm(false);
    };

    // =========================================
    // OPEN ADD FORM
    // =========================================

    const handleAddUser = () => {

        setEditingUserId(null);

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRoleId(3);

        setFormError("");

        setShowForm(true);
    };

    // =========================================
    // OPEN EDIT FORM
    // =========================================

    const handleEdit = (user: User) => {

        setEditingUserId(user.userId);

        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);

        // Password cannot be retrieved
        // because it is encrypted in database.
        setPassword("");

        setRoleId(user.roleId);

        setFormError("");

        setShowForm(true);
    };

    // =========================================
    // SAVE USER
    // =========================================

    const handleSave = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setFormError("");

        if (!firstName.trim()) {

            setFormError(
                "First name is required."
            );

            return;
        }

        if (!lastName.trim()) {

            setFormError(
                "Last name is required."
            );

            return;
        }

        if (!email.trim()) {

            setFormError(
                "Email is required."
            );

            return;
        }

        if (!editingUserId && !password.trim()) {

            setFormError(
                "Password is required."
            );

            return;
        }

        try {

            setSaving(true);

            const userData = {

                firstName: firstName.trim(),

                lastName: lastName.trim(),

                email: email.trim(),

                password: password,

                roleId: roleId,
            };

            if (editingUserId) {

                await updateUser(
                    editingUserId,
                    userData
                );

                alert(
                    "User updated successfully."
                );

            } else {

                await addUser(
                    userData
                );

                alert(
                    "User created successfully."
                );
            }

            resetForm();

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Error saving user:",
                error
            );

            setFormError(
                error?.response?.data?.message ||
                "Failed to save user."
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================
    // UPDATE USER STATUS
    // =========================================

    const handleStatusChange = async (
        user: User,
        status:
            | "ACTIVE"
            | "INACTIVE"
            | "BLOCKED"
    ) => {

        let message = "";

        if (status === "ACTIVE") {

            message =
                `Activate ${user.firstName} ${user.lastName}?`;

        } else if (status === "INACTIVE") {

            message =
                `Deactivate ${user.firstName} ${user.lastName}?`;

        } else {

            message =
                `Block ${user.firstName} ${user.lastName}?`;
        }

        const confirmed =
            window.confirm(message);

        if (!confirmed) {
            return;
        }

        try {

            await updateUserStatus(
                user.userId,
                status
            );

            alert(
                `User status changed to ${status}.`
            );

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Error updating user status:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Failed to update user status."
            );
        }
    };

    // =========================================
    // DELETE USER
    // =========================================

    const handleDelete = async (
        userId: number
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to permanently delete this user?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteUser(userId);

            alert(
                "User deleted successfully."
            );

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Error deleting user:",
                error
            );

            if (
                error?.response?.status === 403
            ) {

                alert(
                    "You do not have permission to delete users."
                );

            } else {

                alert(
                    error?.response?.data?.message ||
                    "Failed to delete user."
                );
            }
        }
    };

    // =========================================
    // STATUS STYLE
    // =========================================

    const getStatusStyle = (
        status: string
    ) => {

        if (status === "ACTIVE") {

            return {
                backgroundColor: "#dcfce7",
                color: "#166534",
            };

        }

        if (status === "INACTIVE") {

            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };

        }

        if (status === "BLOCKED") {

            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
            };

        }

        return {
            backgroundColor: "#e5e7eb",
            color: "#374151",
        };
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                    fontSize: "18px",
                }}
            >
                Loading users...
            </div>
        );
    }

    // =========================================
    // UI
    // =========================================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "0 auto",
            }}
        >

            {/* =================================
                HEADER
            ================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            marginBottom: "6px",
                        }}
                    >
                        User Management
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                        }}
                    >
                        Manage users, roles and account status
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >

                    {isAdmin && (

                        <span
                            style={{
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                                padding: "7px 14px",
                                borderRadius: "20px",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}
                        >
                            ADMIN
                        </span>

                    )}

                    {isAdmin && (

                        <button
                            onClick={handleAddUser}
                            style={{
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                        >
                            + Add User
                        </button>

                    )}

                </div>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div
                    style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                    }}
                >
                    {error}
                </div>

            )}


            {/* =================================
                ADD / EDIT FORM
            ================================= */}

            {showForm && isAdmin && (

                <div
                    style={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "25px",
                        marginBottom: "25px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                            }}
                        >
                            {editingUserId
                                ? "Edit User"
                                : "Create User"}
                        </h2>

                        <button
                            onClick={resetForm}
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "22px",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>

                    </div>


                    {formError && (

                        <div
                            style={{
                                backgroundColor: "#fee2e2",
                                color: "#991b1b",
                                padding: "12px",
                                borderRadius: "7px",
                                marginBottom: "15px",
                            }}
                        >
                            {formError}
                        </div>

                    )}


                    <form
                        onSubmit={handleSave}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, 1fr)",
                                gap: "18px",
                            }}
                        >

                            {/* FIRST NAME */}

                            <div>

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "6px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius: "6px",
                                        boxSizing:
                                            "border-box",
                                    }}
                                />

                            </div>


                            {/* LAST NAME */}

                            <div>

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "6px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius: "6px",
                                        boxSizing:
                                            "border-box",
                                    }}
                                />

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "6px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius: "6px",
                                        boxSizing:
                                            "border-box",
                                    }}
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label>
                                    Password
                                    {editingUserId &&
                                        " (enter new password)"}
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder={
                                        editingUserId
                                            ? "New password"
                                            : "Password"
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "6px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius: "6px",
                                        boxSizing:
                                            "border-box",
                                    }}
                                />

                            </div>


                            {/* ROLE */}

                            <div>

                                <label>
                                    Role
                                </label>

                                <select
                                    value={roleId}
                                    onChange={(e) =>
                                        setRoleId(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginTop: "6px",
                                        border:
                                            "1px solid #cbd5e1",
                                        borderRadius: "6px",
                                        boxSizing:
                                            "border-box",
                                        backgroundColor:
                                            "white",
                                    }}
                                >

                                    <option value={1}>
                                        ADMIN
                                    </option>

                                    <option value={2}>
                                        SELLER
                                    </option>

                                    <option value={3}>
                                        CUSTOMER
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* FORM BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "22px",
                            }}
                        >

                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    backgroundColor:
                                        "#e5e7eb",
                                    color: "#374151",
                                    border: "none",
                                    padding:
                                        "10px 18px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    backgroundColor:
                                        "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding:
                                        "10px 18px",
                                    borderRadius: "6px",
                                    cursor:
                                        saving
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingUserId
                                        ? "Update User"
                                        : "Create User"}
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =================================
                USER TABLE
            ================================= */}

            {!error && (

                <div
                    style={{
                        overflowX: "auto",
                        border:
                            "1px solid #e2e8f0",
                        borderRadius: "10px",
                        backgroundColor: "white",
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                        }}
                    >

                        <thead>

                        <tr
                            style={{
                                backgroundColor:
                                    "#f1f5f9",
                            }}
                        >

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "left",
                                }}
                            >
                                ID
                            </th>

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "left",
                                }}
                            >
                                First Name
                            </th>

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "left",
                                }}
                            >
                                Last Name
                            </th>

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "left",
                                }}
                            >
                                Email
                            </th>

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "left",
                                }}
                            >
                                Role
                            </th>

                            <th
                                style={{
                                    padding: "14px",
                                    textAlign: "left",
                                }}
                            >
                                Status
                            </th>

                            {isAdmin && (

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    Actions
                                </th>

                            )}

                        </tr>

                        </thead>


                        <tbody>

                        {users.length > 0 ? (

                            users.map((user) => (

                                <tr
                                    key={user.userId}
                                    style={{
                                        borderTop:
                                            "1px solid #e2e8f0",
                                    }}
                                >

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {user.userId}
                                    </td>

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {user.firstName}
                                    </td>

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {user.lastName}
                                    </td>

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {user.email}
                                    </td>

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >
                                        {user.roleName}
                                    </td>

                                    {/* STATUS */}

                                    <td
                                        style={{
                                            padding: "14px",
                                        }}
                                    >

                                        <span
                                            style={{
                                                ...getStatusStyle(
                                                    user.status
                                                ),
                                                padding:
                                                    "5px 10px",
                                                borderRadius:
                                                    "15px",
                                                fontSize:
                                                    "13px",
                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            {user.status}
                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    {isAdmin && (

                                        <td
                                            style={{
                                                padding:
                                                    "14px",
                                                textAlign:
                                                    "center",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "6px",
                                                    justifyContent:
                                                        "center",
                                                    flexWrap:
                                                        "wrap",
                                                }}
                                            >

                                                {/* EDIT */}

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            user
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
                                                            "7px 11px",
                                                        borderRadius:
                                                            "5px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    Edit
                                                </button>


                                                {/* ACTIVATE */}

                                                {user.status !==
                                                    "ACTIVE" && (

                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    user,
                                                                    "ACTIVE"
                                                                )
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#16a34a",
                                                                color:
                                                                    "white",
                                                                border:
                                                                    "none",
                                                                padding:
                                                                    "7px 11px",
                                                                borderRadius:
                                                                    "5px",
                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                        >
                                                            Activate
                                                        </button>

                                                    )}


                                                {/* DEACTIVATE */}

                                                {user.status ===
                                                    "ACTIVE" && (

                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    user,
                                                                    "INACTIVE"
                                                                )
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#d97706",
                                                                color:
                                                                    "white",
                                                                border:
                                                                    "none",
                                                                padding:
                                                                    "7px 11px",
                                                                borderRadius:
                                                                    "5px",
                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                        >
                                                            Deactivate
                                                        </button>

                                                    )}


                                                {/* BLOCK */}

                                                {user.status !==
                                                    "BLOCKED" && (

                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    user,
                                                                    "BLOCKED"
                                                                )
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#7f1d1d",
                                                                color:
                                                                    "white",
                                                                border:
                                                                    "none",
                                                                padding:
                                                                    "7px 11px",
                                                                borderRadius:
                                                                    "5px",
                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                        >
                                                            Block
                                                        </button>

                                                    )}


                                                {/* DELETE */}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.userId
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
                                                            "7px 11px",
                                                        borderRadius:
                                                            "5px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    )}

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={
                                        isAdmin
                                            ? 7
                                            : 6
                                    }
                                    style={{
                                        padding: "30px",
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    No users found.
                                </td>

                            </tr>

                        )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default Users;