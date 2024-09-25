import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
    const location = useLocation();

    // check user is not home page and accordingly navigate
    if (location.pathname === '/') {
        if (!isAuthenticated) {
            return <Navigate to={"/auth/login"} />;
        } else {
            if (user?.role === 'admin') {
                return <Navigate to={"/admin/dashboard"} />;
            } else {
                return <Navigate to={"/shop/home"} />;
            }
        }
    }

    // check if the user is authenticated or not
    if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/register"))) {
        return <Navigate to={"/auth/login"} />;
    }

    // check if the user is authenticated then redirect to page according to user role
    if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
        if (user?.role === 'admin') {
            return <Navigate to={'/admin/dashboard'} />
        } else {
            return <Navigate to={'/shop/home'} />
        }
    }

    // check if user is trying to access admin view then redirect to unauth page
    if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('admin')) {
        return <Navigate to={'/unauth-page'} />
    }

    // check if admin is trying to access the shopping page then redirect to admin page
    if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('shop')) {
        return <Navigate to={'/admin/dashboard'} />
    }

    return <>{children}</>;
};

export default CheckAuth;
