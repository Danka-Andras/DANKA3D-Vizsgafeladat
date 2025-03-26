import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { LuShoppingBasket, LuUserRound, LuUsersRound, LuSearch, LuTruck, LuLogOut } from "react-icons/lu";

const API_BASE_URL = "http://localhost:5277/api";

const Navbar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/User/me`, { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/User/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Pass the search query to the parent component
  };

  return (
    <nav className={`navbar ${menuOpen ? "expanded" : ""}`}>
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">DANKA3D</Link>
        </div>

        <button className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>

        <ul className="navbar-ul">
          {location.pathname === "/" && (
            <li className="search-bar">
              <LuSearch className="search-icon" />
              <input
                type="text"
                placeholder="Keresés..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
            </li>
          )}

          <li><Link to="/basket"> <LuShoppingBasket /> Kosár</Link></li>
          <li><Link to="/notifications"> <LuTruck /> Rendelések</Link></li>
          <li><Link to="/aboutus"> <LuUsersRound /> Rólunk</Link></li>

          {isLoggedIn ? (
            <li className="logout-button" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <LuLogOut /> Kijelentkezés
            </li>
          ) : (
            <li className="profile-button"><Link to="/login"> <LuUserRound /> Bejelentkezés</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
