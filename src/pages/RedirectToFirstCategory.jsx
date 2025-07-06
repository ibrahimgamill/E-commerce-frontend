import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RedirectToFirstCategory() {
    const { loading, error, data } = useQuery(GET_CATEGORIES);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && data?.categories?.length) {
            // Get first non-"all" category
            const first = data.categories.find(c => c.name !== "all");
            if (first) {
                navigate(`/category/${first.name}`, { replace: true });
            } else {
                navigate("/notfound", { replace: true });
            }
        }
    }, [loading, data, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories.</div>;
    return null;
}
