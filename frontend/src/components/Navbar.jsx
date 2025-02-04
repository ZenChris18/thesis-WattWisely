import React from "react";
import { Link } from "react-router-dom";

function Navbar(){
    return(
        <div className="navbar">
            WattWisely
            <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/graph">Graphs</Link></li>
            <li><Link to="/achieve">Achievements</Link></li>
        </ul>
        </div>
    )
}

export default Navbar