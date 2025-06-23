import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";       // your ApolloClient setup
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import RedirectToFirstCategory from "./pages/RedirectToFirstCategory";

export default function App() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <ApolloProvider client={client}>
            <Router>
                <Header onCartClick={() => setCartOpen(true)} />
                <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
                <main>
                    <Routes>
                        {/* "/" -> "/all" */}
                        <Route path="/" element={<RedirectToFirstCategory />} />

                        {/* "/all", "/clothes", "/tech", etc. */}
                        <Route path="/:categoryId" element={<ProductList />} />

                        {/* product detail */}
                        <Route path="/product/:productId" element={<ProductDetails />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Router>
        </ApolloProvider>
    );
}
