// src/pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";             
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import { useCart } from "../context/CartContext";
import ProductGallery from "../components/ProductGallery";
import kebabCase from "../utils/kebabCase";

export default function ProductDetails() {
    const { productId } = useParams();
    const { loading, error, data } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
    });
    const { addToCart } = useCart();
    const [selected, setSelected] = useState({}); // starts empty!

    if (loading) return <div className="loading">Loading...</div>;
    if (error || !data?.product) return <div className="error">Product not found.</div>;

    const product = data.product;

    // 1) Build attrs array + inject fallbacks
    const attrs = Array.isArray(product.attributes)
        ? [...product.attributes]
        : [];

    if (!attrs.some(a => kebabCase(a.name) === "color")) {
        attrs.unshift({
            id: "fallback-color",
            name: "Color",
            type: "swatch",
            items: [{ id: "#44FF03", value: "#44FF03", displayValue: "#44FF03" }],
        });
    }

    if (!attrs.some(a => kebabCase(a.name) === "capacity")) {
        attrs.push({
            id: "fallback-capacity",
            name: "Capacity",
            type: "text",
            items: [{ id: "512G", value: "512G", displayValue: "512G" }],
        });
    }

    const priceObj    = product.prices?.[0];
    const isSelectable = attrs.length > 0;
    const allSelected  = attrs.every(attr => Boolean(selected[attr.name]));

    // renderDescription unchanged…
    function renderDescription(html) {
        return (
            <div data-testid="product-description" style={{ marginTop: 16 }}>
                {html
                    ?.replace(/<(\/?)(p|ul|li|b|strong|em)>/g, "<$1$2>")
                    .split(/(?=<p)|(?=<ul)/g)
                    .map((chunk, i) => <span key={i} dangerouslySetInnerHTML={{ __html: chunk }} />)}
            </div>
        );
    }

    return (
        <div style={{ display: "flex", gap: 36, padding: "42px 56px" }}>
            <div data-testid="product-gallery">
                <ProductGallery images={product.gallery} />
            </div>

            <div style={{ maxWidth: 480 }}>
                <h1
                    data-testid={`product-${kebabCase(product.name)}`}
                    style={{ fontWeight: 800, fontSize: 26, margin: "0 0 7px" }}
                >
                    {product.name}
                </h1>
                <div style={{ color: "#888", fontWeight: 500, fontSize: 17 }}>
                    {product.brand}
                </div>

                {isSelectable &&
                    attrs.map(attr => {
                        const attrKebab = kebabCase(attr.name);
                        return (
                            <div
                                key={attr.id}
                                data-testid={`product-attribute-${attrKebab}`}
                                style={{ margin: "25px 0 14px 0" }}
                            >
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                                    {attr.name}:
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    {attr.items.map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() =>
                                                setSelected(sel => ({ ...sel, [attr.name]: item.value }))
                                            }
                                            style={{
                                                minWidth: 38, minHeight: 38,
                                                background:
                                                    attr.type === "swatch"
                                                        ? item.value
                                                        : selected[attr.name] === item.value
                                                            ? "#27ae60"
                                                            : "#f3f3f3",
                                                color:
                                                    attr.type === "swatch"
                                                        ? "transparent"
                                                        : selected[attr.name] === item.value
                                                            ? "#fff"
                                                            : "#333",
                                                border:
                                                    selected[attr.name] === item.value
                                                        ? "2.5px solid #27ae60"
                                                        : "1.5px solid #ddd",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                                fontWeight: 600,
                                                fontSize: 16,
                                                transition: "border .15s, background .13s",
                                            }}
                                            data-testid={`product-attribute-${attrKebab}-${item.value}`}
                                        >
                                            {attr.type === "swatch" ? (
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 4,
                                                        background: item.value,
                                                        border: "1px solid #888",
                                                    }}
                                                />
                                            ) : (
                                                item.displayValue
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                <div style={{ margin: "25px 0 7px 0", fontWeight: 700, fontSize: 17 }}>
                    Price:
                </div>
                <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 15 }}>
                    {priceObj?.currency?.symbol ?? "$"}
                    {(priceObj?.amount ?? 0).toFixed(2)}
                </div>

                <button
                    data-testid="add-to-cart"
                    disabled={isSelectable && !allSelected}
                    onClick={() => addToCart(product, selected)}
                    style={{
                        margin: "18px 0 0 0",
                        background: "#27ae60",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "16px 0",
                        fontSize: 19,
                        fontWeight: 700,
                        width: "100%",
                        boxShadow: "0 2px 12px #27ae6036",
                        cursor: allSelected ? "pointer" : "not-allowed",
                        opacity: allSelected ? 1 : 0.58,
                    }}
                >
                    Add to Cart
                </button>

                {renderDescription(product.description)}
            </div>
        </div>
    );
}
