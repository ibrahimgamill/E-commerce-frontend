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
    uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:8080/graphql",
    cache: new InMemoryCache(),
});

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => setIsCartOpen(open => !open);
    const closeCart  = () => setIsCartOpen(false);

    return (
        <ApolloProvider client={client}>
            <Router>
                {/* pass your click-handler into Header */}
                <Header onCartClick={toggleCart} />

                {/* only render the overlay when open */}
                {isCartOpen && <CartOverlay onClose={closeCart} />}

                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/category/all" />} />
                        <Route path="/category/:categoryId" element={<ProductList />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Router>
        </ApolloProvider>
    );
}

export default App;
