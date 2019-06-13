// https://www.d3-graph-gallery.com/graph/circular_barplot_basic.html

var RP_Vis = function() {
    var newRP = {
            rose_plot: function(svg, data, color_scheme) {

                $(".VisualR1N2").find("h3").remove();
                $(".VisualR1N2").find("h2").remove();
                $(".VisualR1N2").prepend("<h3 style=\"text-align: center\">Click a Bar to View Relevance to Category Sub-Titles</h3>");
                $(".VisualR1N2").append("<h2 style=\"text-align: center\">Relevance of Selected Courses to General Job Categories</h2>")

                svg.selectAll("g").remove();

                // set the dimensions and margins of the graph
                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom,
                    innerRadius = 20,
                    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

                // append the svg object to the body of the page
                var svg = d3.select("#" + svg.attr("id"))
                            .append("g")
                                .attr("transform", "translate(" + (width/2) + "," + ( height/2 )+ ")"); // Add 100 on Y translation, cause upper bars are longer

                var color = d3.scaleOrdinal(color_scheme);
                // console.log(color_scheme)

                // X scale
                var x = d3.scaleBand()
                            .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
                            .align(0)
                            .domain( data.map(function(d) { return d.label; } )); // The domain of the X axis is the list of states.

                // Y scale
                var y = d3.scaleRadial()
                            .range([innerRadius, outerRadius])   // Domain will be define later.
                            .domain([0, 10]); // Domain of Y is from 0 to the max seen in the data

                

                // Add bars
                svg.append("g")
                    .selectAll("path")
                    .data(data)
                    .enter()
                    .append("path")
                    .attr("fill", function(d) { return color(d.label);})
                    .on("click", function(d) { newRP.dispatch.call("selected_by_rose",{},
                                                                    [d.label, color(d.label)]); })
                    .on("mouseover", function(d){d3.select(this).style("cursor", "pointer")})
                    .on("mouseout", function(d){d3.select(this).style("cursor", "")})

                    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                        .innerRadius(innerRadius)
                        .outerRadius(function(d) { return y(d['value']); })
                        .startAngle(function(d) { return x(d.label); })
                        .endAngle(function(d) { return x(d.label) + x.bandwidth(); })
                        .padAngle(0.01)
                        .padRadius(innerRadius))
                        
                        


                // legend
                // console.log(color.domain())
                var legend = svg.selectAll(".legend")
                                .data(color.domain())
                                .enter().append("g")
                                .attr("class", "legend")
                                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                // Add legend rect
                legend.append("rect")
                        .attr("x", -width/2)
                        .attr("y", -height/2)
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", color);

                // Add legend text
                legend.append("text")
                        .attr("x", -width/2+12)
                        .attr("y", -height/2+6)
                        .attr("dy", ".35em")
                        .style("text-anchor", "start")
                        .style("font-size", 10)
                        .text(function(d) { return d; });
            },
            dispatch: d3.dispatch("selected_by_rose")
        }
    return newRP
}

var get_career_data = function(job_idx) { 
    var titles = new Set()
    for (j = 0; j < job_data.length; j++){
            titles.add(job_data[j]['title'])
    }
    // console.log(titles)
  
    var res = [];
  
    titles.forEach( function(d){ // console.log(d);
                                    res.push({label: d, value: 0}) 
                                    })
    
            
  
    for (i = 0; i < job_idx.length; i++){
            for (k = 0; k < res.length; k++){
                    if (job_data[+job_idx[i]]['title'] == res[k]['label']) {res[k]['value']+=(job_idx.length-i)/job_idx.length/4; break;}
                    }
            }
    
    // console.log(res)
    return res
  };
