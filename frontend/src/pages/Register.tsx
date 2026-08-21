import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

interface Role {
    roleId: number;
    roleName: string;
}

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleId: ""
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchRoles = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/roles"
                );

                setRoles(response.data);

            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();

    }, []);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (!formData.roleId) {
            alert("Please select a role");
            return;
        }

        try {

            setLoading(true);

            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                roleId: Number(formData.roleId)
            };

            await axios.post(
                "http://localhost:8080/api/users",
                userData
            );

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            console.error("Registration failed:", error);

            alert("Registration failed!");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="register-container">

            <div className="register-card">

                <div className="register-header">

                    <h1>Create Account</h1>

                    <p>
                        Register to access the E-Commerce Management System
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">

                        <div className="form-group">

                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Role</label>

                        <select
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Role
                            </option>

                            {roles.map((role) => (

                                <option
                                    key={role.roleId}
                                    value={role.roleId}
                                >
                                    {role.roleName}
                                </option>

                            ))}

                        </select>

                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <div className="login-link">

                    <span>Already have an account?</span>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;