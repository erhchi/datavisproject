// https://bl.ocks.org/caravinden/eb0e5a2b38c8815919290fa838c6b63b

var BC_Vis = function() {
    var newBC = {
        bar_cahrt: function(svg, data, title) {
            // set the dimensions and margins of the graph
            var margin = {top: 60, right: 20, bottom: 30, left: 350},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom;

            // set the ranges
            var y = d3.scaleBand()
                    .range([height, 0])
                    .padding(0.1);

            var x = d3.scaleLinear()
                    .range([0, width]);
                    
            svg.selectAll("g").remove();

            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select("#" + svg.attr("id"))
                        .append("g")
                        .attr("transform", 
                            "translate(" + margin.left + "," + margin.top + ")");

            // plot the title of the graph
            svg.append("text")
                .attr("x", 100 + (+svg.attr("width") / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "40px") 
                .style("text-decoration", "underline")  
                .text(title);
            
            // format the data
            data.forEach(function(d) {
                d.relevance = +d.relevance;
            });

            // Scale the range of the data in the domains
            x.domain([0, d3.max(data, function(d){ return d.relevance; })])
            y.domain(data.map(function(d) { return d.job_title; }));
            //y.domain([0, d3.max(data, function(d) { return d.relevance; })]);

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                //.attr("x", function(d) { return x(d.relevance); })
                .attr("width", function(d) {return x(d.relevance); } )
                .attr("y", function(d) { return y(d.job_title); })
                .attr("height", y.bandwidth())
                .style("fill", function(d) {
                    console.log("saturate" in d);
                    if ("saturate" in d){
                        return d3.interpolateLab("white", d.color)(d.saturate)
                    } else {
                        return d.color;
                    }
                });
                // .style("stroke", function(d) { return d3.interpolateLab("white", d.color)(d.saturate);});

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));            
        }
    }
    return newBC
}



var get_bar_data = function(job_idx, selectedVar) {
    // selectedVar: [title_name, color]

    var cate_count = 0,
        valid_job_set = new Set();
    // create a job set for the selected title    
    for (j = 0; j < job_data.length; j++){
        if (job_data[j]["title"]==selectedVar[0]) { valid_job_set.add(j); cate_count+=1}
    }
    // extract the jobs' index from entire job index list if the jobs are in the set
    var valid_job_idx = []
    for (j = 0; j < job_idx.length; j++){
        if ( valid_job_set.has(job_idx[j]) ) {valid_job_idx.push(job_idx[j]) }
    }
    
    var res = [];
    // push the child nodes into the parent node
    for (j = 0; j < job_data.length; j++){    
        if (job_data[j]["title"]==selectedVar[0]) {
            for (i = 0; i < valid_job_idx.length; i++){
                if(valid_job_idx[i]==j){
                    // calculate the thickness
                    var relevance = 100 * (cate_count-i) / cate_count;
                    
                    res.push({'job_title': job_data[j]["sub_title"],
                              'relevance': relevance,
                              'color': selectedVar[1],
                              'name': selectedVar[0]});
                    break;
                }
            }
        }
    }
    res.sort(dynamicSort("relevance"));
    return res
}


var get_saturation_bar = function(sub_data, selected_conc_sim){
    // var selected_conc_sim = job_idx_by_groups[selected_conc];
    if (selected_conc_sim!=0) {

        var valid_idx_list = [];
        for (j=0; j<selected_conc_sim.length; j++) {
            if (sub_data[0].name == job_data[selected_conc_sim[j]]["title"]){
                valid_idx_list.push(selected_conc_sim[j])
            }
        }
        for (i=0; i<sub_data.length; i++) {
            for (j=0; j<valid_idx_list.length; j++) {
                if (sub_data[0].name == job_data[valid_idx_list[j]]["title"] && sub_data[i]["job_title"] == job_data[valid_idx_list[j]]["sub_title"]) {
                    var saturate_value = (valid_idx_list.length - j) / valid_idx_list.length;
                    // console.log(saturate_value)
                    if (saturate_value < 0.5){
                        var saturate_code = 0.05;
                    } else if (saturate_value < 0.9) {
                        var saturate_code = 0.7;
                    } else {
                        var saturate_code = 1.2;
                    }
                    sub_data[i].saturate = saturate_code 
                    break;
                } 
            }
        }
    } else {
        for (i=0; i<sub_data.length; i++) {
            sub_data[i].saturate = 0.9
        }
    }
    console.log(sub_data);
    return sub_data
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}