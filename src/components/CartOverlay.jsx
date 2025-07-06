// src/components/CartOverlay.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CartOverlay.css";
import { useCart } from "../context/CartContext";

export default function CartOverlay() {
    const {
        cartItems,
        increment,
        decrement,
        clearCart,
        isCartOpen,
        closeCart,
    } = useCart();

    // auto-close on route change
    const { pathname } = useLocation();
    useEffect(() => {
        if (isCartOpen) closeCart();
    }, [pathname, isCartOpen, closeCart]);

    // if closed, render nothing
    if (!isCartOpen) return null;

    const total = cartItems.reduce(
        (sum, item) => sum + (item.product.prices?.[0]?.amount || 0) * item.quantity,
        0
    );
    const itemCountText =
        cartItems.length === 1 ? "1 Item" : `${cartItems.length} Items`;

    return (
        <>
            {/* backdrop */}
            <div
                className="cart-overlay-bg"
                onClick={closeCart}
            />

            <aside
                data-testid="cart-overlay"
                className="cart-overlay"
                aria-hidden={false}
            >
                {/* header */}
                <div className="cart-overlay-header">
                    <strong style={{ fontSize: 20 }}>My Cart</strong>
                    <span style={{ marginLeft: 8, color: "#888" }}>
            {itemCountText}
          </span>
                    <button
                        className="cart-overlay-close"
                        onClick={closeCart}
                    >×</button>
                </div>

                {/* content */}
                <div className="cart-overlay-content">
                    {cartItems.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>
                            Your cart is empty.
                        </div>
                    ) : (
                        cartItems.map((item, i) => (
                            <div
                                key={item.product.id + "-" + i}
                                className="cart-overlay-item"
                                data-testid={`cart-item-attribute-${(
                                    item.product.attributes?.[0]?.name || "none"
                                )
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}-selected`}
                            >
                                <img
                                    src={item.product.gallery?.[0]}
                                    alt={item.product.name}
                                    className="cart-overlay-img"
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                                    <div style={{ color: "#888", fontSize: 13 }}>
                                        {item.product.brand}
                                    </div>
                                    {item.product.attributes?.map(attr => (
                                        <div key={attr.id} style={{ margin: "4px 0" }}>
                                            <small style={{ fontWeight: 600 }}>{attr.name}:</small>
                                            <span
                                                data-testid={`cart-item-attribute-${attr.name
                                                    .replace(/\s+/g, "-")
                                                    .toLowerCase()}-${attr.name
                                                    .replace(/\s+/g, "-")
                                                    .toLowerCase()}-selected`}
                                                style={{
                                                    marginLeft: 6,
                                                    padding: "2px 6px",
                                                    border: "1px solid #eee",
                                                    borderRadius: 4,
                                                    background: "#f5f5f5",
                                                    fontSize: 12,
                                                }}
                                            >
                        {item.options?.[attr.name] || attr.items[0].value}
                      </span>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 6, fontWeight: 600 }}>
                                        {item.product.prices?.[0]?.currency?.symbol || "$"}
                                        {(item.product.prices?.[0]?.amount || 0).toFixed(2)}
                                    </div>
                                </div>

                                <div style={{ textAlign: "center" }}>
                                    <button
                                        data-testid="cart-item-amount-increase"
                                        className="cart-overlay-qty-btn"
                                        onClick={() => increment(item.product, item.options)}
                                    >+</button>
                                    <div data-testid="cart-item-amount">{item.quantity}</div>
                                    <button
                                        data-testid="cart-item-amount-decrease"
                                        className="cart-overlay-qty-btn"
                                        onClick={() => decrement(item.product, item.options)}
                                    >–</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* footer */}
                <div className="cart-overlay-footer">
                    <strong>Total:</strong>
                    <span data-testid="cart-total" style={{ marginLeft: 8 }}>
            ${total.toFixed(2)}
          </span>
                </div>

                {/* order button */}
                <button
                    className="cart-overlay-order-btn"
                    onClick={() => {
                        clearCart();
                        closeCart();
                        alert("Order placed!");
                    }}
                    disabled={cartItems.length === 0}
                >
                    Place Order
                </button>
            </aside>
        </>
    );
}
