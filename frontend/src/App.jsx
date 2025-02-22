import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Solves from "./pages/Solves";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/solves" element={<Solves />} />
            </Routes>
        </Router>
    );
}

export default App;