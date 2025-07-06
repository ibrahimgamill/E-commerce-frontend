import React, { useEffect } from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import { CartProvider, useCart } from "./context/CartContext";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    cache: new InMemoryCache(),
});

// Closes the cart overlay on every route change
function RouteWatcher() {
    const { closeCart } = useCart();
    const { pathname } = useLocation();
    useEffect(() => {
        closeCart();
    }, [pathname, closeCart]);
    return null;
}

export default function App() {
    return (
        <ApolloProvider client={client}>
            <CartProvider>
                <Router>
                    <RouteWatcher />
                    <Header />
                    <CartOverlay />
                    <main>
                        <Routes>
                            <Route path="/" element={<Navigate to="/all" replace />} />
                            <Route path="/product/:productId" element={<ProductDetails />} />
                            <Route path="/:categoryId" element={<ProductList />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </Router>
            </CartProvider>
        </ApolloProvider>
    );
}
