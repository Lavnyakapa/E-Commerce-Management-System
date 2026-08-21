import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    useState,
    useEffect
} from "react";

import {
    ShoppingCart,
    Search,
    Sun,
    Moon,
    LogOut,
    UserCircle,
    Menu,
    X,
    Heart,
    MapPin
} from "lucide-react";

import "../styles/Navbar.css";

import { useWishlist } from "../context/WishlistContext";


function Navbar() {

    const navigate = useNavigate();

    // ==========================================
    // WISHLIST
    // ==========================================

    const {
        wishlist
    } = useWishlist();

    const wishlistCount = wishlist.length;


    // ==========================================
    // DARK MODE
    // ==========================================

    const [darkMode, setDarkMode] = useState(() => {

        return localStorage.getItem("theme") === "dark";

    });


    // ==========================================
    // LOCATION (Amazon / Flipkart Style)
    // ==========================================

    const [location, setLocation] = useState<string>(() => {
        return localStorage.getItem("deliveryLocation") || "Hyderabad 500081";
    });

    const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
    const [tempLocation, setTempLocation] = useState<string>("");

    const handleSaveLocation = (e: React.FormEvent) => {
        e.preventDefault();
        if (tempLocation.trim()) {
            const newLoc = tempLocation.trim();
            setLocation(newLoc);
            localStorage.setItem("deliveryLocation", newLoc);
        }
        setIsEditingLocation(false);
        setTempLocation("");
    };


    // ==========================================
    // MOBILE MENU
    // ==========================================

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // ==========================================
    // SEARCH
    // ==========================================

    const [search, setSearch] = useState("");


    // ==========================================
    // LOGIN INFORMATION
    // ==========================================

    const token =
        localStorage.getItem("token");

    const userData =
        localStorage.getItem("user");

    let user: any = null;


    if (userData) {

        try {

            user = JSON.parse(userData);

        } catch (error) {

            console.error(
                "Invalid user data"
            );

        }

    }


    // ==========================================
    // USER ROLE
    // ==========================================

    const role =
        user?.role?.toUpperCase();

    const isAdmin =
        role === "ADMIN";

    const isCustomer =
        role === "CUSTOMER";


    // ==========================================
    // DARK MODE
    // ==========================================

    useEffect(() => {

        if (darkMode) {

            document.body.classList.add(
                "dark-mode"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }, [darkMode]);


    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth > 900) {

                setMobileMenuOpen(false);

            }

        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);


    // ==========================================
    // THEME CHANGE
    // ==========================================

    const handleThemeChange = () => {

        setDarkMode(
            previousMode =>
                !previousMode
        );

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (e.key !== "Enter") {
            return;
        }


        const searchValue =
            search.trim();


        if (searchValue) {

            navigate(
                `/products?search=${encodeURIComponent(
                    searchValue
                )}`
            );

        } else {

            navigate("/products");

        }


        setMobileMenuOpen(false);

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem("token");

        localStorage.removeItem("user");


        setMobileMenuOpen(false);

        navigate("/login");

    };


    // ==========================================
    // NAVIGATION
    // ==========================================

    const handleNavigation = () => {

        setMobileMenuOpen(false);

    };


    // ==========================================
    // NAV LINK CLASS
    // ==========================================

    const getNavLinkClass = ({
                                 isActive
                             }: {
        isActive: boolean
    }) => {

        return isActive
            ? "nav-item active"
            : "nav-item";

    };


    // ==========================================
    // NAVBAR
    // ==========================================

    return (

        <header className="navbar">


            {/* =====================================
                BRAND & LOCATION CONTAINER
            ====================================== */}

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

                <div
                    className="navbar-brand"
                    onClick={() =>
                        navigate("/")
                    }
                    style={{ cursor: "pointer" }}
                >

                    <div className="brand-icon">
                        E
                    </div>

                    <div className="brand-text">

                        <span className="brand-title">
                            E-Commerce
                        </span>

                        <span className="brand-subtitle">
                            Management System
                        </span>

                    </div>

                </div>

                {/* Delivery Location Widget (Amazon/Flipkart Style) */}
                <div
                    onClick={() => setIsEditingLocation(true)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "inherit",
                        gap: "4px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px dashed transparent",
                        transition: "border 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#007bff")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                    title="Click to change delivery location"
                >
                    <MapPin size={18} color="#007bff" />
                    <div style={{ lineHeight: "1.2" }}>
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>Deliver to</div>
                        <div style={{ fontWeight: "bold", fontSize: "11px" }}>{location}</div>
                    </div>
                </div>

            </div>


            {/* Location Change Modal / Popup */}
            {isEditingLocation && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <form onSubmit={handleSaveLocation} style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: "300px", color: "#333" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Choose your location</h4>
                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>Delivery options and delivery speeds may vary for different locations</p>
                        <input
                            type="text"
                            placeholder="Enter Pincode or City"
                            value={tempLocation}
                            onChange={(e) => setTempLocation(e.target.value)}
                            autoFocus
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button type="button" onClick={() => setIsEditingLocation(false)} style={{ padding: "6px 12px", background: "#f0f0f0", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                            <button type="submit" style={{ padding: "6px 12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Apply</button>
                        </div>
                    </form>
                </div>
            )}


            {/* =====================================
                SEARCH
            ====================================== */}

            <div className="navbar-search">

                <Search
                    size={18}
                    className="search-icon"
                />

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    onKeyDown={
                        handleSearch
                    }
                />

            </div>


            {/* =====================================
                MOBILE MENU
            ====================================== */}

            <button
                className="mobile-menu-button"
                onClick={() =>
                    setMobileMenuOpen(
                        previous =>
                            !previous
                    )
                }
                aria-label="Toggle navigation"
            >

                {mobileMenuOpen ? (

                    <X size={22} />

                ) : (

                    <Menu size={22} />

                )}

            </button>


            {/* =====================================
                NAVIGATION
            ====================================== */}

            <nav
                className={
                    mobileMenuOpen
                        ? "navbar-navigation mobile-open"
                        : "navbar-navigation"
                }
            >


                {/* HOME */}

                <NavLink
                    to="/"
                    end
                    className={getNavLinkClass}
                    onClick={
                        handleNavigation
                    }
                >
                    Home
                </NavLink>


                {/* PRODUCTS */}

                <NavLink
                    to="/products"
                    className={getNavLinkClass}
                    onClick={
                        handleNavigation
                    }
                >
                    Products
                </NavLink>


                {/* CATEGORIES */}

                <NavLink
                    to="/categories"
                    className={getNavLinkClass}
                    onClick={
                        handleNavigation
                    }
                >
                    Categories
                </NavLink>


                {/* =================================
                    ADMIN
                ================================= */}

                {isAdmin && (

                    <>

                        <NavLink
                            to="/subcategories"
                            className={getNavLinkClass}
                            onClick={
                                handleNavigation
                            }
                        >
                            Subcategories
                        </NavLink>


                        <NavLink
                            to="/users"
                            className={getNavLinkClass}
                            onClick={
                                handleNavigation
                            }
                        >
                            Users
                        </NavLink>


                        <NavLink
                            to="/orders"
                            className={getNavLinkClass}
                            onClick={
                                handleNavigation
                            }
                        >
                            Orders
                        </NavLink>


                        <NavLink
                            to="/inventory"
                            className={getNavLinkClass}
                            onClick={
                                handleNavigation
                            }
                        >
                            Inventory
                        </NavLink>

                    </>

                )}


                {/* =================================
                    CUSTOMER
                ================================= */}

                {isCustomer && (

                    <NavLink
                        to="/my-orders"
                        className={getNavLinkClass}
                        onClick={
                            handleNavigation
                        }
                    >
                        My Orders
                    </NavLink>

                )}


                {/* =================================
                    MOBILE USER
                ================================= */}

                {token && user && (

                    <div className="mobile-user-section">

                        <div className="mobile-user-info">

                            <UserCircle
                                size={20}
                            />

                            <div>

                                <strong>
                                    {user.firstName}{" "}
                                    {user.lastName}
                                </strong>

                                <span>
                                    {user.role}
                                </span>

                            </div>

                        </div>


                        <button
                            className="mobile-logout"
                            onClick={
                                handleLogout
                            }
                        >

                            <LogOut size={17} />

                            Logout

                        </button>

                    </div>

                )}

            </nav>


            {/* =====================================
                RIGHT SIDE
            ====================================== */}

            <div className="navbar-actions">


                {/* =================================
                    USER
                ================================= */}

                {token && user ? (

                    <div className="user-profile">

                        <UserCircle
                            size={21}
                        />

                        <div className="user-details">

                            <span className="user-name">

                                {user.firstName}{" "}
                                {user.lastName}

                            </span>

                            <span className="user-role">

                                {user.role}

                            </span>

                        </div>

                    </div>

                ) : (

                    <div className="auth-links">

                        <NavLink
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className="register-link"
                        >
                            Register
                        </NavLink>

                    </div>

                )}


                {/* =================================
                    LOGOUT
                ================================= */}

                {token && user && (

                    <button
                        className="logout-button"
                        onClick={
                            handleLogout
                        }
                        title="Logout"
                    >

                        <LogOut size={18} />

                        <span>
                            Logout
                        </span>

                    </button>

                )}


                {/* =================================
                    DARK MODE
                ================================= */}

                <button
                    className="icon-button"
                    onClick={
                        handleThemeChange
                    }
                    title={
                        darkMode
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                >

                    {darkMode ? (

                        <Sun size={19} />

                    ) : (

                        <Moon size={19} />

                    )}

                </button>


                {/* =================================
                    WISHLIST
                ================================= */}

                <button
                    className="wishlist-button"
                    onClick={() =>
                        navigate("/wishlist")
                    }
                    title="Wishlist"
                >

                    <Heart
                        size={20}
                    />

                    {wishlistCount > 0 && (

                        <span className="wishlist-count">
                            {wishlistCount}
                        </span>

                    )}

                </button>


                {/* =================================
                    CART
                ================================= */}

                <button
                    className="cart-button"
                    onClick={() =>
                        navigate("/cart")
                    }
                    title="Shopping Cart"
                >

                    <ShoppingCart
                        size={20}
                    />

                    <span className="cart-count">
                        0
                    </span>

                </button>

            </div>

        </header>

    );

}

export default Navbar;