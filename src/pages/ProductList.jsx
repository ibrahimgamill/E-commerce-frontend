import "./ProductList.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

    export default function ProductList() {
    const { categoryId } = useParams();
    const { loading, error, data } = useQuery(GET_PRODUCTS, {
        variables: { category: (!categoryId || categoryId === "all") ? null : categoryId }
    });


    const { addToCart } = useCart();

    const handleQuickShop = (product) => {
        let defaultOptions = {};
        if (product.attributes && product.attributes.length > 0) {
            product.attributes.forEach(attr => {
                if (attr.items && attr.items.length > 0)
                    defaultOptions[attr.name] = attr.items[0].value; // Pick first value
            });
        }
        addToCart(product, defaultOptions);
    };

    if (loading) {
        return (
            <div style={{ margin: 32 }}>
                Loading…
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ color: "red", margin: 32 }}>
                Error loading products.
            </div>
        );
    }

        return (
            <div>
                <h2
                    style={{
                        margin: "32px 0 16px 0",
                        fontSize: "2rem",
                    }}
                >
                    {categoryId[0].toUpperCase() + categoryId.slice(1)} Products
                </h2>

                {/* Use the products-grid class instead of inline flex */}
                <div className="products-grid">
                    {(!data.products || data.products.length === 0) && (
                        <div>No products found.</div>
                    )}
                    {data.products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onQuickShop={handleQuickShop}
                        />
                    ))}
                </div>
            </div>
        );
    }