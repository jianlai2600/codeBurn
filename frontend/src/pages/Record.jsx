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
    const [timeSpent, setTimeSpent] = useState("");
    const [company, setCompany] = useState("");
    const [interview, setInterview] = useState(false);
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
            <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-6xl mt-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Recent Solved Problems</h2>
                <table className="w-full table-auto text-sm text-gray-800">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">Time</th>
                            <th className="px-4 py-3 text-left">Interview</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solves.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-400">
                                    No recent problems found.
                                </td>
                            </tr>
                        ) : (
                            solves.map((solve, index) => (
                                <tr key={`${solve.problem_id}-${solve.solved_date}`} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3 text-blue-600 underline">
                                        <a
                                            href={`https://leetcode.com/problems/${solve.title_slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {solve.title || solve.title_slug}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {solve.time_spent_minutes ? `${solve.time_spent_minutes} min` : "--"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {solve.encountered_in_interview ? (
                                            <span className="text-purple-600 font-semibold">
                                                {solve.company || "Yes"}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{solve.solved_date}</td>
                                    <td className="px-4 py-3">
                                        {solve.status === "AC" ? (
                                            <span className="text-green-600 font-semibold">✔ Accepted</span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">❌ {solve.status}</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* 🆕 Add problem solved today */}
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mt-10 border border-green-200">
            <h3 className="text-2xl font-bold text-green-700 mb-6">✨ Add a Problem You Solved Today</h3>

            <div className="flex flex-col gap-4">
                {/* Problem ID */}
                <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">🔢 Problem ID</label>
                <input
                    type="number"
                    placeholder="e.g. 1 for Two Sum"
                    value={newProblemId}
                    onChange={(e) => setNewProblemId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                </div>

                {/* Time Spent */}
                <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">⏱ Time Spent (minutes)</label>
                <input
                    type="number"
                    placeholder="e.g. 25"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black"
                />
                </div>

                {/* Company */}
                <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">🏢 Company (if in an interview)</label>
                <input
                    type="text"
                    placeholder="e.g. Google, Amazon"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black"
                />
                </div>

                {/* Interview Checkbox */}
                <label className="inline-flex items-center text-sm text-gray-700">
                <input
                    type="checkbox"
                    checked={interview}
                    onChange={(e) => setInterview(e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                This problem was asked in a real interview
                </label>

                {/* Submit */}
                <button
                onClick={() => {
                    if (!user.google_id || !newProblemId) return;

                    axios
                    .post(`${API_BASE_URL}/api/solves/add-by-google-id`, {
                        google_id: user.google_id,
                        problem_id: parseInt(newProblemId),
                        time_spent_minutes: parseInt(timeSpent) || null,
                        encountered_in_interview: interview,
                        company: company || null,
                    })
                    .then((res) => {
                        setSubmitMsg("✅ Added successfully!");
                        setNewProblemId("");
                        setTimeSpent("");
                        setInterview(false);
                        setCompany("");
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

                {submitMsg && <p className="text-sm text-gray-500">{submitMsg}</p>}
            </div>
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