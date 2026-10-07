import React, { useEffect, useState } from "react";
import {
    Search,
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    MapPin,
    Moon,
    Sun,
    LogOut,
    Package,
    Users,
    Layers,
    Warehouse,
    ClipboardList,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import "../styles/Navbar.css";

interface UserData {
    id?: number;
    userId?: number;
    name?: string;
    email?: string;
    role?: string;
    authority?: string;
    authorities?: string[];
    user?: {
        id?: number;
        userId?: number;
        name?: string;
        email?: string;
        role?: string;
        authority?: string;
    };
}

interface LocationData {
    city: string;
    postalCode: string;
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { wishlist } = useWishlist();
    const { cart, loadCart } = useCart();

    const [user, setUser] = useState<UserData | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    // ==========================================
    // DELIVERY LOCATION
    // ==========================================

    const [deliveryLocation, setDeliveryLocation] =
        useState<LocationData>({
            city: "Hyderabad",
            postalCode: "500081",
        });

    const [locationLoading, setLocationLoading] =
        useState(false);

    const [locationError, setLocationError] =
        useState("");

    // ==========================================
    // LOAD SAVED LOCATION
    // ==========================================

    useEffect(() => {
        const savedLocation =
            localStorage.getItem("deliveryLocation");

        if (!savedLocation) {
            return;
        }

        try {
            const parsedLocation: LocationData =
                JSON.parse(savedLocation);

            if (
                parsedLocation.city &&
                parsedLocation.postalCode
            ) {
                setDeliveryLocation(
                    parsedLocation
                );
            }
        } catch (error) {
            console.error(
                "FAILED TO LOAD SAVED LOCATION:",
                error
            );
        }
    }, []);

    // ==========================================
    // GET CURRENT LOCATION
    // ==========================================

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError(
                "Location is not supported by this browser."
            );

            return;
        }

        setLocationLoading(true);
        setLocationError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                console.log(
                    "CURRENT LOCATION:",
                    latitude,
                    longitude
                );

                try {
                    /*
                     * Reverse geocoding:
                     * Latitude/Longitude → City/PIN
                     */

                    const response =
                        await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Failed to get address"
                        );
                    }

                    const data =
                        await response.json();

                    console.log(
                        "REVERSE LOCATION RESPONSE:",
                        data
                    );

                    const address =
                        data.address || {};

                    /*
                     * Try different fields because
                     * OpenStreetMap may return different
                     * address structures for different places.
                     */

                    const city =
                        address.city ||
                        address.town ||
                        address.municipality ||
                        address.village ||
                        address.suburb ||
                        address.county ||
                        "Unknown Location";

                    const postalCode =
                        address.postcode ||
                        "";

                    const newLocation: LocationData =
                        {
                            city,
                            postalCode,
                        };

                    setDeliveryLocation(
                        newLocation
                    );

                    localStorage.setItem(
                        "deliveryLocation",
                        JSON.stringify(
                            newLocation
                        )
                    );

                    console.log(
                        "DELIVERY LOCATION UPDATED:",
                        newLocation
                    );
                } catch (error) {
                    console.error(
                        "REVERSE GEOCODING FAILED:",
                        error
                    );

                    setLocationError(
                        "Unable to find your address."
                    );
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error(
                    "GEOLOCATION ERROR:",
                    error
                );

                setLocationLoading(false);

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError(
                            "Location permission was denied."
                        );
                        break;

                    case error.POSITION_UNAVAILABLE:
                        setLocationError(
                            "Your location is currently unavailable."
                        );
                        break;

                    case error.TIMEOUT:
                        setLocationError(
                            "Location request timed out."
                        );
                        break;

                    default:
                        setLocationError(
                            "Unable to detect your location."
                        );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    // ==========================================
    // LOAD USER
    // ==========================================

    useEffect(() => {
        const loadUser = () => {
            const storedUser =
                localStorage.getItem("user");

            console.log(
                "NAVBAR STORED USER:",
                storedUser
            );

            if (!storedUser) {
                setUser(null);
                return;
            }

            try {
                const parsedUser: UserData =
                    JSON.parse(storedUser);

                console.log(
                    "NAVBAR PARSED USER:",
                    parsedUser
                );

                console.log(
                    "NAVBAR ROLE:",
                    parsedUser?.role
                );

                setUser(parsedUser);
            } catch (error) {
                console.error(
                    "Failed to parse user:",
                    error
                );

                setUser(null);
            }
        };

        loadUser();

        window.addEventListener(
            "storage",
            loadUser
        );

        window.addEventListener(
            "userUpdated",
            loadUser
        );

        window.addEventListener(
            "auth-changed",
            loadUser
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadUser
            );

            window.removeEventListener(
                "userUpdated",
                loadUser
            );

            window.removeEventListener(
                "auth-changed",
                loadUser
            );
        };
    }, []);

    // ==========================================
    // LOAD CART AFTER LOGIN
    // ==========================================

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (token) {
            loadCart().catch((error) => {
                console.error(
                    "NAVBAR CART LOAD FAILED:",
                    error
                );
            });
        }
    }, [loadCart]);

    // ==========================================
    // LISTEN FOR CART UPDATES
    // ==========================================

    useEffect(() => {
        const handleCartUpdated = () => {
            console.log(
                "NAVBAR: CART UPDATED EVENT RECEIVED"
            );

            loadCart().catch((error) => {
                console.error(
                    "NAVBAR CART REFRESH FAILED:",
                    error
                );
            });
        };

        window.addEventListener(
            "cartUpdated",
            handleCartUpdated
        );

        return () => {
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );
        };
    }, [loadCart]);

    // ==========================================
    // DARK MODE
    // ==========================================

    useEffect(() => {
        const savedTheme =
            localStorage.getItem("darkMode");

        if (savedTheme === "true") {
            setDarkMode(true);

            document.body.classList.add(
                "dark-mode"
            );
        } else {
            setDarkMode(false);

            document.body.classList.remove(
                "dark-mode"
            );
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;

        setDarkMode(newMode);

        localStorage.setItem(
            "darkMode",
            String(newMode)
        );

        if (newMode) {
            document.body.classList.add(
                "dark-mode"
            );
        } else {
            document.body.classList.remove(
                "dark-mode"
            );
        }
    };

    // ==========================================
    // ROLE
    // ==========================================

    const rawRole =
        user?.role ||
        user?.authority ||
        user?.user?.role ||
        user?.user?.authority ||
        "";

    const role = rawRole
        .toString()
        .replace("ROLE_", "")
        .toUpperCase();

    const isAdmin = role === "ADMIN";
    const isCustomer = role === "CUSTOMER";

    console.log(
        "NAVBAR FINAL ROLE:",
        role
    );

    console.log(
        "NAVBAR IS ADMIN:",
        isAdmin
    );

    console.log(
        "NAVBAR IS CUSTOMER:",
        isCustomer
    );

    // ==========================================
    // CART COUNT
    // ==========================================

    const cartCount = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    // ==========================================
    // NAVIGATION
    // ==========================================

    const goTo = (path: string) => {
        navigate(path);

        setMenuOpen(false);
        setSearchOpen(false);
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        setMenuOpen(false);

        navigate("/login");

        window.dispatchEvent(
            new Event("userUpdated")
        );

        window.dispatchEvent(
            new Event("auth-changed")
        );
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        const value =
            searchText.trim();

        if (!value) {
            return;
        }

        navigate(
            `/products?search=${encodeURIComponent(
                value
            )}`
        );

        setSearchText("");
        setSearchOpen(false);
        setMenuOpen(false);
    };

    // ==========================================
    // ACTIVE MENU
    // ==========================================

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // ==========================================
    // DISPLAY LOCATION
    // ==========================================

    const locationText =
        deliveryLocation.postalCode
            ? `${deliveryLocation.city} ${deliveryLocation.postalCode}`
            : deliveryLocation.city;

    return (
        <header className="navbar">

            {/* ==================================
                LOGO
            ================================== */}

            <div
                className="navbar-logo"
                onClick={() => goTo("/")}
            >
                <div className="logo-icon">
                    <Package size={22} />
                </div>

                <span>E-Commerce</span>
            </div>

            {/* ==================================
                DESKTOP NAVIGATION
            ================================== */}

            <nav className="navbar-links">

                {/* PRODUCTS */}

                <button
                    className={`nav-item ${
                        isActive("/products")
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        goTo("/products")
                    }
                >
                    Products
                </button>

                {/* ==================================
                    ADMIN MENU
                ================================== */}

                {isAdmin && (
                    <>
                        <button
                            className={`nav-item ${
                                isActive(
                                    "/admin/subcategories"
                                )
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo(
                                    "/admin/subcategories"
                                )
                            }
                        >
                            <Layers size={17} />
                            Subcategories
                        </button>

                        <button
                            className={`nav-item ${
                                isActive(
                                    "/admin/users"
                                )
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo(
                                    "/admin/users"
                                )
                            }
                        >
                            <Users size={17} />
                            Users
                        </button>

                        <button
                            className={`nav-item ${
                                isActive(
                                    "/admin/inventory"
                                )
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo(
                                    "/admin/inventory"
                                )
                            }
                        >
                            <Warehouse size={17} />
                            Inventory
                        </button>

                        <button
                            className={`nav-item ${
                                isActive(
                                    "/admin/orders"
                                )
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo(
                                    "/admin/orders"
                                )
                            }
                        >
                            <ClipboardList
                                size={17}
                            />
                            Orders
                        </button>
                    </>
                )}

                {/* ==================================
                    CUSTOMER MENU
                ================================== */}

                {isCustomer && (
                    <>
                        <button
                            className={`nav-item ${
                                isActive("/orders")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo("/orders")
                            }
                        >
                            <Package size={17} />
                            My Orders
                        </button>

                        <button
                            className={`nav-item ${
                                isActive("/wishlist")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo("/wishlist")
                            }
                        >
                            <Heart size={17} />

                            Wishlist

                            {wishlist.length >
                                0 && (
                                    <span className="nav-count">
                                    {
                                        wishlist.length
                                    }
                                </span>
                                )}
                        </button>

                        <button
                            className={`nav-item ${
                                isActive("/cart")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                goTo("/cart")
                            }
                        >
                            <ShoppingCart
                                size={17}
                            />

                            Cart

                            {cartCount > 0 && (
                                <span className="nav-count">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </>
                )}
            </nav>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <div className="navbar-actions">

                {/* DELIVERY LOCATION */}

                <button
                    type="button"
                    className="delivery-location"
                    onClick={
                        getCurrentLocation
                    }
                    title="Click to detect your current location"
                >
                    <MapPin size={17} />

                    <div>
                        <small>
                            {locationLoading
                                ? "Detecting location..."
                                : "Deliver to"}
                        </small>

                        <span>
                            {locationText}
                        </span>

                        {locationError && (
                            <small
                                style={{
                                    color: "red",
                                    fontSize:
                                        "10px",
                                }}
                            >
                                {locationError}
                            </small>
                        )}
                    </div>
                </button>

                {/* SEARCH */}

                {searchOpen ? (
                    <form
                        className="navbar-search-form"
                        onSubmit={
                            handleSearch
                        }
                    >
                        <input
                            type="text"
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                            placeholder="Search products..."
                            autoFocus
                        />

                        <button
                            type="submit"
                            aria-label="Search"
                        >
                            <Search size={19} />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchOpen(
                                    false
                                );

                                setSearchText("");
                            }}
                            aria-label="Close search"
                        >
                            <X size={19} />
                        </button>
                    </form>
                ) : (
                    <button
                        className="icon-button"
                        onClick={() =>
                            setSearchOpen(true)
                        }
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>
                )}

                {/* DARK MODE */}

                <button
                    className="icon-button"
                    onClick={
                        toggleDarkMode
                    }
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

                {/* USER */}

                {user ? (
                    <div className="user-menu">

                        <button
                            className="user-button"
                            onClick={() =>
                                setMenuOpen(
                                    !menuOpen
                                )
                            }
                        >
                            <User size={19} />

                            <span>
                                {user.name ||
                                    user.email ||
                                    "User"}
                            </span>
                        </button>

                        {menuOpen && (
                            <div className="user-dropdown">

                                <div className="user-info">

                                    <User size={18} />

                                    <div>
                                        <strong>
                                            {user.name ||
                                                "User"}
                                        </strong>

                                        <small>
                                            {user.email}
                                        </small>

                                        <small>
                                            Role:{" "}
                                            {role ||
                                                "USER"}
                                        </small>
                                    </div>
                                </div>

                                <button
                                    onClick={
                                        handleLogout
                                    }
                                    className="logout-button"
                                >
                                    <LogOut
                                        size={17}
                                    />

                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="login-button"
                        onClick={() =>
                            goTo("/login")
                        }
                    >
                        Login
                    </button>
                )}

                {/* MOBILE MENU BUTTON */}

                <button
                    className="mobile-menu-button"
                    onClick={() =>
                        setMenuOpen(
                            !menuOpen
                        )
                    }
                    aria-label="Menu"
                >
                    {menuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </button>
            </div>

            {/* ==================================
                MOBILE MENU
            ================================== */}

            {menuOpen && (
                <div className="mobile-menu">

                    <button
                        className={
                            isActive(
                                "/products"
                            )
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            goTo("/products")
                        }
                    >
                        <Package size={18} />
                        Products
                    </button>

                    {/* ADMIN */}

                    {isAdmin && (
                        <>
                            <button
                                className={
                                    isActive(
                                        "/admin/subcategories"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo(
                                        "/admin/subcategories"
                                    )
                                }
                            >
                                <Layers size={18} />
                                Subcategories
                            </button>

                            <button
                                className={
                                    isActive(
                                        "/admin/users"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo(
                                        "/admin/users"
                                    )
                                }
                            >
                                <Users size={18} />
                                Users
                            </button>

                            <button
                                className={
                                    isActive(
                                        "/admin/inventory"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo(
                                        "/admin/inventory"
                                    )
                                }
                            >
                                <Warehouse
                                    size={18}
                                />
                                Inventory
                            </button>

                            <button
                                className={
                                    isActive(
                                        "/admin/orders"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo(
                                        "/admin/orders"
                                    )
                                }
                            >
                                <ClipboardList
                                    size={18}
                                />
                                Orders
                            </button>
                        </>
                    )}

                    {/* CUSTOMER */}

                    {isCustomer && (
                        <>
                            <button
                                className={
                                    isActive(
                                        "/orders"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo("/orders")
                                }
                            >
                                <Package size={18} />
                                My Orders
                            </button>

                            <button
                                className={
                                    isActive(
                                        "/wishlist"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo(
                                        "/wishlist"
                                    )
                                }
                            >
                                <Heart size={18} />

                                Wishlist

                                {wishlist.length >
                                    0 && (
                                        <span className="mobile-nav-count">
                                        {
                                            wishlist.length
                                        }
                                    </span>
                                    )}
                            </button>

                            <button
                                className={
                                    isActive(
                                        "/cart"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    goTo("/cart")
                                }
                            >
                                <ShoppingCart
                                    size={18}
                                />

                                Cart

                                {cartCount > 0 && (
                                    <span className="mobile-nav-count">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </>
                    )}

                    {/* MOBILE LOCATION */}

                    <button
                        type="button"
                        className="mobile-location"
                        onClick={
                            getCurrentLocation
                        }
                    >
                        <MapPin size={18} />

                        <div>
                            <small>
                                {locationLoading
                                    ? "Detecting location..."
                                    : "Deliver to"}
                            </small>

                            <span>
                                {locationText}
                            </span>

                            {locationError && (
                                <small
                                    style={{
                                        color: "red",
                                        fontSize:
                                            "10px",
                                    }}
                                >
                                    {locationError}
                                </small>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={
                            toggleDarkMode
                        }
                    >
                        {darkMode ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}

                        {darkMode
                            ? "Light Mode"
                            : "Dark Mode"}
                    </button>

                    {user && (
                        <button
                            onClick={
                                handleLogout
                            }
                            className="mobile-logout"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;