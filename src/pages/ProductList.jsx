import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
export default function ProductList() {
    const { categoryId } = useParams();
    const variables = {};
    if (categoryId && categoryId !== "all") {
        variables.category = categoryId;
    }

    const { loading, error, data } = useQuery(GET_PRODUCTS, { variables });
    const { addToCart } = useCart();

    const handleQuickShop = (product) => {
        // Pick default options if product has attributes:
        let defaultOptions = {};
        if (product.attributes && product.attributes.length > 0) {
            product.attributes.forEach(attr => {
                if (attr.items && attr.items.length > 0)
                    defaultOptions[attr.name] = attr.items[0].value; // Pick first value
            });
        }
        addToCart(product, defaultOptions);
    };

    if (loading) return <div style={{ margin: 32 }}>Loading...</div>;
    if (error) return <div style={{ margin: 32, color: "red" }}>Error loading products.</div>;

    return (
        <div>
            <h2 style={{ margin: "32px 0 16px", fontSize: "2rem" }}>
                {categoryId[0].toUpperCase() + categoryId.slice(1)} Products
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {(!data.products || !data.products.length)
                    ? <div>No products found.</div>
                    : data.products.map(p => (
                        <ProductCard key={p.id} product={p} onQuickShop={handleQuickShop} />
                    ))
                }
            </div>
        </div>
    );
}
