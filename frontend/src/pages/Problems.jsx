import { useEffect, useState } from "react";
import axios from "axios";

function Problems() {
    const [problems, setProblems] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [newProblem, setNewProblem] = useState({ title: "", difficulty: "", url: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);  // 控制弹窗
    const [selectedProblem, setSelectedProblem] = useState(null); // 存储当前选中的问题
    
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 20;

    // 排序
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // 分页逻辑
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);
    const totalPages = Math.ceil(problems.length / problemsPerPage);
    
    const sortedProblems = [...currentProblems].sort((a, b) => {
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
        const totalPages = Math.ceil(problems.length / problemsPerPage);
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
    
    // 加载问题列表
    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = () => {
        axios.get("http://localhost:1234/api/problems")
            .then(res => setProblems(res.data))
            .catch(err => console.error(err));
    };

    // 搜索问题
    const searchProblem = () => {
        if (!searchId.trim()) {
            alert("Please enter a Problem ID to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/problems/${searchId}`)
            .then(res => setProblems([res.data]))
            .catch(err => {
                console.error(err);
                alert("Problem not found");
            });
    };

    // 按照问题名字模糊搜索
    const [searchTitle, setSearchTitle] = useState(""); // 新增状态存储搜索的题目

    const searchProblemByTitle = () => {
        if (!searchTitle.trim()) {
            alert("Please enter a Problem Title to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/problems/title/${searchTitle}`)
            .then(res => setProblems(res.data))
            .catch(err => {
                console.error(err);
                alert("Problem not found");
            });
    };

    // 添加问题
    const addProblem = () => {
        if (!newProblem.title || !newProblem.difficulty || !newProblem.url) {
            alert("All fields are required!");
            return;
        }
        axios.post("http://localhost:1234/api/problems", newProblem)
            .then(() => {
                fetchProblems();
                setNewProblem({ title: "", difficulty: "", url: "" });
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    alert(err.response.data.error);
                } else {
                    console.error(err);
                    alert("An error occurred while adding the problem.");
                }
            });
    };

    // 删除问题
    const deleteProblem = (id) => {
        axios.delete(`http://localhost:1234/api/problems/${id}`)
            .then(() => fetchProblems())
            .catch(err => console.error(err));
    };
    // 更新问题
    const updateProblem = () => {
        axios.put(`http://localhost:1234/api/problems/${selectedProblem.problem_id}`, selectedProblem)
            .then(() => {
                fetchProblems();  // 刷新问题列表
                setIsModalOpen(false);  // 关闭弹窗
            })
            .catch(err => console.error(err));
    };



    const openEditModal = (problem) => {
        setSelectedProblem({ ...problem }); // 存储当前选中的问题
        setIsModalOpen(true);         // 打开弹窗
    };

    return (
        
        <div className="p-10 bg-gray-50 min-h-screen flex flex-col items-center text-black">
            <h1 className="text-4xl font-bold text-blue-700">🚀 Problem Management</h1>

            {/* 添加问题表单 */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold">➕ Add New Problem</h2>
                <input 
                    placeholder="Title" 
                    value={newProblem.title} 
                    onChange={e => setNewProblem({ ...newProblem, title: e.target.value })} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
                <select 
                    value={newProblem.difficulty} 
                    onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })} 
                    className={`border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2
                        ${newProblem.difficulty === 'Easy' ? 'bg-green-100' :
                        newProblem.difficulty === 'Medium' ? 'bg-yellow-100' :
                        newProblem.difficulty === 'Hard' ? 'bg-red-100' : ''}`}
                >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <input 
                    placeholder="URL" 
                    value={newProblem.url} 
                    onChange={e => setNewProblem({ ...newProblem, url: e.target.value })} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <button 
                    onClick={addProblem} 
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-green-700"
                >
                    Add Problem
                </button>
            </div>

            {/* 搜索问题 */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold">🔍 Search Problem</h2>
                <input 
                    placeholder="Problem ID" 
                    value={searchId} 
                    onChange={e => setSearchId(e.target.value)} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <button 
                    onClick={searchProblem} 
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                >
                    Search
                </button>
            </div>
            
            {/* 按照问题名称搜索 */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold">🔍 Search Problem by Title</h2>
                <input 
                    placeholder="Problem Title" 
                    value={searchTitle} 
                    onChange={e => setSearchTitle(e.target.value)} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <button 
                    onClick={searchProblemByTitle} 
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                >
                    Search
                </button>
            </div>
            {/* 问题列表 */}
            <table className="w-full max-w-3xl mt-6 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-700 text-white text-lg">
                        <th 
                            className="py-4 px-6 text-left min-w-[120px] cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("problem_id")}
                        >
                            Problem ID {getSortIcon("problem_id")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("title")}
                        >
                            Title {getSortIcon("title")}
                        </th>
                        <th 
                            className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600"
                            onClick={() => toggleSort("difficulty")}
                        >
                            Difficulty {getSortIcon("difficulty")}
                        </th>
                        <th className="py-4 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-md">
                    {sortedProblems.map(problem => (
                        <tr key={problem.problem_id} className="border-b hover:bg-gray-100 transition">
                            <td className="py-4 px-6">{problem.problem_id}</td>
                            <td className="py-4 px-6">{problem.title}</td>
                            <td className={`py-4 px-6 
                                ${problem.difficulty === 'Easy' ? 'text-green-600' :
                                problem.difficulty === 'Medium' ? 'text-yellow-600' :
                                problem.difficulty === 'Hard' ? 'text-red-600' : ''}`}
                            >
                                {problem.difficulty}
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteProblem(problem.problem_id)} 
                                        className="bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-red-800 shadow-md hover:shadow-lg"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(problem)}
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
                        <h2 className="text-lg font-bold mb-4">Edit Problem</h2>
                        <input 
                            type="text" 
                            value={selectedProblem.title} 
                            onChange={(e) => setSelectedProblem({ ...selectedProblem, title: e.target.value })} 
                            className="border p-2 w-full mb-2"
                        />
                        <select 
                            value={selectedProblem.difficulty} 
                            onChange={(e) => setSelectedProblem({ ...selectedProblem, difficulty: e.target.value })} 
                            className={`border p-2 w-full mb-2 rounded-lg
                                ${selectedProblem.difficulty === 'Easy' ? 'bg-green-100' :
                                selectedProblem.difficulty === 'Medium' ? 'bg-yellow-100' :
                                selectedProblem.difficulty === 'Hard' ? 'bg-red-100' : ''}`}
                        >
                            <option value="">Select Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <input 
                            type="text" 
                            value={selectedProblem.url} 
                            onChange={(e) => setSelectedProblem({ ...selectedProblem, url: e.target.value })} 
                            className="border p-2 w-full mb-4"
                        />
                        <div className="flex justify-between">
                            <button 
                                onClick={updateProblem} 
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

export default Problems;