import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "../stylesheets/index.css";
import "../stylesheets/lines.css";

function Lines() {
    const [graphData, setGraphData] = useState([]);
    const [graphSize, setGraphSize] = useState({ width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 });
    const [timeframe, setTimeframe] = useState("-1h"); // Default timeframe: Last Hour
    const [device, setDevice] = useState("all"); // Default: Show overall power
    const [appliances, setAppliances] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/power-data/?start=${timeframe}`);
            const jsonData = await response.json();

            if (!jsonData.appliances) {
                console.error("Invalid data format:", jsonData);
                return;
            }

            if (appliances.length === 0) {
                setAppliances(jsonData.appliances.map(appliance => appliance.entity_id));
            }

            // Determine downsampling interval
            let downsampleInterval = 1; // Default: Keep all points
            if (timeframe === "-1d") downsampleInterval = 10; // Keep every 10th point (~5-minute interval)
            if (timeframe === "-1w") downsampleInterval = 60; // Keep every 60th point (~30-minute interval)

            const formattedData = jsonData.appliances
                .filter(appliance => device === "all" || appliance.entity_id === device)
                .map(appliance => ({
                    x: appliance.data.filter((_, index) => index % downsampleInterval === 0).map(entry => new Date(entry.time)), 
                    y: appliance.data.filter((_, index) => index % downsampleInterval === 0).map(entry => entry.power_w),
                    type: "scatter",
                    mode: "lines+markers",
                    name: appliance.entity_id,
                    marker: { color: device === "all" ? "blue" : "red" },
                    line: { shape: "linear" }
                }));

            setGraphData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const resize = () => {
            setGraphSize({ width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 });
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [timeframe, device]);

    return (
        <div className="container">
            <div className="timeframe-buttons">
                <button onClick={() => setTimeframe("-1h")} className={timeframe === "-1h" ? "active" : ""}>Last Hour</button>
                <button onClick={() => setTimeframe("-1d")} className={timeframe === "-1d" ? "active" : ""}>Last Day</button>
                <button onClick={() => setTimeframe("-1w")} className={timeframe === "-1w" ? "active" : ""}>Last Week</button>
            </div>

            <div className="graph-container">
                <h1>Power Usage Over Time</h1>
                <Plot
                    data={graphData}
                    layout={{
                        width: graphSize.width,
                        height: graphSize.height,
                        autosize: true,
                        title: { text: "Power Usage Over Time", font: { size: 24, color: "#ffffff" } },
                        xaxis: { 
                            title: "Time", 
                            type: "date", 
                            gridcolor: "#444", 
                            tickfont: { color: "#ffffff" } 
                        },
                        yaxis: { 
                            title: "Power (W)", 
                            gridcolor: "#444", 
                            tickfont: { color: "#ffffff" } 
                        },
                        plot_bgcolor: "#1e1e2f",  // Dark theme background
                        paper_bgcolor: "#1e1e2f", // Remove paper-like effect
                        font: { color: "#ffffff" }, // White text for contrast
                        legend: { font: { color: "#ffffff" } }, // Better visibility
                        margin: { l: 60, r: 20, t: 50, b: 50 },
                        hovermode: "x unified", // Improve hover interaction
                        dragmode: false,
                    }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                />

            </div>

            <div className="device-selection">
                <h2>Select Appliance</h2>
                <button onClick={() => setDevice("all")} className={device === "all" ? "active" : ""}>Overall Watts</button>
                {appliances.map(appliance => (
                    <button key={appliance} onClick={() => setDevice(appliance)} className={device === appliance ? "active" : ""}>
                        {appliance}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Lines;
