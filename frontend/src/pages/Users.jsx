import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
    const [users, setUsers] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [newUser, setNewUser] = useState({ username: "", email: "", avatar_url: "" });
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);  // 控制弹窗
    const [selectedUser, setSelectedUser] = useState(null); // 存储当前选中的用户

    const usersPerPage = 20;

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
    
    // 加载用户列表
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:1234/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    // 搜索用户
    const searchUser = () => {
        if (!searchId.trim()) {
            alert("Please enter a User ID to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/users/${searchId}`)
            .then(res => setUsers([res.data]))
            .catch(err => {
                console.error(err);
                alert("User not found");
            });
    };

    // 添加用户
    const addUser = () => {
        if (!newUser.username || !newUser.email || !newUser.avatar_url) {
            alert("All fields are required!");
            return;
        }
        axios.post("http://localhost:1234/api/users", newUser)
            .then(() => {
                fetchUsers();
                setNewUser({ username: "", email: "", avatar_url: "" });
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    alert(err.response.data.error);  // 🚀 弹出 "Username already exists!" 或 "Email already exists!"
                } else {
                    console.error(err);
                    alert("An error occurred while adding the user.");
                }
            });
    };

    // 删除用户
    const deleteUser = (id) => {
        axios.delete(`http://localhost:1234/api/users/${id}`)
            .then(() => fetchUsers())
            .catch(err => console.error(err));
    };

    // 更新用户
    const updateUser = () => {
        axios.put(`http://localhost:1234/api/users/${selectedUser.user_id}`, selectedUser)
            .then(() => {
                fetchUsers();  // 刷新用户列表
                setIsModalOpen(false);  // 关闭弹窗
            })
            .catch(err => console.error(err));
    };

    // 分页逻辑
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const openEditModal = (user) => {
        setSelectedUser({ ...user }); // 存储当前选中的用户
        setIsModalOpen(true);         // 打开弹窗
    };

    return (
        
        <div className="p-10 bg-gray-50 min-h-screen flex flex-col items-center text-black">
            <h1 className="text-4xl font-bold text-blue-700">🚀 User Management</h1>

            {/* 添加用户表单 */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold">➕ Add New User</h2>
                <input 
                    placeholder="Username" 
                    value={newUser.username} 
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
                <input 
                    placeholder="Email" 
                    value={newUser.email} 
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <input 
                    placeholder="Avatar URL" 
                    value={newUser.avatar_url} 
                    onChange={e => setNewUser({ ...newUser, avatar_url: e.target.value })} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <button 
                    onClick={addUser} 
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-green-700"
                >
                    Add User
                </button>
            </div>

            {/* 搜索用户 */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold">🔍 Search User</h2>
                <input 
                    placeholder="User ID" 
                    value={searchId} 
                    onChange={e => setSearchId(e.target.value)} 
                    className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 mt-2"
                />
                <button 
                    onClick={searchUser} 
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-blue-800"
                >
                    Search
                </button>
            </div>

            {/* 用户列表 */}
            <table className="w-full max-w-3xl mt-6 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-700 text-white text-lg">
                        <th className="py-4 px-6 text-left min-w-[120px]">User ID</th>
                        <th className="py-4 px-6 text-left">Username</th>
                        <th className="py-4 px-6 text-left">Email</th>
                        <th className="py-4 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-md">
                    {currentUsers.map(user => (
                        <tr key={user.user_id} className="border-b hover:bg-gray-100 transition">
                            <td className="py-4 px-6">{user.user_id}</td>
                            <td className="py-4 px-6">{user.username}</td>
                            <td className="py-4 px-6">{user.email}</td>
                            <td className="py-4 px-6">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => deleteUser(user.user_id)} 
                                        className="bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 active:bg-red-800 shadow-md hover:shadow-lg"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(user)}
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
                        <h2 className="text-lg font-bold mb-4">Edit User</h2>
                        <input 
                            type="text" 
                            value={selectedUser.username} 
                            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} 
                            className="border p-2 w-full mb-2"
                        />
                        <input 
                            type="email" 
                            value={selectedUser.email} 
                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} 
                            className="border p-2 w-full mb-2"
                        />
                        <input 
                            type="text" 
                            value={selectedUser.avatar_url} 
                            onChange={(e) => setSelectedUser({ ...selectedUser, avatar_url: e.target.value })} 
                            className="border p-2 w-full mb-4"
                        />
                        <div className="flex justify-between">
                            <button 
                                onClick={updateUser} 
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

export default Users;