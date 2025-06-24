import { useState } from "react";
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
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";

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
                        {/* Redirect root "/" to "/all" */}
                        <Route path="/" element={<Navigate to="/all" replace />} />
                        {/* /all shows all products */}
                        <Route path="/all" element={<ProductList />} />
                        {/* Other categories */}
                        <Route path="/category/:categoryId" element={<ProductList />} />
                        <Route path="/product/:productId" element={<ProductDetails />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Router>
        </ApolloProvider>
    );
}
