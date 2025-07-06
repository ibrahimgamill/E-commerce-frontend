import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const CART_STORAGE_KEY = "ecommerce_cart";

    // 1) Cart items + localStorage persistence
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    // 2) Overlay open/close state
    const [isCartOpen, setCartOpen] = useState(false);
    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);

    // 3) Add / increment / decrement / clear
    const addToCart = (product, options = {}) => {
        setCartItems(items => {
            const idx = items.findIndex(
                it =>
                    it.product.id === product.id &&
                    JSON.stringify(it.options) === JSON.stringify(options)
            );
            if (idx > -1) {
                const copy = [...items];
                copy[idx].quantity += 1;
                return copy;
            }
            return [...items, { product, options, quantity: 1 }];
        });
        openCart(); // open overlay when an item is added
    };
    const increment = (p, opts = {}) => addToCart(p, opts);
    const decrement = (product, options = {}) => {
        setCartItems(items => {
            const idx = items.findIndex(
                it =>
                    it.product.id === product.id &&
                    JSON.stringify(it.options) === JSON.stringify(options)
            );
            if (idx > -1) {
                const copy = [...items];
                if (copy[idx].quantity > 1) {
                    copy[idx].quantity -= 1;
                } else {
                    copy.splice(idx, 1);
                }
                return copy;
            }
            return items;
        });
    };
    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increment,
                decrement,
                clearCart,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
