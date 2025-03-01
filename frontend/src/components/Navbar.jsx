import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi"; // Added FiLogOut icon
import "../stylesheets/index.css";
import "../stylesheets/navbar.css";

function Navbar({ onExit }) {
    const [isActive, setIsActive] = useState(false);

    const toggleNavbar = () => {
        setIsActive(!isActive);
    };

    return (
        <div>
            <button className="menu-button" onClick={toggleNavbar}>
                <FiMenu size={24} />
            </button>

            <div className={`navbar ${isActive ? "active" : ""}`}>
                <button className="close-button" onClick={toggleNavbar}>
                    <FiX size={24} />
                </button>

                <h4>WattWisely</h4>
                <ul className="navbar-menu">
                    <li><Link to="/" onClick={toggleNavbar}>Home</Link></li>
                    <li><Link to="/graph" onClick={toggleNavbar}>Graphs</Link></li>
                    <li><Link to="/achieve" onClick={toggleNavbar}>Achievements</Link></li>
                </ul>

                {/* Exit Button - Should be visible now */}
                <div className="exit-container">
                    <button className="exit-button" onClick={onExit}>
                        <FiLogOut size={20} /> Exit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
