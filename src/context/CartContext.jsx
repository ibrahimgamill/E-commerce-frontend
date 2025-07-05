// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * @typedef {Object} CartContextType
 * @property {Array<any>} cartItems
 * @property {(product:any, options?:object)=>void} addToCart
 * @property {(product:any, options?:object)=>void} increment
 * @property {(product:any, options?:object)=>void} decrement
 * @property {()=>void} clearCart
 * @property {boolean} isCartOpen
 * @property {()=>void} openCart
 * @property {()=>void} closeCart
 */

/** @type {CartContextType} */
const defaultValue = {
    cartItems: [],
    addToCart: () => {},
    increment: () => {},
    decrement: () => {},
    clearCart: () => {},
    isCartOpen: false,
    openCart: () => {},
    closeCart: () => {},
};

const CartContext = createContext(defaultValue);

const CART_STORAGE_KEY = "ecommerce_cart";

export function CartProvider({ children }) {
    // existing cartItems + persistence
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

    // overlay open/close
    const [isCartOpen, setCartOpen] = useState(false);
    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);

    // add/inc/dec/clear
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
        openCart();
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
