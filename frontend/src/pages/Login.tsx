import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import React, { useState } from "react";
import { loginCheck } from "../services/api.ts";

function Login() {

    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");

        try {

            const loginData = await loginCheck(
                userEmail,
                password
            );

            if (loginData.status === 200) {

                console.log("Login successful");

                console.log(
                    "Login response:",
                    loginData.data
                );

                // Store JWT token
                localStorage.setItem(
                    "token",
                    loginData.data.token
                );

                // Store logged-in user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        loginData.data
                    )
                );

                // Notify CartContext and WishlistContext
                // that the user has logged in
                window.dispatchEvent(
                    new Event("auth-changed")
                );

                // Navigate to Products
                navigate("/products");
            }

        } catch (error: any) {

            console.error(
                "Login failed:",
                error
            );

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Invalid email or password"
                );

            } else {

                setError(
                    "Unable to connect to the server"
                );
            }
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <div className="login-header">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to your E-Commerce
                        Management System
                    </p>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <div className="form-group">

                        <label>
                            Email

                            <input
                                type="email"
                                id="email_"
                                placeholder="Enter your email"
                                value={userEmail}
                                onChange={(e) =>
                                    setUserEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </label>

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <div className="login-options">

                        <label>

                            <input
                                type="checkbox"
                                name="remember"
                            />

                            Remember me

                        </label>

                        <Link to="#">
                            Forgot Password?
                        </Link>

                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                    >
                        Login
                    </button>

                </form>

                <div className="register-section">

                    <p>
                        Don't have an account?
                    </p>

                    <Link to="/register">
                        Create an Account
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;