import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "123456" });

    // 🔹 查询所有用户
    useEffect(() => {
        axios.get("http://localhost:6000/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    // 🔹 添加新用户
    const addUser = () => {
        axios.post("http://localhost:6000/api/users", newUser)
            .then(() => {
                alert("User added successfully!");
                window.location.reload();
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold">👤 User Management</h1>

            <h2 className="text-xl mt-5">➕ Add New User</h2>
            <input type="text" placeholder="Username" onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
            <input type="email" placeholder="Email" onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            <button onClick={addUser} className="bg-green-500 text-white px-4 py-2">Add</button>

            <h2 className="text-xl mt-5">📜 User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>{user.username} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}

export default Users;