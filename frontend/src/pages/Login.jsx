import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function GoogleRedirectLoginPage() {
    const navigate = useNavigate();

    // 在页面加载时检查 URL 是否包含 access_token
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes("access_token")) {
            const token = new URLSearchParams(hash.substring(1)).get("access_token");
            console.log("🎉 获取到了 access_token:", token);
    
            localStorage.setItem("access_token", token);
    
            // ✅ 发送 token 给后端换用户信息 & 保存
            axios.post(`${API_BASE_URL}/api/google-login`, { token })
                .then(res => {
                    console.log("✅ 用户信息保存成功:", res.data);
                    // 可以顺便把用户名等存下来
                    localStorage.setItem("user_name", res.data.name);
                    localStorage.setItem("email", res.data.email);
                    localStorage.setItem("picture", res.data.picture);
                    localStorage.setItem("google_id", res.data.google_id);
    
                    navigate("/Record"); // 登录后跳转
                })
                .catch(err => {
                    console.error("❌ 保存用户信息失败", err);
                });
        }
    }, [navigate]);

    const handleGoogleLogin = () => {
        const clientId = "33489629215-2lc7q8d3hek33j85ura2drsjpvt9h88o.apps.googleusercontent.com";
        const redirectUri = "http://localhost:5173/Login"; // 确保你在 Google Console 配置过
        const scope = "openid profile email";
        const responseType = "token";

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=select_account`;

        // 跳转到 Google 登录
        window.location.href = googleAuthUrl;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
            <h1 className="text-4xl font-bold mb-6 text-indigo-700">🌟 欢迎使用 Google 登录</h1>
            <button
                onClick={handleGoogleLogin}
                className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-red-700 transition-all"
            >
                使用 Google 登录 🚀
            </button>
        </div>
    );
}

export default GoogleRedirectLoginPage;