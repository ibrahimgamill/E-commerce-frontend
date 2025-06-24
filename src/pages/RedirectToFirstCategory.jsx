// src/pages/RedirectToFirstCategory.jsx
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { Navigate } from "react-router-dom";

export default function RedirectToFirstCategory() {
    const { loading, error, data } = useQuery(GET_CATEGORIES);

    if (loading || error) return null;
    const cats = data.categories.map(c => c.name);
    // Always include 'all' in your categories
    const first = ["all", ...cats.filter(n => n !== "all")][0];
    return <Navigate to={`/category/${first}`} replace />;
}
