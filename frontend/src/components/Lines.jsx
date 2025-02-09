import {useState, useEffect} from "react";
import Plot from "react-plotly.js";
import "../stylesheets/index.css";
import "../stylesheets/lines.css";

function Lines(){
    const [data, setData] = useState({x:[], y:[]});
    const [graphSize, setGraphSize] = useState({width: window.innerWidth * 0.9, height: window.innerHeight * 0.6});

    const fetchData = async() => {
        try{
            const response = await fetch("/MOCK_DATA.json"); 
            const jsonData = await response.json();
            
            // Assuming JSON format: [{ "day": 1, "watt_usage": 10 }, { "day": 2, "watt_usage": 15 }]
            const xData = jsonData.map(entry => entry.day);
            const yData = jsonData.map(entry => entry.watt_usage);
            
            setTimeout(() => {
                setData({ x: xData, y: yData });
            }, 500); 

        } catch(error) {
            console.error("Error fetching data:", error);
        }
    };

    // Graph Size
    useEffect(() => {
        const resize = () =>{
            setGraphSize({width: window.innerWidth * 0.9, height: window.innerHeight * 0.6});         
        };

        window.addEventListener("resize", resize);
        return() => window.addEventListener("resize", resize);
    }, []);

    useEffect(() => {
        fetchData(); 
    }, []);

    return(
        <div className="container">
            <div className="graph-container">
                <h1>Watt Usage</h1>
                <Plot
                    data={[
                        {
                            x: data.x,
                            y: data.y,
                            type: "scatter",
                            mode: "lines+markers",
                            marker: { color: "red" },
                            line: { shape: "linear" }
                        },
                    ]}
                    layout={{
                        width: graphSize.width,
                        height: graphSize.height,
                        autosize: true,
                        response: true,
                        title: {text:"Watt Usage per Day", font:{size: 30}},
                        transition: {
                            duration: 800, 
                            easing: "cubic-in-out"
                        },
                        frame: {
                            duration: 800,
                            redraw: true
                        }
                    }}
                    useResizeHandler={true}
                    config={true}
                    style={{width: "100%", height: "100%"}}
                />
            </div>
            <button onClick={fetchData}>Update</button>
        </div>
    );
}

export default Lines;
