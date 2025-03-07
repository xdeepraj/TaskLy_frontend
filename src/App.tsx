import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
