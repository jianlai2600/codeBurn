import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Users from "./pages/Users";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow min-h-screen bg-white">                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Users" element={<Users />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;