// @ts-ignore
import React, {JSX, useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {checkAuthAndFetch} from "../../Services/auth";

const ProtectedRoute = ({element}: { element: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        checkAuthAndFetch()
            .then((result) => {
                if (result) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;
    return isAuthenticated ? element : <Navigate to="/login"/>;
};


export default ProtectedRoute;