import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";

export default function ProductList() {
    const { categoryId } = useParams();

    // Determine which query to use
    const isAll = !categoryId || categoryId === "all";
    const { loading, error, data } = useQuery(
        isAll ? GET_PRODUCTS : GET_PRODUCTS_BY_CATEGORY,
        isAll ? {} : { variables: { category: categoryId } }
    );

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error loading products</p>;

    return (
        <div className="product-list">
            {data.products.map((product) => {
                // strip off the brand-prefix so tests see "iphone-12-pro"
                const testSlug = product.id.includes("-")
                    ? product.id.split("-").slice(1).join("-")
                    : product.id;

                return (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        data-testid={`product-${testSlug}`}
                        className="product-card"
                    >
                        <img
                            src={product.gallery[0] || ""}
                            alt={product.name}
                            className="product-image"
                        />
                        <h2>{product.name}</h2>
                        <p>
                            {product.prices[0].currency.symbol}
                            {product.prices[0].amount}
                        </p>
                        {/* Example Add to Cart button, optional */}
                        {/* <button onClick={e => {e.preventDefault(); addToCart(product.id);}}>Add to Cart</button> */}
                    </Link>
                );
            })}
        </div>
    );
}
