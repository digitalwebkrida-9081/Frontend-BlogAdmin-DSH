import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Blog Admin DSH</h2>
      </div>
      <ul className="navbar-links">
        {user ? (
          <>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/create" className="btn-primary">
                Create Post
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid white",
                  color: "white",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  marginLeft: "10px",
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
