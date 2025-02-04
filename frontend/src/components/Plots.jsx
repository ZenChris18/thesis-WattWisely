import Plot from "react-plotly.js"

function Plots(){

    return(
        <div>
            <h1>Bar Plot</h1>
            <Plot data={[{
                // Datas
                x:[1,2,3],
                y:[1,2,3],
                type: "bar",
                mode: "lines+markers",
                maker: {color: "green"}
            }]}
                layout={{width:1200, height:600, title:"Simple Bar Plot"}}
                />
        </div>
    )
}

export default Plots