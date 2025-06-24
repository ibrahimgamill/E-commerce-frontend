import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";

export default function ProductDetails() {
    const { productId } = useParams();
    const { loading, error, data } = useQuery(
        GET_PRODUCT_BY_ID,
        { variables: { id: productId } }
    );

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error loading product</p>;
    if (!data || !data.product) return <p>Product not found</p>;

    const p = data.product;

    return (
        <div className="product-detail">
            <h1 data-testid="product-title">{p.name}</h1>
            <div className="gallery">
                {p.gallery.map((url, i) => (
                    <img key={i} src={url} alt={p.name} />
                ))}
            </div>
            <p>{p.description}</p>
            <p>
                <strong>Brand:</strong> {p.brand}
            </p>
            <p>
                <strong>Price:</strong> {p.prices[0].currency.symbol}{p.prices[0].amount}
            </p>
            <p>
                <strong>In Stock:</strong> {p.inStock ? "Yes" : "No"}
            </p>
            {/* Example Add to Cart button, optional */}
            {/* <button disabled={!p.inStock} onClick={() => addToCart(p.id)}>
                Add to Cart
            </button> */}
            {/* Render attributes if needed */}
            {p.attributes && p.attributes.length > 0 && (
                <div>
                    <strong>Attributes:</strong>
                    <ul>
                        {p.attributes.map(attr => (
                            <li key={attr.id}>
                                {attr.name}:{" "}
                                {attr.items.map(item => item.displayValue).join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
