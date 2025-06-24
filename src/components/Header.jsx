// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';
import { useCart } from '../context/CartContext';

export default function Header({ onCartClick }) {
    const location = useLocation();
    const parts = location.pathname.split('/');
    // if URL is /category/whatever, take whatever, else default to 'all'
    const activeCategory =
        parts[1] === 'category' && parts[2] ? parts[2] : 'all';

    const { loading, error, data } = useQuery(GET_CATEGORIES);
    // grab fetched categories or empty array
    const fetched = data && data.categories ? data.categories : [];
    // always start with the “all” tab
    const categories = [{ name: 'all' }, ...fetched];

    const { cartItems = [] } = useCart();
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <header>
            <nav>
                {loading && <span>Loading…</span>}
                {!loading && !error && categories.map(cat => {
                    const isActive = cat.name === activeCategory;
                    return (
                        <Link
                            key={cat.name}
                            to={`/category/${cat.name}`}
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
