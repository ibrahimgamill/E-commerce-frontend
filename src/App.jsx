// src/App.jsx
import { useState } from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import RedirectToFirstCategory from "./pages/RedirectToFirstCategory";

// Create the client once (no export here)
const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    cache: new InMemoryCache(),
});

// Only one default export: the App component
export default function App() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <ApolloProvider client={client}>
            <Router>
                <Header onCartClick={() => setCartOpen(true)} />
                <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
                <main>
                    <Routes>
                        <Route path="/" element={<RedirectToFirstCategory />} />
                        <Route path="/category/:categoryId" element={<ProductList />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Router>
        </ApolloProvider>
    );
}
