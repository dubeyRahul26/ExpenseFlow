import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
                    bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-xl
                   bg-slate-900/70 backdrop-blur
                   border border-slate-800 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-slate-100 mb-6 text-center">
          Sign In
        </h1>

        {error && (
          <p className="text-rose-400 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          className="w-full mb-4 p-3 rounded-lg text-sm
                     bg-slate-800 text-slate-100
                     border border-slate-700
                     placeholder-slate-400
                     focus:outline-none focus:ring-2
                     focus:ring-indigo-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-6 p-3 rounded-lg text-sm
                     bg-slate-800 text-slate-100
                     border border-slate-700
                     placeholder-slate-400
                     focus:outline-none focus:ring-2
                     focus:ring-indigo-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full py-3 rounded-lg font-medium
                     text-white bg-linear-to-r
                     from-indigo-500 to-violet-500
                     hover:from-indigo-600 hover:to-violet-600
                     active:scale-[0.98] transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-slate-400 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-medium hover:text-indigo-300"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
