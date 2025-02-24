import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
    const [users, setUsers] = useState([]); // User list
    const [searchId, setSearchId] = useState(""); // Search by user_id
    const [user, setUser] = useState(null); // Single user info
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const usersPerPage = 20; // Users per page

    // Fetch all users
    useEffect(() => {
        axios.get("http://localhost:1234/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    // Search for a single user
    const searchUser = () => {
        if (!searchId.trim()) {
            alert("Please enter a User ID to search!");
            return;
        }
        axios.get(`http://localhost:1234/api/users/${searchId}`)
            .then(res => setUser(res.data))
            .catch(err => {
                console.error(err);
                alert("User not found");
            });
    };

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

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

    return (
        <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold text-indigo-600">🚀 User Management</h1>

            {/* 🔍 Search for a user */}
            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700">🔍 Search for a User</h2>
                <div className="flex mt-2">
                    <input 
                        type="text" 
                        placeholder="Enter User ID..." 
                        value={searchId} 
                        onChange={e => setSearchId(e.target.value)} 
                        className="border p-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button onClick={searchUser} className="bg-indigo-500 hover:bg-red-500 text-white px-4 py-2 rounded-r-lg transition duration-300">Search</button>
                </div>
            </div>

            {user && (
                <div className="mt-6 p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
                    <h3 className="text-lg font-bold text-gray-800">Search Result:</h3>
                    <p className="mt-2"><strong className="text-indigo-600">User ID:</strong> {user.user_id}</p>
                    <p><strong className="text-indigo-600">Username:</strong> {user.username}</p>
                    <p><strong className="text-indigo-600">Email:</strong> {user.email}</p>
                    <p><strong className="text-indigo-600">Avatar:</strong> <img src={user.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full mt-2" /></p>
                </div>
            )}

            {/* 📋 User list */}
            <div className="mt-10 w-full max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-700">📋 User List</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-indigo-500 text-white">
                                <th className="py-3 px-4 text-left">User ID</th>
                                <th className="py-3 px-4 text-left">Username</th>
                                <th className="py-3 px-4 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.user_id} className="border-b hover:bg-gray-100 transition">
                                    <td className="py-3 px-4">{user.user_id}</td>
                                    <td className="py-3 px-4">{user.username}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination controls */}
                <div className="flex justify-center mt-4 flex-wrap gap-2">
                    {generatePagination().map((page, index) => (
                        <button 
                            key={index} 
                            onClick={() => typeof page === 'number' && setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition duration-200 
                                ${currentPage === page ? 'bg-indigo-500 text-black' : 'bg-gray-200'} 
                                hover:bg-red-500 hover:text-black 
                                active:bg-indigo-700 active:text-white`}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Users;
