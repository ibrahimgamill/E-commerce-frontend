import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";

// Apollo Client configuration
const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL, // set this in Vercel to your backend URL + "/graphql"
    cache: new InMemoryCache(),
});

export default function App() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <ApolloProvider client={client}>
            <Router>
                <Header onCartClick={() => setCartOpen(true)} />
                <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
                <main>
                    <Routes>
                        {/* default to /all */}
                        <Route path="/" element={<Navigate to="/all" replace />} />
                        {/* now /all, /tech, /clothes, etc. */}
                        <Route path="/:categoryId" element={<ProductList />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Router>
        </ApolloProvider>
    );
}
