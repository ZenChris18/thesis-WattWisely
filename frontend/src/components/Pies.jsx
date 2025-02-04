import Plot from "react-plotly.js"

function Pies(){
    return(
        <div>
            <Plot data={[{
                // Datas
                values: [10, 11, 12],
                labels: ["React", "VUE", "Angular"],
                type: "pie"
            }]}
            layout={{width:1200, height:600, title:"Simple Pie Chart"}}
            />
        </div>
    );
}

export default Pies