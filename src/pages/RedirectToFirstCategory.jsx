import React from "react";
import { Navigate } from "react-router-dom";

// when someone hits "/", bounce them to "/all"
export default function RedirectToFirstCategory() {
    return <Navigate to="/all" replace />;
}
