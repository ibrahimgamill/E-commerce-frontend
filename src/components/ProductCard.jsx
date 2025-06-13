import { Link } from "react-router-dom";

export default function ProductCard({ product, onQuickShop }) {
    return (
        <Link
            to={`/product/${product.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div
                className={`product-card${!product.inStock ? " out-of-stock" : ""}`}
                style={{ position: "relative" }}
            >
                <img
                    src={product.gallery[0]}
                    alt={product.name}
                    style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
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
                {/* Quick Shop button: only show if in stock */}
                {product.inStock && (
                    <button
                        className="quick-shop-btn"
                        onClick={e => {
                            e.preventDefault();  // <-- Prevent Link navigation on button click
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
