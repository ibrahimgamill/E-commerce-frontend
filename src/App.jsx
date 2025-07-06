import React from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    cache: new InMemoryCache(),
});

export default function App() {
    return (
        <ApolloProvider client={client}>
            <CartProvider>
                <Router>
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
