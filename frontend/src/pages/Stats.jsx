import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Stats() {
    const [stats, setStats] = useState({ total_users: 0, total_problems: 0, total_solves: 0 });
    const navigate = useNavigate(); // 用于跳转页面

    useEffect(() => {
        axios.get("http://localhost:1234/api/stats")
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to load stats", err));
    }, []);

    return (
        <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold text-indigo-600">📊 Statistics Dashboard</h1>

            {/* 🔥 统计信息 */}
            <div className="mt-6 grid grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="p-6 bg-white shadow-md rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-indigo-600">👤 Users</h2>
                    <p className="text-3xl font-semibold text-indigo-600">{stats.total_users}</p>
                </div>
                <div className="p-6 bg-white shadow-md rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-indigo-600">📌 Problems</h2>
                    <p className="text-3xl font-semibold text-indigo-600">{stats.total_problems}</p>
                </div>
                <div className="p-6 bg-white shadow-md rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-indigo-600">✅ Solves</h2>
                    <p className="text-3xl font-semibold text-indigo-600">{stats.total_solves}</p>
                </div>
            </div>

            {/* 🔗 导航按钮 */}
            <div className="mt-8 flex space-x-6">
                <button onClick={() => navigate("../Users")} className="bg-indigo-500 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition">
                    👥 Manage Users
                </button>
                <button onClick={() => navigate("/problems")} className="bg-indigo-500 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition">
                    📌 Manage Problems
                </button>
                <button onClick={() => navigate("/solves")} className="bg-indigo-500 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition">
                    ✅ View Solves
                </button>
            </div>
        </div>
    );
}

export default Stats;