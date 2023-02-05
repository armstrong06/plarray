// Do not name this Array - it breaks things

class SeisArray{

    constructor(){
        this.height = 500
        this.width = 500
        this.n_stations = 11
        this.reference_station = 5
    }

    renderArray(){
        const form = d3.select("body").append("form")
        form.append("label").text("Enter Slowness: ")
            .attr("for", "slowness-textfield")
        form.append("input").attr("type", "text")
            .attr("value", "Sx")
            .attr("id", "slowness-textfieldx")
        form.append("input").attr("type", "text")
            .attr("value", "Sy")
            .attr("id", "slowness-textfieldy")
        form.append("input").attr("type", "button")
            .attr("value", "Run")
            .attr("id", "runButton")
            .on("click", this.runOnClick)

        const svg = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("border", "1px solid black")

        var stations = this.initializeStations()
        svg.selectAll("circle")
        .data(stations)
        .join("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", 10)
          .attr("id", d=>'stat'.concat(d.index))

        svg.select("#stat".concat(this.reference_station)).attr("fill", "red")
    }

    initializeStations(){
        var stations = d3.range(this.n_stations).map(i =>({
            x: (this.width/this.n_stations/2)+(this.width/this.n_stations)*i,
            y: this.height/2,
            index: i
        }))

        return stations
    }

    runOnClick(){
        console.log(d3.selectAll("#slowness-textfieldx").node().value)
        console.log(d3.selectAll("#slowness-textfieldy").node().value)
        d3.selectAll("circle")
            .each(d => console.log(d.x, d.y))
    }
}