import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { useCart } from "../context/CartContext";

export default function Header({onCartClick}) {
    const location = useLocation();
    const activeCategory = location.pathname.split("/")[2] || "";
    const { loading, error, data } = useQuery(GET_CATEGORIES);

    // Filter out "all" category if present
    let categories = [];
    if (data && data.categories) {
        categories = data.categories.filter(cat => cat.name !== "all");
    }

    // Cart context for count
    const { cartItems = [] } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header>
            <nav>
                {loading && <span>Loading...</span>}
                {!loading && !error && categories.map(cat => (
                    <Link
                        key={cat.name}
                        to={`/category/${cat.name}`}
                        className={`nav-link${activeCategory === cat.name ? " active" : ""}`}
                        data-testid={activeCategory === cat.name ? "active-category-link" : "category-link"}
                    >
                        {cat.name[0].toUpperCase() + cat.name.slice(1)}
                    </Link>
                ))}
            </nav>
            <button className="cart-btn" data-testid="cart-btn" onClick={onCartClick}>
                🛒
                {totalItems > 0 && (
                    <span className="cart-bubble">
                        {totalItems}
                    </span>
                )}
            </button>
        </header>

    );
}
