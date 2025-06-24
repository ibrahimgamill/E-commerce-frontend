// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';
import { useCart } from '../context/CartContext';

export default function Header({ onCartClick }) {
    const location = useLocation();
    const parts = location.pathname.split('/');
    const activeCategory = parts[1] === 'category' && parts[2] ? parts[2] : 'all';

    const { loading, error, data } = useQuery(GET_CATEGORIES);
    const fetched = data && Array.isArray(data.categories) ? data.categories : [];
    const categories = [{ name: 'all' }, ...fetched];

    const { cartItems = [] } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header>
            <nav>
                {loading && <span>Loading…</span>}
                {!loading &&
                    !error &&
                    categories.map((cat) => {
                        const isActive = cat.name === activeCategory;
                        return (
                            <Link
                                key={cat.name}
                                to={cat.name === "all" ? "/all" : `/category/${cat.name}`}
                                className={`nav-link${isActive ? ' active' : ''}`}
                                data-testid={isActive ? 'active-category-link' : 'category-link'}
                            >
                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
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
