import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";

export default function ProductDetails() {
    const { productId } = useParams();           // e.g. "apple-iphone-12-pro"
    const { loading, error, data } = useQuery(
        GET_PRODUCT_BY_ID,
        { variables: { id: productId } }
    );

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error loading product</p>;

    const p = data.product;
    return (
        <div className="product-detail">
            <h1 data-testid="product-title">{p.name}</h1>
            <div className="gallery">
                {p.gallery.map((url,i) => (
                    <img key={i} src={url} alt={p.name} />
                ))}
            </div>
            <p>{p.description}</p>
            {/* …and so on… */}
        </div>
    );
}
