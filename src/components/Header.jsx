import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { useCart } from "../context/CartContext";

export default function Header({ onCartClick }) {
    const location = useLocation();
    // e.g. location.pathname = "/clothes" or "/all"
    const activeCategory = location.pathname.split("/")[1] || "all";

    const { loading, error, data } = useQuery(GET_CATEGORIES);

    let categories = [];
    if (data && Array.isArray(data.categories)) {
        // prepend the special "all" category
        categories = [{ name: "all" }, ...data.categories];
    }

    const { cartItems = [] } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header>
            <nav>
                {loading && <span>Loading…</span>}
                {!loading &&
                    !error &&
                    categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/${cat.name}`}
                            className={`nav-link${
                                activeCategory === cat.name ? " active" : ""
                            }`}
                            data-testid={
                                activeCategory === cat.name
                                    ? "active-category-link"
                                    : "category-link"
                            }
                        >
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                        </Link>
                    ))}
            </nav>
            <button
                className="cart-btn"
                data-testid="cart-btn"
                onClick={onCartClick}
            >
                🛒
                {totalItems > 0 && <span className="cart-bubble">{totalItems}</span>}
            </button>
        </header>
    );
}
