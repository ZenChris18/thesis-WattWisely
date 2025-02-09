import React from "react";
import {Link} from "react-router-dom";
import "../stylesheets/index.css";
//import "../stylesheets/navbar.css"

function Navbar(){
    return(
        <div className="navbar">
            <h4>WattWisely</h4>
            <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/graph">Graphs</Link></li>
            <li><Link to="/achieve">Achievements</Link></li>
        </ul>
        </div>
    )
}

export default Navbar