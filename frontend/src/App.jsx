import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Users from "./pages/Users";
import Stats from "./pages/Stats";
import Problems from "./pages/Problems";
import Solves from "./pages/Solves";
import Discussions from "./pages/Discussions";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow min-h-screen bg-white">                    
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Stats" element={<Stats />} />
                        <Route path="/Users" element={<Users />} />
                        <Route path="/Problems" element={<Problems />} />
                        <Route path="/Solves" element={<Solves />} />
                        <Route path="/Discussions" element={<Discussions />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;