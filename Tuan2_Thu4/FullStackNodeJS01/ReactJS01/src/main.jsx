import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/Register.jsx';
import UserPage from './pages/User.jsx';
import HomePage from './pages/Home.jsx';
import LoginPage from './pages/Login.jsx';
import Products from './pages/Products.jsx';
import { AuthWrapper } from './components/context/AuthContext.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "users",
                element: <UserPage />
            },
            {
                path: "products",
                element: <Products />
            },
        ],
    },
    {
        path: "register",
        element: <RegisterPage />
    },
    {
        path: "login",
        element: <LoginPage />
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthWrapper>
            <RouterProvider router={router} />
        </AuthWrapper>
    </React.StrictMode>,
)