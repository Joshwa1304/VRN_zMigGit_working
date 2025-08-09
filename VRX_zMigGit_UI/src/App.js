import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Logout from "./Pages/Auth/Logout";
import AdminDashboard from "./Pages/Admin/Dashboard";
import UserDashboard from "./Pages/User/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
        <Route path="/User/Dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
