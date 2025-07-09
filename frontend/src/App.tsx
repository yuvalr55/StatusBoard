import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import Login from "./Components/Login";
import ProtectedRoute from "./Components/Route";
import HomePage from "./Components/Home"; // Assumes you will add this function in Services/auth.ts

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={"/home"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
