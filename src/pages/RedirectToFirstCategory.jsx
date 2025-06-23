import React from "react";
import { Navigate } from "react-router-dom";

// when you go to "/", redirect to "/all"
export default function RedirectToFirstCategory() {
    return <Navigate to="/all" replace />;
}
