import { useEffect, useState } from "react";
import axios from "axios";

function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [newDiscussion, setNewDiscussion] = useState({ user_id: "", problem_id: "", content: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);  // 控制弹窗
    const [selectedDiscussion, setSelectedDiscussion] = useState(null); // 存储当前选中的讨论
    
    const [currentPage, setCurrentPage] = useState(1);
    const discussionsPerPage = 20;

    // 排序
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // 分页逻辑
    const indexOfLastDiscussion = currentPage * discussionsPerPage;
    const indexOfFirstDiscussion = indexOfLastDiscussion - discussionsPerPage;
    const currentDiscussions = discussions.slice(indexOfFirstDiscussion, indexOfLastDiscussion);
    const totalPages = Math.ceil(discussions.length / discussionsPerPage);
    
    const sortedDiscussions = [...currentDiscussions].sort((a, b) => {
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
        const totalPages = Math.ceil(discussions.length / discussionsPerPage);
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
    
    // 加载讨论列表
    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = () => {
        axios.get("http://localhost:1234/api/discussions")
            .then(res => setDiscussions(res.data))
            .catch(err => console.error(err));
    };

    // 搜索讨论
    const searchDiscussion = () => {
        if (!searchId.trim()) {
            alert("Please enter a Discussion ID to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/discussions/${searchId}`)
            .then(res => setDiscussions([res.data]))
            .catch(err => {
                console.error(err);
                alert("Discussion not found");
            });
    };

    // 按照讨论内容模糊搜索
    const [searchContent, setSearchContent] = useState(""); // 新增状态存储搜索的讨论内容

    const searchDiscussionByContent = () => {
        if (!searchTitle.trim()) {
            alert("Please enter Discussion Content to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/discussions/content/${searchTitle}`)
            .then(res => setDiscussions(res.data))
            .catch(err => {
                console.error(err);
                alert("Discussion not found");
            });
    };
        // 添加讨论
        const addDiscussion = () => {
            if (!newDiscussion.user_id || !newDiscussion.problem_id || !newDiscussion.content) {
                alert("All fields are required!");
                return;
            }
        
            axios.post("http://localhost:1234/api/discussions", newDiscussion)
                .then(() => {
                    fetchDiscussions();
                    setNewDiscussion({ user_id: "", problem_id: "", content: "" });
                })
                .catch(err => {
                    if (err.response) {
                        // 🔹 错误处理：显示服务器返回的错误信息
                        if (err.response.status === 404) {
                            alert(err.response.data.error);
                        } else if (err.response.status === 400) {
                            alert("Missing required fields.");
                        } else {
                            alert("An error occurred while adding the discussion.");
                        }
                    } else {
                        console.error(err);
                        alert("An error occurred. Please try again.");
                    }
                });
        };
    
        // 删除讨论
        const deleteDiscussion = (id) => {
            axios.delete(`http://localhost:1234/api/discussions/${id}`)
                .then(() => fetchDiscussions())
                .catch(err => console.error(err));
        };
    
        // 更新讨论
        const updateDiscussion = () => {
            axios.put(`http://localhost:1234/api/discussions/${selectedDiscussion.discussion_id}`, selectedDiscussion)
                .then(() => {
                    fetchDiscussions();  // 刷新讨论列表
                    setIsModalOpen(false);  // 关闭弹窗
                })
                .catch(err => console.error(err));
        };
    
        const openEditModal = (discussion) => {
            setSelectedDiscussion({ ...discussion }); // 存储当前选中的讨论
            setIsModalOpen(true);         // 打开弹窗
        };
    
        const [discussionDetails, setDiscussionDetails] = useState(null);
        const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
        const [searchTitle, setSearchTitle] = useState(""); 

        const fetchDiscussionDetails = (discussionId) => {
            axios.get(`http://localhost:1234/api/discussions/${discussionId}/details`)
                .then(res => {
                    setDiscussionDetails(res.data);
                    setIsDetailsModalOpen(true); // 打开弹窗
                })
                .catch(err => {
                    console.error(err);
                    alert("Failed to fetch discussion details");
                });
        };
    
        return (
            <div className="p-10 bg-gray-50 min-h-screen flex flex-col items-center text-black">
                <h1 className="text-4xl font-bold text-blue-700">💬 Discussion Hub</h1>
    
                {/* 添加讨论表单 */}
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold">➕ Add New Discussion</h2>
                    <input 
                        placeholder="User ID" 
                        value={newDiscussion.user_id} 
                        onChange={e => setNewDiscussion({ ...newDiscussion, user_id: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    />
                    <input 
                        placeholder="Problem ID" 
                        value={newDiscussion.problem_id} 
                        onChange={e => setNewDiscussion({ ...newDiscussion, problem_id: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <textarea 
                        placeholder="Content" 
                        value={newDiscussion.content} 
                        onChange={e => setNewDiscussion({ ...newDiscussion, content: e.target.value })} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <button 
                        onClick={addDiscussion} 
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-green-700"
                    >
                        Add Discussion
                    </button>
                </div>
    
                {/* 搜索讨论 */}
                <div className="mt-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold">🔍 Search Discussion</h2>
                    <input 
                        placeholder="Discussion ID" 
                        value={searchId} 
                        onChange={e => setSearchId(e.target.value)} 
                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                    />
                    <button 
                        onClick={searchDiscussion} 
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                    >
                        Search
                    </button>
                </div>
                            {/* 搜索讨论 */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold">🔍 Search Discussion by Content</h2>
                <input 
                    placeholder="Discussion Content" 
                    value={searchTitle} 
                    onChange={e => setSearchTitle(e.target.value)} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <button 
                    onClick={searchDiscussionByContent} 
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                >
                    Search
                </button>
            </div>

            {/* 讨论列表 */}
            <table className="w-full max-w-4xl mt-6 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-700 text-white text-lg">
                        <th className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600" onClick={() => toggleSort("discussion_id")}>
                            Discussion ID {getSortIcon("discussion_id")}
                        </th>
                        <th className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600" onClick={() => toggleSort("username")}>
                            User {getSortIcon("username")}
                        </th>
                        <th className="py-4 px-6 text-left cursor-pointer hover:bg-blue-600" onClick={() => toggleSort("problem_title")}>
                            Problem {getSortIcon("problem_title")}
                        </th>
                        <th className="py-4 px-6 text-left">Content</th>
                        <th className="py-4 px-6 text-left">Likes</th>
                        <th className="py-4 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-md">
                    {sortedDiscussions.map(discussion => (
                        <tr key={discussion.discussion_id} className="border-b hover:bg-gray-100 transition">
                            <td className="py-4 px-6">{discussion.discussion_id}</td>
                            <td className="py-4 px-6">{discussion.username}</td>
                            <td className="py-4 px-6">{discussion.problem_title}</td>
                            <td className="py-4 px-6 max-w-xs truncate hover:whitespace-normal hover:bg-gray-200">
                                {discussion.content}
                            </td>
                            <td className="py-4 px-6 text-center">{discussion.like_count}</td>
                            <td className="py-4 px-6">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteDiscussion(discussion.discussion_id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-red-800 shadow-md hover:shadow-lg"
                                    >
                                        🗑 Delete
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(discussion)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 hover:bg-yellow-400 active:scale-95 active:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 shadow-md hover:shadow-lg"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        onClick={() => fetchDiscussionDetails(discussion.discussion_id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 hover:bg-blue-400 active:scale-95 active:bg-blue-600 focus:ring-2 focus:ring-blue-300 shadow-md hover:shadow-lg"
                                    >
                                        🔍 View Details
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
                        <h2 className="text-lg font-bold mb-4">Edit Discussion</h2>
                        <input 
                            type="text" 
                            value={selectedDiscussion.content} 
                            onChange={(e) => setSelectedDiscussion({ ...selectedDiscussion, content: e.target.value })} 
                            className="border p-2 w-full mb-2"
                        />
                        <div className="flex justify-between">
                            <button 
                                onClick={updateDiscussion} 
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
            {isDetailsModalOpen && discussionDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Discussion Details</h2>

                        <p><strong>User:</strong> {discussionDetails.discussion.username}</p>
                        <p><strong>Problem:</strong> {discussionDetails.discussion.problem_title}</p>
                        <p><strong>Content:</strong> {discussionDetails.discussion.content}</p>

                        <h3 className="mt-4 font-semibold">🔹 Liked by Users</h3>
                        <ul className="list-disc pl-5">
                            {discussionDetails.liked_by.length > 0 ? 
                                discussionDetails.liked_by.map(user => <li key={user.user_id}>{user.username}</li>) :
                                <li>No Likes</li>
                            }
                        </ul>

                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={() => setIsDetailsModalOpen(false)} 
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Close
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

export default Discussions;