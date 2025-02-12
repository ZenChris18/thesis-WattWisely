import React, { useEffect, useState } from "react";
import "../stylesheets/index.css";
import "../stylesheets/progbar.css"

function Progbar(){
    const [filled, setFilled] = useState(0);
    const [loading, isLoading] = useState(false);
    
    useEffect(() =>{
        if(filled < 100 && loading){
            setTimeout(() => setFilled(prev => prev+=5), 50)
        }
    }, [filled, loading])

    return(
        <div className="container">
            <div className="progressbar">
                <div style={{
                    height: "100%",
                    width: `${filled}%`,
                    backgroundColor: "green",
                    transition: "width 0.6"
                }}>

                </div>
                <span className="progPercentage">
                    {filled}%
                </span>
            </div>
            <button className="up" onClick={() => {isLoading(true)}}>Go!</button>
        </div>
    )
}

export default Progbar