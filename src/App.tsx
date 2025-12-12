import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/MainPage";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
