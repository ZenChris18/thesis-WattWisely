import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // react icon for hamburger menu
import "../stylesheets/index.css";
import "../stylesheets/navbar.css";

function Navbar() {
    const [isActive, setIsActive] = useState(false);

    const toggleNavbar = () => {
        setIsActive(!isActive);
    };

    return (
        <div>
            {/* Menu button is outside the navbar so it's always visible */}
            <button className="menu-button" onClick={toggleNavbar}>
                <FiMenu size={24} />
            </button>

            <div className={`navbar ${isActive ? "active" : ""}`}>
                {/* Close button inside the navbar */}
                <button className="close-button" onClick={toggleNavbar}>
                    <FiX size={24} />
                </button>

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
