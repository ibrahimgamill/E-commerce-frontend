// src/pages/RedirectToFirstCategory.jsx
import { Navigate } from "react-router-dom";

export default function RedirectToFirstCategory() {
    // this will ensure tests hitting "/" land on "/category/all"
    return <Navigate to="/category/all" replace />;
}
