import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

// Iconok
import { LuShoppingBasket, LuUserRound, LuUsersRound, LuSearch, LuBell } from "react-icons/lu";
// Iconok vége

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${menuOpen ? 'expanded' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">DANKA3D</Link>
        </div>

        <button className="hamburger-menu" onClick={handleMenuToggle}>
          &#9776;
        </button>

        <ul className="navbar-ul">
          <li className="search-bar">
            <LuSearch className="search-icon" />
            <input
              type="text"
              placeholder="Keresés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </li>

          <li><Link to="/basket"> <LuShoppingBasket /> Kosár</Link></li>
          <li><Link to="/notifications"> <LuBell /> Értesítések</Link></li>
          <li><Link to="/aboutus"> <LuUsersRound /> Rólunk</Link></li>
          {/* <li><Link to="#"> <FaUsers /> Admin</Link></li> */}
          <li className="profile-button"><Link to="/login"> <LuUserRound /> Bejelentkezés</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
