import { useEffect, useState } from "react";
import axios from "axios";

function Solves() {
    const [solves, setSolves] = useState([]);
    const [newSolve, setNewSolve] = useState({ user_id: "", problem_id: "", status: "Accepted", attempts: 1 });

    // 🔹 查询所有刷题记录
    useEffect(() => {
        axios.get("http://localhost:1234/api/solves")
            .then(res => setSolves(res.data))
            .catch(err => console.error(err));
    }, []);

    // 🔹 新增刷题记录
    const addSolve = () => {
        axios.post("http://localhost:1234/api/solves", newSolve)
            .then(() => {
                alert("新增刷题记录成功！");
                window.location.reload();
            })
            .catch(err => console.error(err));
    };

    // 🔹 删除刷题记录
    const deleteSolve = (id) => {
        axios.delete(`http://localhost:1234/api/solves/${id}`)
            .then(() => {
                alert("删除成功！");
                setSolves(solves.filter(s => s.solve_id !== id));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold">📌 刷题记录</h1>

            <h2 className="text-xl mt-5">🔹 添加刷题记录</h2>
            <input type="number" placeholder="用户ID" onChange={e => setNewSolve({ ...newSolve, user_id: e.target.value })} />
            <input type="number" placeholder="题目ID" onChange={e => setNewSolve({ ...newSolve, problem_id: e.target.value })} />
            <select onChange={e => setNewSolve({ ...newSolve, status: e.target.value })}>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Time Limit Exceeded">Time Limit Exceeded</option>
            </select>
            <button onClick={addSolve} className="bg-blue-500 text-white px-4 py-2">新增</button>

            <h2 className="text-xl mt-5">🔹 刷题记录列表</h2>
            <ul>
                {solves.map(s => (
                    <li key={s.solve_id}>
                        {s.user_id} - {s.problem_id} - {s.status} - {s.attempts}
                        <button onClick={() => deleteSolve(s.solve_id)} className="bg-red-500 text-white px-2 py-1 ml-3">删除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Solves;