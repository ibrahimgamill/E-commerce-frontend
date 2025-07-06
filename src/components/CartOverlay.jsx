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
    // 1) whenever the route changes, auto-close the overlay
    const { pathname } = useLocation();
    useEffect(() => {
        if (isCartOpen) closeCart();
    }, [pathname, isCartOpen, closeCart]);

    // 2) if it’s closed, render nothing
    if (!isCartOpen) return null;

    const total = cartItems.reduce(
        (sum, item) => sum + (item.product.prices?.[0]?.amount || 0) * item.quantity,
        0
    );
    const itemCountText =
        cartItems.length === 1 ? "1 Item" : `${cartItems.length} Items`;

    return (
        <>
            <div className="cart-overlay-bg" onClick={closeCart} />

            <aside
                data-testid="cart-overlay"
                className="cart-overlay"
                aria-hidden={false}
                style={{ transform: "translateX(0)", pointerEvents: "auto" }}
            >
                <div className="cart-overlay-header">
                    <span style={{ fontWeight: 700, fontSize: 20 }}>My Cart</span>
                    <span style={{ color: "#888", fontSize: 15, marginLeft: 9 }}>
            {itemCountText}
          </span>
                    <button className="cart-overlay-close" onClick={closeCart}>
                        ×
                    </button>
                </div>

                <div className="cart-overlay-content">
                    {cartItems.length === 0 ? (
                        <div style={{ padding: "38px 0", textAlign: "center", color: "#aaa" }}>
                            Your cart is empty.
                        </div>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div
                                key={`${item.product.id}-${idx}`}
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
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                                        {item.product.name}
                                    </div>
                                    <div
                                        style={{ color: "#888", fontSize: 13, margin: "1px 0 6px 0" }}
                                    >
                                        {item.product.brand}
                                    </div>
                                    {item.product.attributes?.length > 0 && (
                                        <div style={{ margin: "2px 0" }}>
                                            {item.product.attributes.map(attr => (
                                                <div key={attr.name} style={{ marginBottom: 2 }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>
                            {attr.name}:
                          </span>
                                                    <span
                                                        data-testid={`cart-item-attribute-${attr.name
                                                            .replace(/\s+/g, "-")
                                                            .toLowerCase()}-${attr.name
                                                            .replace(/\s+/g, "-")
                                                            .toLowerCase()}-selected`}
                                                        style={{
                                                            marginLeft: 7,
                                                            fontSize: 13,
                                                            color: "#222",
                                                            border: "1px solid #eee",
                                                            padding: "1px 8px",
                                                            borderRadius: 4,
                                                            background: "#f5f5f5",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                            {item.options?.[attr.name] || attr.items[0]?.value}
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{ fontWeight: 600, fontSize: 15, marginTop: 6 }}>
                                        {item.product.prices?.[0]?.currency?.symbol || "$"}
                                        {(item.product.prices?.[0]?.amount || 0).toFixed(2)}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 8,
                                        marginLeft: 8,
                                    }}
                                >
                                    <button
                                        data-testid="cart-item-amount-increase"
                                        className="cart-overlay-qty-btn"
                                        onClick={() => increment(item.product, item.options)}
                                    >
                                        +
                                    </button>
                                    <span
                                        data-testid="cart-item-amount"
                                        style={{ fontWeight: 600, fontSize: 15 }}
                                    >
                    {item.quantity}
                  </span>
                                    <button
                                        data-testid="cart-item-amount-decrease"
                                        className="cart-overlay-qty-btn"
                                        onClick={() => decrement(item.product, item.options)}
                                    >
                                        –
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-overlay-footer">
                    <span style={{ fontWeight: 600, fontSize: 16 }}>Total:</span>
                    <span
                        data-testid="cart-total"
                        style={{ fontWeight: 700, fontSize: 18, marginLeft: 10 }}
                    >
            ${total.toFixed(2)}
          </span>
                </div>

                <button
                    className="cart-overlay-order-btn"
                    onClick={() => {
                        clearCart();
                        closeCart();
                        alert("Order placed!");
                    }}
                    disabled={cartItems.length === 0}
                    style={{
                        opacity: cartItems.length === 0 ? 0.5 : 1,
                        cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    Place Order
                </button>
            </aside>
        </>
    );
}
