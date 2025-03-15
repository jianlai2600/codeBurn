import { useEffect, useState } from "react";
import axios from "axios";

function Solves() {
    const [solves, setSolves] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [newSolve, setNewSolve] = useState({ 
        user_id: "", 
        problem_id: "", 
        solve_date: "", 
        attempts: "", 
        status: "" 
    });

    const [isModalOpen, setIsModalOpen] = useState(false);  // 控制弹窗
    const [selectedSolve, setSelectedSolve] = useState(null); // 存储当前选中的解答记录
    
    const [currentPage, setCurrentPage] = useState(1);
    const solvesPerPage = 20;

    // 排序
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // 分页逻辑
    const indexOfLastSolve = currentPage * solvesPerPage;
    const indexOfFirstSolve = indexOfLastSolve - solvesPerPage;
    const currentSolves = solves.slice(indexOfFirstSolve, indexOfLastSolve);
    const totalPages = Math.ceil(solves.length / solvesPerPage);
    
    const sortedSolves = [...currentSolves].sort((a, b) => {
        if (!sortConfig.key) return 0; // 无排序时不改变顺序
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
            return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        } else {
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
    });
 
    // 切换排序
    const toggleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    // 获取排序箭头
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    const generatePagination = () => {
        const pages = [];
        if (totalPages <= 10) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push("...");
    
            const startPage = Math.max(2, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);
    
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
    
            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };
    
    // 加载解答记录
    useEffect(() => {
        fetchSolves();
    }, []);

    const fetchSolves = () => {
        axios.get("http://localhost:1234/api/solves")
            .then(res => setSolves(res.data))
            .catch(err => console.error(err));
    };

    // 搜索解答记录
    const searchSolve = () => {
        if (!searchId.trim()) {
            alert("Please enter a Solve ID to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/solves/${searchId}`)
            .then(res => setSolves([res.data]))
            .catch(err => {
                console.error(err);
                alert("Solve record not found");
            });
    };
        // 状态管理
const [searchSolveId, setSearchSolveId] = useState("");
const [searchUserId, setSearchUserId] = useState("");
const [searchProblemId, setSearchProblemId] = useState("");

// 按 Solve ID 搜索
const searchSolveById = () => {
    if (!searchSolveId.trim()) {
        alert("Please enter a Solve ID to search!");
        return;
    }
    axios.get(`http://localhost:1234/api/solves/id/${searchSolveId}`)
        .then(res => setSolves([res.data]))  // 只有一个记录
        .catch(err => {
            console.error(err);
            alert("Solve record not found");
        });
};

// 按 User ID 搜索
const searchSolvesByUserId = () => {
    if (!searchUserId.trim()) {
        alert("Please enter a User ID to search!");
        return;
    }
    axios.get(`http://localhost:1234/api/solves/user/${searchUserId}`)
        .then(res => setSolves(res.data))  // 可能返回多个记录
        .catch(err => {
            console.error(err);
            alert("No solves found for this user.");
        });
};

// 按 Problem ID 搜索
const searchSolvesByProblemId = () => {
    if (!searchProblemId.trim()) {
        alert("Please enter a Problem ID to search!");
        return;
    }
    axios.get(`http://localhost:1234/api/solves/problem/${searchProblemId}`)
        .then(res => setSolves(res.data))  // 可能返回多个记录
        .catch(err => {
            console.error(err);
            alert("No solves found for this problem.");
        });
};
    
        // 添加解题记录
        const addSolve = () => {
            if (!newSolve.user_id || !newSolve.problem_id || !newSolve.solve_date || !newSolve.attempts || !newSolve.status) {
                alert("All fields are required!");
                return;
            }
            axios.post("http://localhost:1234/api/solves", newSolve)
                .then(() => {
                    fetchSolves();
                    setNewSolve({ user_id: "", problem_id: "", solve_date: "", attempts: "", status: "" });
                })
                .catch(err => {
                    if (err.response && err.response.status === 400) {
                        alert(err.response.data.error);
                    } else {
                        console.error(err);
                        alert("An error occurred while adding the solve record.");
                    }
                });
        };
    
        // 删除解题记录
        const deleteSolve = (id) => {
            axios.delete(`http://localhost:1234/api/solves/${id}`)
                .then(() => fetchSolves())
                .catch(err => console.error(err));
        };
    
        // 更新解题记录
        const updateSolve = () => {
            axios.put(`http://localhost:1234/api/solves/${selectedSolve.solve_id}`, selectedSolve)
                .then(() => {
                    fetchSolves();  // 刷新解题记录列表
                    setIsModalOpen(false);  // 关闭弹窗
                })
                .catch(err => console.error(err));
        };
    
        const openEditModal = (solve) => {
            setSelectedSolve({ ...solve }); // 存储当前选中的解题记录
            setIsModalOpen(true); // 打开弹窗
        };
    
        return (
            <div className="p-10 bg-gray-50 min-h-screen flex flex-col items-center text-black">
                <h1 className="text-4xl font-bold text-blue-700">🚀 Solve Management</h1>
    
                {/* 添加解题记录表单 */}
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold">➕ Add New Solve</h2>
                    <input 
                        placeholder="User ID" 
                        value={newSolve.user_id} 
                        onChange={e => setNewSolve({ ...newSolve, user_id: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    />
                    <input 
                        placeholder="Problem ID" 
                        value={newSolve.problem_id} 
                        onChange={e => setNewSolve({ ...newSolve, problem_id: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <input 
                        type="date"
                        placeholder="Solve Date" 
                        value={newSolve.solve_date} 
                        onChange={e => setNewSolve({ ...newSolve, solve_date: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <input 
                        type="number"
                        placeholder="Attempts" 
                        value={newSolve.attempts} 
                        onChange={e => setNewSolve({ ...newSolve, attempts: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <select 
                        value={newSolve.status} 
                        onChange={e => setNewSolve({ ...newSolve, status: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    >
                        <option value="">Select Status</option>
                        <option value="AC">Accepted</option>
                        <option value="WA">Wrong Answer</option>
                        <option value="TLE">Time Limit Exceeded</option>
                        <option value="MLE">Memory Limit Exceeded</option>
                        <option value="RE">Runtime Error</option>
                    </select>
                    <button 
                        onClick={addSolve} 
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-green-700"
                    >
                        Add Solve
                    </button>
                </div>
    
                {/* 按 Solve ID 搜索 */}
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold">🔍 Search by Solve ID</h2>
                    <input 
                        placeholder="Solve ID" 
                        value={searchSolveId} 
                        onChange={e => setSearchSolveId(e.target.value)} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <button 
                        onClick={searchSolveById} 
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                    >
                        Search
                    </button>
                </div>

                {/* 按 User ID 搜索 */}
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold">🔍 Search by User ID</h2>
                    <input 
                        placeholder="User ID" 
                        value={searchUserId} 
                        onChange={e => setSearchUserId(e.target.value)} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <button 
                        onClick={searchSolvesByUserId} 
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                    >
                        Search
                    </button>
                </div>

                {/* 按 Problem ID 搜索 */}
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold">🔍 Search by Problem ID</h2>
                    <input 
                        placeholder="Problem ID" 
                        value={searchProblemId} 
                        onChange={e => setSearchProblemId(e.target.value)} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <button 
                        onClick={searchSolvesByProblemId} 
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                    >
                        Search
                    </button>
                </div>

            {/* 解题记录列表 */}
            <table className="w-full max-w-3xl mt-6 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-700 text-white text-lg">
                        <th 
                            className="py-4 px-6 text-left min-w-[120px] cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("solve_id")}
                        >
                            Solve ID {getSortIcon("solve_id")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("user_id")}
                        >
                            User ID {getSortIcon("user_id")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("problem_id")}
                        >
                            Problem ID {getSortIcon("problem_id")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("solve_date")}
                        >
                            Solve Date {getSortIcon("solve_date")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("attempts")}
                        >
                            Attempts {getSortIcon("attempts")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("status")}
                        >
                            Status {getSortIcon("status")}
                        </th>
                        <th className="py-4 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-md">
                    {sortedSolves.map(solve => (
                        <tr key={solve.solve_id} className="border-b hover:bg-gray-100 transition">
                            <td className="py-4 px-6">{solve.solve_id}</td>
                            <td className="py-4 px-6">{solve.user_id}</td>
                            <td className="py-4 px-6">{solve.problem_id}</td>
                            <td className="py-4 px-6">{solve.solve_date}</td>
                            <td className="py-4 px-6">{solve.attempts}</td>
                            <td className={`py-4 px-6 
                                ${solve.status === 'AC' ? 'text-green-600' :
                                solve.status === 'WA' ? 'text-red-600' :
                                solve.status === 'TLE' ? 'text-yellow-600' :
                                solve.status === 'MLE' ? 'text-purple-600' :
                                solve.status === 'RE' ? 'text-orange-600' : ''}`}
                            >
                                {solve.status}
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteSolve(solve.solve_id)} 
                                        className="bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-red-800 shadow-md hover:shadow-lg"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(solve)}
                                        className="bg-amber-500 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-amber-400 active:scale-95 active:bg-amber-600 focus:ring-2 focus:ring-amber-300 shadow-md hover:shadow-lg"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Solve Record</h2>
            <input 
                type="text" 
                value={selectedSolve.user_id} 
                onChange={(e) => setSelectedSolve({ ...selectedSolve, user_id: e.target.value })} 
                className="border p-2 w-full mb-2"
                placeholder="User ID"
            />
            <input 
                type="text" 
                value={selectedSolve.problem_id} 
                onChange={(e) => setSelectedSolve({ ...selectedSolve, problem_id: e.target.value })} 
                className="border p-2 w-full mb-2"
                placeholder="Problem ID"
            />
            <input 
                type="date" 
                value={selectedSolve.solve_date} 
                onChange={(e) => setSelectedSolve({ ...selectedSolve, solve_date: e.target.value })} 
                className="border p-2 w-full mb-2"
                placeholder="Solve Date"
            />
            <input 
                type="number" 
                value={selectedSolve.attempts} 
                onChange={(e) => setSelectedSolve({ ...selectedSolve, attempts: e.target.value })} 
                className="border p-2 w-full mb-2"
                placeholder="Attempts"
            />
            <select 
                value={selectedSolve.status} 
                onChange={(e) => setSelectedSolve({ ...selectedSolve, status: e.target.value })} 
                className="border p-2 w-full mb-2 rounded-lg"
            >
                <option value="">Select Status</option>
                <option value="AC">Accepted</option>
                <option value="WA">Wrong Answer</option>
                <option value="TLE">Time Limit Exceeded</option>
                <option value="MLE">Memory Limit Exceeded</option>
                <option value="RE">Runtime Error</option>
            </select>
            <div className="flex justify-between">
                <button 
                    onClick={updateSolve} 
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Save
                </button>
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

<div className="mt-4 flex items-center gap-2">
    {/* 上一页按钮 */}
    <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        className="border border-gray-400 px-4 py-2 rounded-lg bg-white text-black hover:text-red-500 hover:border-red-500 transition-all duration-300 disabled:opacity-50"
        disabled={currentPage === 1}
    >
        Prev
    </button>

    {/* 页码部分 */}
    {generatePagination().map((page, index) => (
        <button
            key={index}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            className={`border px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === page
                    ? 'bg-black text-white border-red-500 font-bold scale-110'
                    : 'bg-white text-black border-gray-400 hover:text-red-500 hover:border-red-500'
            }`}
            disabled={page === "..."}
        >
            {page}
        </button>
    ))}

    {/* 下一页按钮 */}
    <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        className="border border-gray-400 px-4 py-2 rounded-lg bg-white text-black hover:text-red-500 hover:border-red-500 transition-all duration-300 disabled:opacity-50"
        disabled={currentPage === totalPages}
    >
        Next
    </button>

    {/* 跳转到指定页 */}
    <input
        type="number"
        min="1"
        max={totalPages}
        placeholder="Page"
        className="border border-gray-400 px-2 py-1 text-black rounded-lg w-16"
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }
        }}
    />
    <button
        onClick={() => {
            const input = document.querySelector('input[placeholder="Page"]');
            const page = Number(input.value);
            if (page >= 1 && page <= totalPages) setCurrentPage(page);
        }}
        className="border border-gray-400 px-4 py-2 rounded-lg bg-white text-black hover:text-red-500 hover:border-red-500 transition-all duration-300"
    >
        Go
    </button>
</div>
</div>
);
}

export default Solves;