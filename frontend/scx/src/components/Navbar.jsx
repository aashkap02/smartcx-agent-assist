import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const close = () => setOpen(false);

  const authButtons = user ? (
    <>
      <button className="btn btn-ghost" onClick={() => { navigate("/account"); close(); }}>{user.name.split(" ")[0]}</button>
      <button className="btn btn-solid" onClick={() => { logout(); navigate("/"); close(); }}>Log out</button>
    </>
  ) : (
    <>
      <button className="btn btn-ghost" onClick={() => { navigate("/login"); close(); }}>Log in</button>
      <button className="btn btn-solid" onClick={() => { navigate("/signup"); close(); }}>Sign up</button>
    </>
  );

  return (
    <nav>
      <div className="logo" onClick={() => { navigate("/"); close(); }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="28" height="20" rx="7" fill="#5eead4" />
          <path d="M10 28l4-4h2l-6 4z" fill="#5eead4" />
          <circle cx="11" cy="14" r="2" fill="#06251f" />
          <circle cx="16" cy="14" r="2" fill="#06251f" />
          <circle cx="21" cy="14" r="2" fill="#06251f" />
        </svg>
        <span>Smart<b>CX</b></span>
      </div>

      <div className={"nav-links" + (open ? " open" : "")}>
        <NavLink to="/" end onClick={close}>Home</NavLink>
        <NavLink to="/about" onClick={close}>About website</NavLink>
        <NavLink to="/contact" onClick={close}>Contact us</NavLink>
        <NavLink to="/demo" onClick={close}>Live demo</NavLink>
        <div className="mobile-auth">{authButtons}</div>
      </div>

      <div className="auth">{authButtons}</div>

      <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span className={open ? "x1" : ""} />
        <span className={open ? "x2" : ""} />
        <span className={open ? "x3" : ""} />
      </button>
    </nav>
  );
}