import "./Header.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { useCart } from "../context/CartContext";


export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);       // ← define BOTH menuOpen and setMenuOpen
    const location = useLocation();

    const { loading, error, data } = useQuery(GET_CATEGORIES);
    const fetched = data && Array.isArray(data.categories) ? data.categories : [];
    const categories = [{ name: "all" }, ...fetched];

    const { cartItems = [], isCartOpen, openCart, closeCart } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // toggle the mobile menu
    const toggleMenu = () => setMenuOpen(prev => !prev);

    // any time we navigate, close the mobile menu
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // toggle the cart overlay
    const handleCartClick = () => {
        isCartOpen ? closeCart() : openCart();
    };

    return (
        <header
            className={menuOpen ? "menu-open" : ""}
            style={{ position: "relative", zIndex: 2000 }}
        >
            {/* Hamburger button: only visible via CSS on small screens */}
            <button
                className="hamburger-btn"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            <nav>
                {loading && <span>Loading…</span>}
                {!loading &&
                    !error &&
                    categories.map(cat => {
                        const isActive = cat.name === (location.pathname.split("/")[1] || "all");
                        return (
                            <Link
                                key={cat.name}
                                to={cat.name === "all" ? "/all" : `/${cat.name}`}
                                className={`nav-link${isActive ? " active" : ""}`}
                                data-testid={
                                    isActive ? "active-category-link" : "category-link"
                                }
                            >
                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                            </Link>
                        );
                    })}
            </nav>

            <button
                className="cart-btn"
                data-testid="cart-btn"
                aria-label="Toggle cart"
                onClick={handleCartClick}
            >
                🛒
                {totalItems > 0 && <span className="cart-bubble">{totalItems}</span>}
            </button>
        </header>
    );
}
