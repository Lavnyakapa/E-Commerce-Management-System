import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home-container">

            <section className="hero-section">

                <div className="hero-content">

                    <p className="hero-tag">
                        E-COMMERCE MANAGEMENT SYSTEM
                    </p>

                    <h1>
                        Manage Your
                        <span> E-Commerce Business </span>
                        Easily
                    </h1>

                    <p className="hero-description">
                        Manage products, categories, sub-categories,
                        inventory and online shopping operations from
                        one simple and powerful platform.
                    </p>

                    <div className="home-buttons">

                        <Link
                            to="/products"
                            className="home-btn primary-btn"
                        >
                            View Products
                        </Link>

                        <Link
                            to="/categories"
                            className="home-btn secondary-btn"
                        >
                            Explore Categories
                        </Link>

                    </div>

                </div>

            </section>

            <section className="features-section">

                <div className="section-heading">

                    <p className="section-tag">
                        MANAGEMENT FEATURES
                    </p>

                    <h2>
                        Everything You Need
                    </h2>

                    <p>
                        Manage your e-commerce operations efficiently
                        with simple and organized management features.
                    </p>

                </div>

                <div className="features">

                    <div className="feature-card">
                        <div className="feature-icon">🛍️</div>

                        <h3>Products</h3>

                        <p>
                            Add, update, view and manage your products
                            easily from one place.
                        </p>

                        <Link
                            to="/products"
                            className="feature-link"
                        >
                            Manage Products →
                        </Link>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📂</div>

                        <h3>Categories</h3>

                        <p>
                            Organize your products using categories and
                            sub-categories.
                        </p>

                        <Link
                            to="/categories"
                            className="feature-link"
                        >
                            View Categories →
                        </Link>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📦</div>

                        <h3>Inventory</h3>

                        <p>
                            Keep track of product stock and manage
                            inventory efficiently.
                        </p>

                        <Link
                            to="/products"
                            className="feature-link"
                        >
                            Manage Inventory →
                        </Link>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔐</div>

                        <h3>Secure</h3>

                        <p>
                            Keep your e-commerce management operations
                            simple, organized and secure.
                        </p>
                    </div>

                </div>

            </section>

            <section className="quick-section">

                <div className="quick-content">

                    <div>
                        <p className="section-tag">
                            QUICK ACTIONS
                        </p>

                        <h2>
                            Start Managing Your Store
                        </h2>

                        <p>
                            Quickly access products and categories
                            to manage your e-commerce system.
                        </p>
                    </div>

                    <div className="quick-buttons">

                        <Link
                            to="/products"
                            className="quick-btn"
                        >
                            Products
                        </Link>

                        <Link
                            to="/categories"
                            className="quick-btn"
                        >
                            Categories
                        </Link>

                    </div>

                </div>

            </section>

            <section className="home-footer">

                <h2>
                    Simple. Organized. Powerful.
                </h2>

                <p>
                    Your complete e-commerce management solution.
                </p>

            </section>

        </div>
    );
}

export default Home;