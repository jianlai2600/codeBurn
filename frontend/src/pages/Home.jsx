import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

function Home() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const res = await fetch(
                    `https://djffddjy9j.execute-api.us-east-1.amazonaws.com/default/testFun?lat=${lat}&lon=${lon}`
                );
                const data = await res.json();
                setWeather({
                    temp: data.temperature.degrees,
                    desc: data.weatherCondition.description.text,
                    icon: data.weatherCondition.iconBaseUri + ".svg",
                    humidity: data.relativeHumidity,
                    wind: data.wind.speed.value,
                    isDaytime: data.isDaytime
                });
            } catch (err) {
                setError("Failed to fetch weather data.");
            }
        };
    
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(lat, lon);
            },
            (err) => {
                console.warn("定位失败，使用默认城市：上海", err);
                // fallback 上海坐标
                fetchWeather(31.2304, 121.4737);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-lg shadow-2xl p-12 text-center">
                <h1 className="text-5xl font-extrabold flex items-center justify-center gap-2">
                    🚀<span className="text-yellow-500">CodeBurn</span>
                </h1>
                <p className="text-lg opacity-80 mt-3">
                    Your ultimate LeetCode progress tracker & coding hub!
                </p>

                {weather && (
                    <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner">
                        <h2 className="text-xl font-bold mb-2">🌤 Current Weather</h2>
                        <div className="flex items-center justify-center gap-4">
                            <img src={weather.icon} alt="weather icon" className="w-16 h-16" />
                            <div className="text-left">
                                <p className="text-2xl font-semibold">{weather.temp}°C</p>
                                <p className="text-sm opacity-80">{weather.desc}</p>
                                <p className="text-sm opacity-70">💧 Humidity: {weather.humidity}%</p>
                                <p className="text-sm opacity-70">💨 Wind: {weather.wind} km/h</p>
                            </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-600 mt-4">{error}</p>}

                <div className="flex justify-center space-x-6 mt-6">
                    <a href="/Stats" target="_blank" rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-3 rounded-lg text-lg shadow-md transition-all hover:bg-gray-200 hover:text-white">
                        Database 📊
                    </a>

                    <a href="https://www.leetcode.com" target="_blank" rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-3 rounded-lg text-lg shadow-md transition-all hover:bg-gray-200 hover:text-white">
                        Visit LeetCode 🌍
                    </a>
                </div>

                <div className="flex justify-center space-x-6 mt-6">
                    <a href="/Login" target="_blank" rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-3 rounded-lg text-lg shadow-md transition-all hover:bg-gray-200 hover:text-white">
                        Start to record 🚀
                    </a>
                </div>

                <p className="text-sm opacity-90 mt-6">
                    ⚡ CodeBurn | LeetCode Tracker | 2024
                </p>
                <p className="text-sm opacity-90">Made with ❤️ by Felix</p>
            </div>
        </div>
    );
}

export default Home;
