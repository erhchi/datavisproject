var SP_Vis = function() {
    var newSP = {
        scatterplot: function(svg, data) {
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom;

            var x = d3.scaleLinear()
                .range([0, width]);

            var y = d3.scaleLinear()
                .range([height, 0]);

            var color = d3.scaleOrdinal(d3.schemeCategory10);

            var xAxis = d3.axisBottom(x);

            var yAxis = d3.axisLeft(y);

            svg.selectAll("g").remove();

            var svg = d3.select("#" + svg.attr("id"))
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            
            x.domain(d3.extent(data, function(d) { return d.v1; })).nice();
            y.domain(d3.extent(data, function(d) { return d.v2; })).nice();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", height-6)
                .style("text-anchor", "end")
                .data(data)
                .text(function(d) {return d.v1_name + " (cm)";})
                .style("font-size", 10);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
            
            svg.append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .data(data)
                .text(function(d) {return d.v2_name + " (cm)";})
                .style("font-size", 10);

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d.v1); })
                .attr("cy", function(d) { return y(d.v2); })
                .style("fill", function(d) { return color(d.label); });

            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .style("font-size", 10)
                .text(function(d) { return d; });
        }
    };
    return newSP;
};