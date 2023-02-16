// Do not name this Array - it breaks things

class SeisArray{

    constructor(){
        this.height = 500
        this.width = 500
        this.n_stations = 11
        this.reference_station = 5
        this.max_slowness = 20 //s/deg

        this.scale_length = 100
        this.scale_y = this.height - 50
        this.scale_x = this.width- this.scale_length - 25
        this.scale_edge_length = 10
        this.map_width_degrees = 2
        this.map_height_degrees = (this.width/this.height)*this.map_width_degrees
        this.scale_width_degrees = ((this.scale_length/this.width)*this.map_width_degrees).toFixed(2)
    }

    renderArray(){
        var that = this;
        const form = d3.select("body").append("form")
        form.append("label").text("Enter Slowness (s/deg): ")
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

                // Limit the slowness values
                if (s_x > that.max_slowness){
                    s_x = that.max_slowness
                    d3.selectAll("#slowness-textfieldx").node().value = 20
                }

                if (s_y > that.max_slowness){
                    s_y = that.max_slowness 
                    d3.selectAll("#slowness-textfieldy").node().value = 20
                }

                var myColor = d3.scaleSequential().domain([that.max_td*-1, that.max_td])
                    .interpolator(d3.interpolateRdBu);

                d3.selectAll("circle")
                    .each(function(d){
                        // calculate the time shift to subtract from the reference stations travel-time
                        // If the plane waves at a station before the reference station, the time
                        // shift needs to be positive. If it arrives later, the time shift needs
                        // to be negative
                        var val = (d.rx*s_x)+(d.ry*s_y)
                        
                        // update ts in data
                        var data = d3.select(this).data()
                        data[0]["ts"] = val.toFixed(1)
                        
                        d3.select(this).attr("value", val)
                        .attr("fill", d => myColor(val))
                        .data(data);
                    })
            })
            //.on("click", this.runOnClick)

        const svg = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("border", "1px solid black")

        // scale bar
        const line = d3.line().context(null);
        svg.append("path")
            .attr("d", line([[this.scale_x, this.scale_y+this.scale_edge_length],
                 [this.scale_x, this.scale_y],
                 [this.scale_x+this.scale_length, this.scale_y],
                 [this.scale_x+this.scale_length, this.scale_y+this.scale_edge_length]]))
            .attr("stroke", "black")
            .attr("fill", "none")
        svg.append("text").text(this.scale_width_degrees + " deg").attr("x", this.scale_x+(this.scale_length/4)).attr("y", this.scale_y-2)

        var stations = this.initializeStations()

        svg.selectAll("circle")
        .data(stations)
        .join("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", 10)
          .attr("id", d=>'stat'.concat(d.index))
          .on('mouseover', function (d, i) {
            // change circle opacity and outline
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.65')
                 .attr("stroke", "black");
            // display distance and time shift
            d3.select(this).append("title").text(function(d, i){
                return "distance: " + d.r.toFixed(2) + " deg" + "\n" + "time shift: " + d.ts + " s"
                })     
            })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')
                .attr("stroke", "none");
            d3.select(this).select('title').remove()
    });

        svg.select("#stat".concat(this.reference_station))
            .attr("fill", "red")

        this.myColor = d3.scaleSequential().domain([this.max_td*-1, this.max_td])
                .interpolator(d3.interpolateRdBu);

        // Set up color bar
        const cb_div = d3.select("body").append("div")
        const canvas = cb_div.append("canvas")
        canvas.attr("width", this.width)
             .attr("height", 25)
             .style("border", "1px solid black")
        
        const context= canvas.node().getContext("2d");
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.node().width, canvas.node().height)
        
        // Fill in the color bar - first half
        var bwid = this.width/21
        for (let i=10; i > 0; i+=-1){
            context.fillStyle = this.myColor(-1*i*this.max_td/10)
            context.fillRect((10-i)*bwid, 0, 
            (10-i)*bwid+bwid, canvas.node().height)
        }
        
        // Fill in the color bar - middle + second half
        var start = 9*bwid+bwid 
        for (let i=0; i < 11; i+=1){
            context.fillStyle = this.myColor(i*this.max_td/10)
            context.fillRect(start+i*bwid, 0, start+i*bwid+bwid, canvas.node().height)
        }

        var label_svg = d3.select("body").append("svg")
        label_svg.attr("width", this.width).attr("height", 40)
        label_svg.append("text").text("Min. Time Shift").attr("x", 0).attr("y", 20)
        label_svg.append("text").text("Max. Time Shift").attr("x", this.width-110).attr("y", 20)

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
            // use rx, ry in degrees given map scale
            var rx = ((x - that.ref_x)/that.width)*that.map_width_degrees
            var ry = ((y - that.ref_y)/that.height)*that.map_height_degrees
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
                    theta: theta,
                    ts: 0,
            }
        })

        // Compute the maximum time delay given the array geometry
        // var max_sx = max_theta*180/Math.PI
        // var max_sy = 90 - max_sx
        var max_sx = 0
        var max_sy = 0
        if (Math.abs(Math.cos(max_theta)) > 1E-5){
            max_sy = this.max_slowness*Math.cos(max_theta)
        }
        if (Math.abs(Math.sin(max_theta)) > 1E-5){
            max_sx = this.max_slowness*Math.sin(max_theta)
        }
        this.max_td = max_rx*max_sx+max_ry*max_sy
        return stations
    }
}