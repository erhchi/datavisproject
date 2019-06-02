// maybe this one:  https://bl.ocks.org/FrissAnalytics/974dc299c5bc79cc5fd7ee9fa1b0b366

var TP_Vis = function() {
    var newTP = {
        tree_path: function(svg, data, linkage_color = "black") {
                // https://bl.ocks.org/d3noob/76d6fa0dff4af77544da9dd69aef9249
                // set the dimensions and margins of the diagram


                var margin = {top: 20, right: 450, bottom: 20, left: 350},
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom;
                

                // declares a tree layout and assigns the size
                var treemap = d3.tree()
                    .size([height, width]);

                //  assigns the data to a hierarchy using parent-child relationships
                var nodes = d3.hierarchy(data, function(d) {
                    return d.children;
                });

                // maps the node data to the tree layout
                nodes = treemap(nodes);
                


                svg.selectAll("g").remove();

                // append the svg object to the body of the page
                // appends a 'group' element to 'svg'
                // moves the 'group' element to the top left margin
                var g = svg.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // adds the links between the nodes
                var link = g.selectAll(".link")
                            .data( nodes.descendants().slice(1))
                        .enter().append("path")
                            .attr("class", "link")
                            .style("stroke", function(d) {
                                                if (linkage_color!="black"){
                                                    return d3.interpolateLab("white", linkage_color)(d.data.saturate)
                                                } else {
                                                    return linkage_color
                                                }
                                            }
                                ) // function(d) { return d.data.level; }
                            .style("fill", "none")
                            .style("stroke-width", function(d) { return d.data.thickness+"px"; })
                            .attr("d", function(d) {
                            return "M" + d.y + "," + d.x
                                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                                + " " + d.parent.y + "," + d.parent.x;
                            });

                // adds each node as a group
                var node = g.selectAll(".node")
                            .data(nodes.descendants())
                        .enter().append("g")
                            .attr("class", function(d) { 
                            return "node" + 
                                (d.children ? " node--internal" : " node--leaf"); })
                            .attr("transform", function(d) { 
                            return "translate(" + d.y + "," + d.x + ")"; });

                // adds symbols as nodes
                // https://bl.ocks.org/d3indepth/bae221df69af953fb06351e1391e89a0
                // [d3.symbolCircle, d3.symbolCross, d3.symbolDiamond, d3.symbolSquare, d3.symbolStar, ad3.symbolTriangle, d3.symbolWye]
                node.append("path")
                    .style("stroke", function(d) { return d.data.type; })
                    .style("fill", function(d) { return d.data.level; })
                    .attr("d", d3.symbol()
                        .size(function(d) { return d.data.value * 30 * d.data.thickness/10; } )
                        .type(function(d) { if (d.data.value > 9) {
                            return d3.symbolDiamond; } else {
                                return d3.symbolCircle;}
                        }));

                // adds the text to the node
                node.append("text")
                    .attr("dy", ".35em")
                    .attr("x", function(d) { return d.children ? 
                        (d.data.value + 4) * -1 : d.data.value + 4 })
                    .style("text-anchor", function(d) { 
                        return d.children ? "end" : "start"; })
                    .text(function(d) { return d.data.name; });
        }
    };
    return newTP;
}


var get_path_data = function(job_idx, selectedVar) {
    // selectedVar: [title_name, color]
    
    // setting the thickness variables
    var most_thick = 10,
        most_thin = 0.05;

    // create the parent node 
    var res = {"name": selectedVar[0],
                "value": 20, // the size of node
                "type": "black", // the edge of node
                "level": selectedVar[1], // the color of node
                "thickness": most_thick*2, // parent thickness for plot the node size, not link
                "children": []}

    var valid_count = 0,
        cate_count = 0,
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
    
    // push the child nodes into the parent node
    for (j = 0; j < job_data.length; j++){    
        if (job_data[j]["title"]==selectedVar[0]) {
            for (i = 0; i < valid_job_idx.length; i++){
                if(valid_job_idx[i]==j){
                    // calculate the thickness
                    var thickness = (cate_count-i) / cate_count,
                        scaled_thickness = most_thin + (most_thick-most_thin) * thickness;
                    
                    
                    res.children.push({'name': job_data[j]["sub_title"],
                                        'value': 4, // the size of node
                                        'type': 'black', // the edge of node
                                        'level': 'black', // the color of node
                                        'thickness': scaled_thickness}); //child thickness link and node size
                    break;
                }
            }
        }
    }
    console.log(res)
    res.children.sort(dynamicSort("-thickness"));
    return res
}


var get_saturation = function(sub_data, selected_conc_sim){
    // var selected_conc_sim = job_idx_by_groups[selected_conc];
    if (selected_conc_sim!=0) {

        var valid_idx_list = [];
        for (j=0; j<selected_conc_sim.length; j++) {
            if (sub_data.name == job_data[selected_conc_sim[j]]["title"]){
                valid_idx_list.push(selected_conc_sim[j])
            }
        }

        for (i=0; i<sub_data.children.length; i++) {
            for (j=0; j<valid_idx_list.length; j++) {
                if (sub_data.name == job_data[valid_idx_list[j]]["title"] && sub_data.children[i]["name"] == job_data[valid_idx_list[j]]["sub_title"]) {
                    var saturate_value = (valid_idx_list.length - j) / valid_idx_list.length;
                    
                    if (saturate_value < 0.5){
                        var saturate_code = 0.05;
                    } else if (saturate_value < 0.9) {
                        var saturate_code = 0.7;
                    } else {
                        var saturate_code = 1.2;
                    }
                    sub_data.children[i].saturate = saturate_code 
                    break;
                } 
            }
        }
    } else {
        for (i=0; i<sub_data.children.length; i++) {
            sub_data.children[i].saturate = 0.1
        }
    }
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