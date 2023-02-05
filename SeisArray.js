// Do not name this Array - it breaks things

class SeisArray{

    constructor(){
        this.height = 500
        this.width = 500
        this.n_stations = 11
    }

    renderArray(){
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
    }

    initializeStations(){
        var stations = d3.range(this.n_stations).map(i =>({
            x: 10+(this.width/this.n_stations)*i,
            y: this.height/2,
            index: i
        }))

        return stations
    }

}