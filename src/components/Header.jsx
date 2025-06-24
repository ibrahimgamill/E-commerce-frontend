// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';
import { useCart } from '../context/CartContext';

export default function Header({ onCartClick }) {
    const location = useLocation();
    // get the part after /category/, or default to 'all'
    const activeCategory = location.pathname.startsWith('/category/')
        ? location.pathname.split('/')[2]
        : 'all';

    const { loading, error, data } = useQuery(GET_CATEGORIES);

    // build nav list: always start with all, then fetched categories
    const categories = [{ name: 'all' }, ...(data?.categories || [])];

    const { cartItems = [] } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header>
            <nav>
                {loading && <span>Loading...</span>}
                {!loading && !error && categories.map(cat => {
                    const name = cat.name;
                    const path = `/category/${name}`;
                    const isActive = name === activeCategory;

                    return (
                        <Link
                            key={name}
                            to={path}
                            className={`nav-link${isActive ? ' active' : ''}`}
                            data-testid={isActive ? 'active-category-link' : 'category-link'}
                        >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
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
                    <span className="cart-bubble">
            {totalItems}
          </span>
                )}
            </button>
        </header>
    );
}
