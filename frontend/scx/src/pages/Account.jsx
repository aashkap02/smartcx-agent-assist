import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../lib/api";

export default function Account() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(API + "/auth/me", { headers: { Authorization: "Bearer " + token } })
      .then((r) => (r.ok ? r.json() : null))
      .then(setVerified)
      .catch(() => setVerified(null));
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Hi, {user?.name || "there"} 👋</h2>
        <p className="auth-sub">You are logged in.</p>
        <div className="account-row"><span>Name</span><b>{user?.name}</b></div>
        <div className="account-row"><span>Email</span><b>{user?.email}</b></div>
        <div className="account-row">
          <span>Token check</span>
          <b style={{ color: verified ? "var(--accent)" : "var(--muted)" }}>
            {verified ? "verified by server ✓" : "checking..."}
          </b>
        </div>
        <button className="btn btn-solid" onClick={() => navigate("/demo")}>Go to the demo</button>
        <button className="btn btn-ghost" onClick={() => { logout(); navigate("/"); }}>Log out</button>
      </div>
    </div>
  );
}