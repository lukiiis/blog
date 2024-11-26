import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 w-full py-4 shadow-md text-center">
                <h1 className="text-white text-3xl">My Blog</h1>
            </header>
            <main className="flex-grow container mx-auto p-4">
                <Outlet />
            </main>
            <footer className="bg-blue-600 w-full py-4 text-center text-white">
                &copy; 2023 My Blog. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;