import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="w-screen bg-gradient-to-br from-red-600 to-purple-700 py-4 flex items-center justify-center shadow-lg">
            <nav className="w-full max-w-6xl bg-white text-gray-900 rounded-xl shadow-xl px-8 py-4 flex justify-between items-center">
                
                {/* 🔹 Logo with enhanced styling */}
                <h1 className="text-4xl font-extrabold flex items-center gap-3">
                    <Link to="/" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-all duration-300">
                        <span className="text-5xl">🚀</span>  
                        <span className="text-yellow-500 drop-shadow-lg">CodeBurn</span>
                    </Link>
                </h1>

                {/* 🔹 Navigation Bar */}
                <div className="flex space-x-6 text-lg font-semibold">
                    <NavItem to="/" label="Home" />
                    <NavItem to="/users" label="Users" />
                    <NavItem to="/problems" label="Problems" />
                    <NavItem to="/solves" label="Solves" />
                    <NavItem to="/discussions" label="Discussions" />
                </div>
            </nav>
        </div>
    );
}

/** 🔹 Reusable Nav Item Component */
const NavItem = ({ to, label }) => (
    <Link 
        to={to} 
        className="px-4 py-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-white hover:bg-red-500 hover:scale-105 active:scale-95 active:text-gray-100"
    >
        {label}
    </Link>
);

export default Header;