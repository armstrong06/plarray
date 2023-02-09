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

                var myColor = d3.scaleSequential().domain([that.max_td*-1, that.max_td])
                    .interpolator(d3.interpolateRdBu);

                d3.selectAll("circle")
                    .each(function(d){
                        var val = (d.rx*s_x)+(d.ry*s_y)
                        d3.select(this).attr("value", val)
                        .attr("fill", d => myColor(val))
                    })
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

        svg.select("#stat".concat(this.reference_station))
            .attr("fill", "red")

        this.myColor = d3.scaleSequential().domain([this.max_td*-1, this.max_td])
                .interpolator(d3.interpolateRdBu);

        const canvas = d3.select("body").append("canvas")
        canvas.attr("width", this.width)
            .attr("height", 25)
            .style("border", "1px solid black")
        const context = canvas.node().getContext("2d");
        for (let i=-100; i < 100; i=i++){
            context.fillStyle = this.myColor(this.max_td/i)
            context.fillRect(0, 0, this.width/200, canvas.node().height)
        }
    }

    initializeStations(){
        this.ref_x = (this.width/this.n_stations/2)+(this.width/this.n_stations)*this.reference_station
        this.ref_y = this.height/2
        var that = this
        // var stations = d3.range(this.n_stations).map(i =>({
        //     x: (this.width/this.n_stations/2)+(this.width/this.n_stations)*i,
        //     y: this.height/2,
        //     index: i,
        // }))

        var max_r = 0;
        var max_theta = 0;
        var max_rx = 0;
        var max_ry = 0;
        var stations = d3.range(this.n_stations).map(function(i) {
            var x = (that.width/that.n_stations/2)+(that.width/that.n_stations)*i
            var y = that.height/2
            var rx = x - that.ref_x
            var ry = y - that.ref_y
            var r = Math.sqrt(Math.pow(rx, 2)+Math.pow(ry, 2))
            var theta = Math.atan2(rx, ry)

            if (r > max_r){
                max_r = r
                max_theta = theta
                max_rx = rx
                max_ry = ry
            }

            return {x: x,
                    y: y,
                    index: i,
                    rx: rx,
                    ry: ry,
                    r: r,
                    theta: theta
            }
        })

        // Compute the maximum time delay given the array geometry
        var max_sx = max_theta*180/Math.PI
        var max_sy = 90 - max_sx
        this.max_td = max_rx*max_sx+max_ry*max_sy

        return stations
    }
}