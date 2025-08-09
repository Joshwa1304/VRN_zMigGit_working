import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      setError("");
      const response = await axios.post("http://localhost:9090/login", {
        username,
        password,
      });
      const result = response.data;
      if (result.includes("Role")) {
        const role = result.includes("admin") ? "admin" : "user";

        // Optional: Save user info to localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        // Navigate to respective dashboard
        if (role === "admin") {
          navigate("/Admin/Dashboard");
        } else {
          navigate("/User/Dashboard");
        }
        
      }
      else{
        setMessage('Oops! The username or password you entered is incorrect.')
      }
      
      console.log(response.data);
    } catch (err) {
      setError("❌ Something went wrong on the server. Please try again shortly.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3f3f3f]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <h1 className="text-2xl text-center text-[#840227] font-bold mb-4">
          Login
        </h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {message && (
          <p className="text-red-600 text-sm text-center">{message}</p>
        )}

        <div>
          <label className="block text-[#840227] font-bold mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#840227]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[#840227] font-bold mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#840227]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#840227] hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
