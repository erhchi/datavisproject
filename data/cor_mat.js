var CM_Vis = function() {
    var newCM = {
        corr_heatmap: function(svg, data) {
            // set the dimensions and margins of the graph
            var margin = {top: 30, right: 20, bottom: 30, left: 50},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3.select("#" + svg.attr("id"))
                        .append("g")
                        .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");
                        
                        
            
            // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
            var myGroups = d3.map(data, function(d){return d.group;}).keys().reverse()
            var myVars = d3.map(data, function(d){return d.variable;}).keys()

            // Build X scales and axis:
            var x = d3.scaleBand()
                        .range([ 0, width ])
                        .domain(myGroups)
                        .padding(0.05);

            svg.append("g")
                .style("font-size", 7)
                .style("font-weight", "bold")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .select(".domain").remove()

            // Build Y scales and axis:
            var y = d3.scaleBand()
                        .range([ height, 0 ])
                        .domain(myVars)
                        .padding(0.05);

            svg.append("g")
                .style("font-size", 7)
                .style("font-weight", "bold")
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove()

            // Build color scale
            var myColor = d3.scaleSequential()
                            .interpolator(d3.interpolateRdYlGn)
                            .domain([1,-1])

            // add the squares
            svg.selectAll()
                .data(data, function(d) {return d.group+':'+d.variable;})
                .enter()
                .append("rect")
                    .attr("x", function(d) { return x(d.group)})
                    .attr("y", function(d) { return y(d.variable) })
                    .attr("rx", 20)
                    .attr("ry", 20)
                    .attr("width", x.bandwidth() )
                    .attr("height", y.bandwidth() )
                    .style("fill", function(d) { return myColor(d.value)} )
                    .style("stroke-width", 4)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
                    .data(data)
                    .on("click", function(d) { newCM.dispatch.call("selected",{},[d.group, d.variable]); });

            svg.selectAll()
                .data(data, function(d) {return d.group+':'+d.variable;})
                .enter()
                .append("text")
                    .attr("x", function(d) { return x(d.group) + x.bandwidth()/2.5 })
                    .attr("y", function(d) { return y(d.variable)+ y.bandwidth()/1.8 })
                    .text(function(d) { return Math.round(d.value * 100)/100})
                    .style("font-size", 9)
                    .style("font-weight", "bold")


        },
        dispatch: d3.dispatch("selected")
    }
    return newCM;
}