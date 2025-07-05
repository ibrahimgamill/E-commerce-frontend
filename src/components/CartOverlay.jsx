import React from "react";
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

    // compute total, count text
    const total = cartItems.reduce(
        (sum, item) => sum + (item.product.prices?.[0]?.amount || 0) * item.quantity,
        0
    );
    const itemCountText =
        cartItems.length === 1 ? "1 Item" : `${cartItems.length} Items`;

    return (
        <>
            {isCartOpen && (
                <div className="cart-overlay-bg" onClick={closeCart} />
            )}
            {isCartOpen && (
                <aside
                    data-testid="cart-overlay"
                    className="cart-overlay"
                    style={{ transform: "translateX(0)", pointerEvents: "auto" }}
                    aria-hidden={false}
                >
                    <div className="cart-overlay-header">
                        <span style={{ fontWeight: 700, fontSize: 20 }}>My Cart</span>
                        <span style={{ color: "#888", fontSize: 15, marginLeft: 9 }}>
              {itemCountText}
            </span>
                        <button
                            className="cart-overlay-close"
                            onClick={closeCart}
                        >
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
                                    data-testid={`cart-item-attribute-${(item.product.attributes?.[0]?.name || "none")
                                        .replace(/\s+/g, "-")
                                        .toLowerCase()}`}
                                >
                                    {/* the rest of your existing item markup */}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="cart-overlay-footer">
                        <span style={{ fontWeight: 600, fontSize: 16 }}>Total:</span>
                        <span
                            style={{ fontWeight: 700, fontSize: 18, marginLeft: 10 }}
                            data-testid="cart-total"
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
            )}
        </>
    );
}
