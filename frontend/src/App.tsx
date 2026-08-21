import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Wishlist from "./pages/Wishlist";

import { WishlistProvider } from "./context/WishlistContext";


function App() {

    return (

        <WishlistProvider>

            <Navbar />

            <Routes>

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

            </Routes>

        </WishlistProvider>

    );

}

export default App;