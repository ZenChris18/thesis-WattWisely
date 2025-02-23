import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger (☰) and Close (✖)
import "../stylesheets/navbar.css";

function Navbar() {
    const [isActive, setIsActive] = useState(false);

    const toggleNavbar = () => {
        setIsActive(!isActive);
    };

    return (
        <div>
            {/* Menu Button: Toggles between ☰ and ✖ */}
            <button className="menu-button" onClick={toggleNavbar}>
                {isActive ? <FiX size={30} /> : <FiMenu size={30} />}
            </button>

            {/* Sidebar Navbar */}
            <div className={`navbar ${isActive ? "active" : ""}`}>
                <h4>WattWisely</h4>
                <ul className="navbar-menu">
                    <li><Link to="/" onClick={toggleNavbar}>Home</Link></li>
                    <li><Link to="/graph" onClick={toggleNavbar}>Graphs</Link></li>
                    <li><Link to="/achieve" onClick={toggleNavbar}>Achievements</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
