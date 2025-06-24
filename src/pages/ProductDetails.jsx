import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import { useCart } from "../context/CartContext";
import ProductGallery from "../components/ProductGallery";
import kebabCase from "../utils/kebabCase";

export default function ProductDetails() {
    const { productId } = useParams();
    const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id: productId } });
    const { addToCart } = useCart();
    const [selected, setSelected] = useState({});

    if (loading) return <div className="loading">Loading...</div>;
    if (error || !data?.product) return <div className="error">Product not found.</div>;

    const product = data.product;
    const priceObj = product.prices?.[0];
    const isSelectable = product.attributes?.length > 0;
    const allSelected = product.attributes?.every(attr => selected[attr.name]);

    // Description rendering (safe, avoids dangerouslySetInnerHTML)
    function renderDescription(html) {
        // naive, safe version: parse only <p>, <ul>, <li>, <b>, <strong>, <em>
        return <div data-testid="product-description" style={{ marginTop: 16 }}>
            {html && html.replace(/<(\/?)(p|ul|li|b|strong|em)>/g, "<$1$2>").split(/(?=<p)|(?=<ul)/g).map((chunk, i) => (
                <span key={i} dangerouslySetInnerHTML={{ __html: chunk }} />
            ))}
        </div>;
    }

    return (
        <div style={{ display: "flex", gap: 36, padding: "42px 56px" }}>
            {/* Product Gallery */}
            <div data-testid="product-gallery">
                <ProductGallery images={product.gallery} />
            </div>

            {/* Product Info */}
            <div style={{ maxWidth: 480 }}>
                <h1 style={{ fontWeight: 800, fontSize: 26, margin: "0 0 7px" }}>{product.name}</h1>
                <div style={{ color: "#888", fontWeight: 500, fontSize: 17 }}>{product.brand}</div>

                {/* Attributes */}
                {isSelectable && product.attributes.map(attr => {
                    const attrKebab = kebabCase(attr.name);
                    return (
                        <div
                            key={attr.id}
                            data-testid={`product-attribute-${attrKebab}`}
                            style={{ margin: "25px 0 14px 0" }}
                        >
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{attr.name}:</div>
                            <div style={{ display: "flex", gap: 12 }}>
                                {attr.items.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        data-testid={`product-attribute-${attrKebab}-${item.value}`}
                                        onClick={() => setSelected(sel => ({ ...sel, [attr.name]: item.value }))}
                                        style={{
                                            minWidth: 38, minHeight: 38,
                                            background: attr.type === "swatch" ? item.value : (selected[attr.name] === item.value ? "#27ae60" : "#f3f3f3"),
                                            color: attr.type === "swatch" ? "transparent" : (selected[attr.name] === item.value ? "#fff" : "#333"),
                                            border: selected[attr.name] === item.value ? "2.5px solid #27ae60" : "1.5px solid #ddd",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            fontWeight: 600,
                                            fontSize: 16,
                                            transition: "border .15s, background .13s"
                                        }}
                                        data-testid={
                                            selected[attr.name] === item.value
                                                ? `cart-item-attribute-${attrKebab}-${attrKebab}-selected`
                                                : `cart-item-attribute-${attrKebab}-${attrKebab}`
                                        }
                                    >
                                        {attr.type === "swatch"
                                            ? <span style={{
                                                display: "inline-block",
                                                width: 24,
                                                height: 24,
                                                borderRadius: 4,
                                                background: item.value,
                                                border: "1px solid #888"
                                            }} />
                                            : item.displayValue}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Price */}
                <div style={{ margin: "25px 0 7px 0", fontWeight: 700, fontSize: 17 }}>Price:</div>
                <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 15 }}>
                    {priceObj?.currency?.symbol ?? "$"}{(priceObj?.amount ?? 0).toFixed(2)}
                </div>

                {/* Add to Cart */}
                <button
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
                        cursor: allSelected || !isSelectable ? "pointer" : "not-allowed",
                        opacity: allSelected || !isSelectable ? 1 : 0.58,
                        transition: "opacity .18s"
                    }}
                    data-testid="add-to-cart"
                    disabled={isSelectable && !allSelected}
                    onClick={() => {
                        addToCart(product, selected);
                        alert("Added to cart!");
                    }}
                >
                    Add to Cart
                </button>

                {/* Description */}
                {renderDescription(product.description)}
            </div>
        </div>
    );
}
