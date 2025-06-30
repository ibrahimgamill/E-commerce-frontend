import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const CART_STORAGE_KEY = "ecommerce_cart";

export function CartProvider({ children }) {
    // existing cartItems state & persistence
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

    // ─── NEW: overlay open/close state ─────────────────────────────
    const [isCartOpen, setCartOpen] = useState(false);
    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);
    // ────────────────────────────────────────────────────────────────

    // Add to cart (unchanged), but call openCart() afterward
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
        openCart();  // ← open overlay when an item is added
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
            cartItems,
            addToCart,
            increment,
            decrement,
            clearCart,
            // ─── expose the new overlay state and closer ───
            isCartOpen,
            closeCart
            // ───────────────────────────────────────────────
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
