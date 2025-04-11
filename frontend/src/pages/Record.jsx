import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function Records() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", picture: "", google_id: "" });
    const [solves, setSolves] = useState([]);

    // 新增这两个状态
    const [newProblemId, setNewProblemId] = useState("");
    const [submitMsg, setSubmitMsg] = useState("");


    useEffect(() => {
        const name = localStorage.getItem("user_name");
        const email = localStorage.getItem("email");
        const picture = localStorage.getItem("picture");
        const google_id = localStorage.getItem("google_id");

        setUser({ name, email, picture, google_id });

        if (google_id) {
            axios
                .get(`${API_BASE_URL}/api/solves/recent/${google_id}`)
                .then((res) => setSolves(res.data))
                .catch((err) => console.error("❌ 获取解题记录失败:", err));
        }
    }, []);

    return (
        <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
            {/* 👤 用户信息 */}
            <div className="flex items-center space-x-4 mb-6">
                {user.picture && (
                    <img
                        src={user.picture}
                        alt="avatar"
                        className="w-16 h-16 rounded-full shadow-md"
                    />
                )}
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-green-700">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            </div>

            {/* 📢 英文提示语 */}
            <h2 className="text-xl mb-4 text-gray-700 italic">
                What problems did you solve today?
            </h2>

            {/* ✅ 最近解题记录 */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">#</th>
                            <th className="py-2">Problem ID</th>
                            <th className="py-2">Date</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solves.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-400">
                                    No recent problems found.
                                </td>
                            </tr>
                        ) : (
                            solves.map((solve, index) => (
                                <tr key={solve.solve_id} className="border-b hover:bg-gray-50">
                                    <td className="py-2">{index + 1}</td>
                                    <td className="py-2">{solve.problem_id}</td>
                                    <td className="py-2">{solve.solve_date}</td>
                                    <td className="py-2">{solve.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* 🆕 Add problem solved today */}
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mt-10 border border-green-200">
                <h3 className="text-xl font-semibold text-green-700 mb-4">✨ Add a problem you solved today</h3>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="number"
                        placeholder="Enter Problem ID"
                        value={newProblemId}
                        onChange={(e) => setNewProblemId(e.target.value)}
                        className="px-5 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-2/3 transition"
                    />
                    <button
                        onClick={() => {
                            if (!user.google_id || !newProblemId) return;
                            axios
                                .post(`${API_BASE_URL}/api/solves/add-by-google-id`, {
                                    google_id: user.google_id,
                                    problem_id: parseInt(newProblemId),
                                })
                                .then((res) => {
                                    setSubmitMsg("✅ Added successfully!");
                                    setNewProblemId("");
                                })
                                .catch((err) => {
                                    console.error("❌ 添加失败", err);
                                    setSubmitMsg("❌ Failed to add.");
                                });
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
                    >
                        ➕ Submit
                    </button>
                </div>

                {submitMsg && <p className="text-sm text-gray-500 mt-3">{submitMsg}</p>}
            </div>

            {/* 🔗 导航 */}
            <div className="mt-10 flex space-x-6">
                <button
                    onClick={() => navigate("/users")}
                    className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                >
                    👤 Back to Users
                </button>
                <button
                    onClick={() => navigate("/stats")}
                    className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                >
                    📊 Back to Stats
                </button>
            </div>
        </div>
    );
}

export default Records;