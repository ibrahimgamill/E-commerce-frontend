// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { useCart } from "../context/CartContext";

export default function Header({ onCartClick }) {
    const location = useLocation();
    // If there’s no segment, default to "all"
    const activeCategory = location.pathname.split("/")[2] || "all";

    const { loading, error, data } = useQuery(GET_CATEGORIES);
    // always start with the "all" pseudo‐category
    let categories = [{ name: "all" }];
    if (data?.categories) {
        // then append real ones (skip any literal "all" from the API)
        categories = categories.concat(data.categories.filter(c => c.name !== "all"));
    }

    const { cartItems = [] } = useCart();
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <header>
            <nav>
                {loading && <span>Loading…</span>}
                {!loading && !error && categories.map(cat => {
                    const isActive = activeCategory === cat.name;
                    return (
                        <Link
                            key={cat.name}
                            to={`/category/${cat.name}`}
                            className={`nav-link${isActive ? " active" : ""}`}
                            data-testid={isActive ? "active-category-link" : "category-link"}
                        >
                            {cat.name[0].toUpperCase() + cat.name.slice(1)}
                        </Link>
                    );
                })}
            </nav>
            <button
                className="cart-btn"
                data-testid="cart-btn"
                onClick={onCartClick}
            >
                🛒
                {totalItems > 0 && (
                    <span className="cart-bubble">{totalItems}</span>
                )}
            </button>
        </header>
    );
}
