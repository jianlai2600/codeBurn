import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="w-screen bg-gradient-to-br from-red-600 to-purple-700 py-4 flex items-center justify-center">
            <nav className="w-full max-w-4xl bg-white text-gray-900 rounded-lg shadow-2xl px-10 py-4 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold flex items-center gap-2">
                    🚀 <span className="text-yellow-500">CodeBurn</span>
                </h1>
                <div className="flex space-x-8">
                    <Link to="/" className="px-4 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-200 rounded-lg transition-all">Home</Link>
                    <Link to="/users" className="px-4 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-200 rounded-lg transition-all">Users</Link>
                    <Link to="/problems" className="px-4 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-200 rounded-lg transition-all">Problems</Link>
                    <Link to="/solves" className="px-4 py-2 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-200 rounded-lg transition-all">Solves</Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;
