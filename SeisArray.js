// Do not name this Array - it breaks things

class SeisArray{

    constructor(){
        this.height = 500
        this.width = 500
        this.n_stations = 11
        this.reference_station = 5
    }

    renderArray(){
        var that = this;
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
            .on("click", function(){
                var s_x = d3.selectAll("#slowness-textfieldx").node().value
                var s_y = d3.selectAll("#slowness-textfieldy").node().value
        
                d3.selectAll("circle")
                .each(d => console.log(that.delayTime(d.x, d.y, s_x, s_y)))
            })
            //.on("click", this.runOnClick)

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

        var ref_stat = svg.select("#stat".concat(this.reference_station))
        ref_stat.attr("fill", "red")

        this.ref_x = ref_stat.attr("cx")
        this.ref_y = ref_stat.attr("cy")
    }

    initializeStations(){
        var stations = d3.range(this.n_stations).map(i =>({
            x: (this.width/this.n_stations/2)+(this.width/this.n_stations)*i,
            y: this.height/2,
            index: i
        }))

        return stations
    }

    // Stopped using this function because there was no way to pass it the "that"
    // value, so I could not call delayTime. Could move delayTime inside this function
    // but then I also need to change the way of getting this.ref_x and ref_y
    // runOnClick(that){
    //     const s_x = d3.selectAll("#slowness-textfieldx").node().value
    //     const s_y = d3.selectAll("#slowness-textfieldy").node().value

    //     d3.selectAll("circle")
    //         .each(d => console.log(that.delayTime(d.x, d.y, s_x, s_y)))
    // }   
    
    delayTime(x, y, s_x, s_y){
        const r_x = x - this.ref_x
        const r_y = y - this.ref_y
        
        return (r_x*s_x)+(r_y*s_y)
        
    }
}