import {useState, useEffect} from "react";
import Plot from "react-plotly.js";

function Lines(){
    const [data, setData] = useState({x:[], y:[]});

    const fetchData = async() => {
        try{
            const response = await fetch("/MOCK_DATA.json"); 
            const jsonData = await response.json();
            
            // Assuming JSON format: [{ "day": 1, "watt_usage": 10 }, { "day": 2, "watt_usage": 15 }]
            const xData = jsonData.map(entry => entry.day);
            const yData = jsonData.map(entry => entry.watt_usage);
            
            setData({ x: xData, y: yData });
        } catch(error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(); 
    }, []);

    return(
        <div>
            <h1>Line Graph</h1>
            <button onClick={fetchData}>Update</button>
            <Plot
                data={[
                    {
                        x: data.x,
                        y: data.y,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "blue" },
                    },
                ]}
                layout={{ width: 1200, height: 600, title: "Watt Usage Over Time" }}
            />
        </div>
    );
}

export default Lines;
