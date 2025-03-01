import React, {useEffect, useState } from "react";
import "../stylesheets/startscreen.css";

function StartScreen({ onStart }) {
    const [blink, setBlink] = useState(true);

     //Blinking effect 
     useEffect(() => {
        const interval = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
     }, []);  

     return (
        <div className="start-screen" onClick={onStart}>
            <h1>Welcome to WattWisely</h1>
            <p className={`click-to-start ${blink ? "visible" : "hidden"}`}>
                Click to Start
            </p>
        </div>
     );
}

export default StartScreen;