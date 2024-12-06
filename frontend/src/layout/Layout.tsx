import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    const navigate = useNavigate();

    React.useEffect(() => {
        if (token && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.clear()
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 w-full py-4 shadow-md">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
                    <Link to="/"><h1 className="text-white text-3xl">Blobiboks</h1></Link>
                    <nav className="flex space-x-4">
                        {token ? (
                            isAdmin === "true" ? (
                                <>
                                    <Link to="/admin-dashboard" className="text-white">Admin</Link>
                                    <button onClick={handleLogout} className="text-white">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" className="text-white">Profile</Link>
                                    <Link to="/create-post" className="text-white">Create Post</Link>
                                    <button onClick={handleLogout} className="text-white">Logout</button>
                                </>
                            )
                        ) : (
                            <>
                                <Link to="/login" className="text-white">Login</Link>
                                <Link to="/register" className="text-white">Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="h-full flex-grow w-full mx-auto">
                <Outlet />
            </main>
            <footer className="bg-blue-600 w-full py-4 text-center text-white">
                &copy; 2024 Blobiboks. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;