// src/App.jsx
import React, { useEffect, useRef } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

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

// only close on *real* navigation
function RouteWatcher() {
    const { closeCart } = useCart();
    const { pathname } = useLocation();
    const prev = useRef(pathname);

    useEffect(() => {
        if (pathname !== prev.current) {
            closeCart();
        }
        prev.current = pathname;
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
