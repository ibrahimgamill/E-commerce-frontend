import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "ecommerce_cart";

export function CartProvider({ children }) {
    // Initialize from localStorage or default to empty
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    // Add, increment, decrement, clear logic (unchanged)
    const addToCart = (product, options = {}) => {
        setCartItems(items => {
            const idx = items.findIndex(
                it => it.product.id === product.id &&
                    JSON.stringify(it.options) === JSON.stringify(options)
            );
            if (idx > -1) {
                const newItems = [...items];
                newItems[idx].quantity += 1;
                return newItems;
            } else {
                return [...items, { product, options, quantity: 1 }];
            }
        });
    };

    const increment = (product, options = {}) => addToCart(product, options);

    const decrement = (product, options = {}) => {
        setCartItems(items => {
            const idx = items.findIndex(
                it => it.product.id === product.id &&
                    JSON.stringify(it.options) === JSON.stringify(options)
            );
            if (idx > -1) {
                const newItems = [...items];
                if (newItems[idx].quantity > 1) {
                    newItems[idx].quantity -= 1;
                } else {
                    newItems.splice(idx, 1);
                }
                return newItems;
            }
            return items;
        });
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, increment, decrement, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
