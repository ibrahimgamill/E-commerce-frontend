import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import RedirectToFirstCategory from "./pages/RedirectToFirstCategory.jsx";

// Apollo Client configuration

const client = new ApolloClient({
    uri: "https://e-commerce-backend-2b8o.onrender.com/graphql",
    cache: new InMemoryCache(),
});



function App() {
    // Cart overlay open/close state
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <ApolloProvider client={client}>
            <Router>
                {/* Pass onCartClick to Header */}
                <Header onCartClick={() => setCartOpen(true)} />
                {/* Pass open/onClose to CartOverlay */}
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

export default App;
