import React from "react";

function Home() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-lg shadow-2xl p-12 text-center">
                <h1 className="text-5xl font-extrabold flex items-center justify-center gap-2">
                    🚀<span className="text-yellow-500">CodeBurn</span>
                </h1>
                <p className="text-lg opacity-80 mt-3">
                    Your ultimate LeetCode progress tracker & coding hub!
                </p>
                <div className="flex justify-center space-x-6 mt-6">
                <a href="/Stats" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-black px-6 py-3 rounded-lg text-lg shadow-md transition-all hover:bg-gray-200 hover:text-white">
                    Get Started 🚀
                </a>

                <a href="https://www.leetcode.com" target="_blank" rel="noopener noreferrer" 
                className="bg-white text-black px-6 py-3 rounded-lg text-lg shadow-md transition-all hover:bg-gray-200 hover:text-white">
                    Visit LeetCode 🌍
                </a>
                </div>
                <p className="text-sm opacity-90 mt-6">
                    ⚡ CodeBurn | LeetCode Tracker | 2024
                </p>
                <p className="text-sm opacity-90">Made with ❤️ by Felix</p>
            </div>
        </div>
    );
}

export default Home;
