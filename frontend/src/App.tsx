import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SupportChatbot from "./components/SupportChatbot";

import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

function App() {
    return (
        <CartProvider>
            <WishlistProvider>

                <Navbar />

                <Routes>

                    {/* ========================= */}
                    {/* PUBLIC / CUSTOMER ROUTES */}
                    {/* ========================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/home"
                        element={<Home />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/subcategories"
                        element={<SubCategories />}
                    />

                    <Route
                        path="/users"
                        element={<Users />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />

                    <Route
                        path="/orders"
                        element={<MyOrders />}
                    />

                    {/* ========================= */}
                    {/* ADMIN ROUTES */}
                    {/* ========================= */}

                    <Route
                        path="/admin/subcategories"
                        element={<SubCategories />}
                    />

                    <Route
                        path="/admin/users"
                        element={<Users />}
                    />

                    <Route
                        path="/admin/inventory"
                        element={<Inventory />}
                    />

                    <Route
                        path="/admin/orders"
                        element={<Orders />}
                    />

                </Routes>

                {/* ========================= */}
                {/* SUPPORT CHATBOT */}
                {/* ========================= */}

                <SupportChatbot />

            </WishlistProvider>
        </CartProvider>
    );
}

export default App;