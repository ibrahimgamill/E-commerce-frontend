import { Link } from "react-router-dom";
import kebabCase from "../utils/kebabCase";

export default function ProductCard({ product, onQuickShop }) {
    return (
        <Link
            to={`/product/${product.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div
                className={`product-card${!product.inStock ? " out-of-stock" : ""}`}
                style={{ position: "relative" }}
                data-testid={`product-${kebabCase(product.name)}`}
            >
                <img
                    src={product.gallery[0]}
                    alt={product.name}
                    style={{
                        width: "100%",
                        height: 210,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #e5e5e5",
                        background: "#fafafa"
                    }}
                />
                {!product.inStock && (
                    <div className="out-of-stock-banner">
                        Out of Stock
                    </div>
                )}
                <div className="product-name">{product.name}</div>
                <div className="product-price">
                    {product.prices[0]?.currency?.symbol} {product.prices[0]?.amount}
                </div>
                <div className="product-brand">{product.brand}</div>
                {product.inStock && (
                    <button
                        className="quick-shop-btn"
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onQuickShop(product);
                        }}
                        title="Quick Shop"
                    >
                        🛒
                    </button>
                )}
            </div>
        </Link>
    );
}
