import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr("");
    if (!email || !password) { setErr("Please fill in both fields."); return; }
    setLoading(true);
    try { await login(email, password); navigate("/account"); }
    catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-sub">Log in to your SmartCX account</p>
        {err && <div className="auth-err">{err}</div>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <button className="btn btn-solid" onClick={submit} disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
        <p className="auth-switch">No account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}