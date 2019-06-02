// https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857
var radar_Vis = function() {
  var nweRadar = {
      radar_plot: function(svg, d, options){

        svg.selectAll("g").remove();

        // console.log(d)

        var cfg = {
        radius: 5,
        w: +svg.attr("width"),
        h: +svg.attr("height"),
        factor: 1,
        factorLegend: .85,
        levels: 3,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0.5,
        ToRight: 5,
        TranslateX: 100,
        TranslateY: 30,
        color: d3.scaleOrdinal().range(["#1f77b4", "#666666"]) // ["#6F257F", "#CA0D59"]
        };
        
        if('undefined' !== typeof options){
          for(var i in options){
          if('undefined' !== typeof options[i]){
            cfg[i] = options[i];
          }
          }
        }
        
        
        var allAxis = (d.map(function(i, j){return i.label}));
        var total = allAxis.length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        // d3.select(id).select("svg").remove();

        var g = svg.append("g")
                    .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
    
    
        // var tooltip;
        
        //Circular segments
        for(var j=0; j<cfg.levels; j++){
          var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
          g.selectAll(".levels")
          .data(allAxis)
          .enter()
          .append("svg:line")
          .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
          .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
          .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
          .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        }
    
        //Text indicating at what % each level is
        for(var j=0; j<cfg.levels; j++){
          var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
          g.selectAll(".levels")
          .data([1]) //dummy data
          .enter()
          .append("svg:text")
          .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
          .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
          .attr("class", "legend")
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
          .attr("fill", "#737373")
          .text((j+1)*cfg.maxValue/cfg.levels);
        }
    
        series = 0;
    
        var axis = g.selectAll(".axis")
                    .data(allAxis)
                    .enter()
                    .append("g")
                    .attr("class", "axis");
    
        axis.append("line")
              .attr("x1", cfg.w/2)
              .attr("y1", cfg.h/2)
              .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
              .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
              .attr("class", "line")
              .style("stroke", "grey")
              .style("stroke-width", "1px");
    
        axis.append("text")
              .attr("class", "legend")
              .text(function(d){return d})
              .style("font-family", "sans-serif")
              .style("font-size", "11px")
              .attr("text-anchor", "middle")
              .attr("dy", "1.5em")
              .attr("transform", function(d, i){return "translate(0, -10)"})
              .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
              .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
    
          
          d.forEach(function(y){
              dataValues = [];
              g.selectAll(".nodes")
                  .data(d, function(j, i){
                    dataValues.push([
                          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                ]);
                
              });
              dataValues.push(dataValues[0]);
              // console.log(dataValues);
          g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .style("opacity", 0.4)
                .attr("points",function(d) {
                  var str="";
                  for(var pti=0;pti<d.length;pti++){
                    str=str+d[pti][0]+","+d[pti][1]+" ";
                  }
                  return str;
                  })
                .style("fill", function(j, i){return cfg.color(series)}) 
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d){
                          z = "polygon."+d3.select(this).attr("class");
                          g.selectAll("polygon")
                          .transition(200)
                          .style("fill-opacity", 0.1); 
                          g.selectAll(z)
                          .transition(200)
                          .style("fill-opacity", .7);
                          })
                .on('mouseout', function(){
                          g.selectAll("polygon")
                          .transition(200)
                          .style("fill-opacity", cfg.opacityArea);
                });
          series++;
        });
        series=0;

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        d.forEach(function(y, x){
          g.selectAll(".nodes")
          .data(d).enter()
          .append("svg:circle")
          .attr("class", "radar-chart-serie"+series)
          .attr('r', 5) // cfg.radius
          .attr("alt", function(j){return Math.max(j.value, 0)})
          .attr("cx", function(j, i){
            dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
          return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
          })
          .attr("cy", function(j, i){
            return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
          })
          .attr("data-id", function(d){return d.label})
          .style("fill", function(d){return color(d.label) } )
          .style("opacity", "0.3")
          .style("stroke-width", "1.5px")
          .style("stroke", cfg.color(series)).style("fill-opacity", .9)
          .on("click", function(d) { //console.log([d.label, color(d.label)]);
                                    nweRadar.dispatch.call("selected_by_radar",{},
                                                              [d.label, color(d.label)]); })
          .on('mouseover', function (d){
                newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                newY =  parseFloat(d3.select(this).attr('cy')) - 5;
    
                tooltip
                  .attr('x', newX)
                  .attr('y', newY)
                  .text(d.value+"/"+cfg.levels) // Format(d.value)
                  .transition(200)
                  .style('opacity', 1);
    
                z = "polygon."+d3.select(this).attr("class");
                g.selectAll("polygon")
                  .transition(200)
                  .style("fill-opacity", 0.1); 
                g.selectAll(z)
                  .transition(200)
                  .style("fill-opacity", .7);
                })
          .on('mouseout', function(){
                tooltip
                  .transition(200)
                  .style('opacity', 0);
                g.selectAll("polygon")
                  .transition(200)
                  .style("fill-opacity", cfg.opacityArea);
                })
          .append("svg:title")
          .text(function(d){return Math.max(d.value, 0)});
    
          series++;
        });
        //Tooltip
        tooltip = g.append('text')
              .style('opacity', 0)
              .style('font-family', 'sans-serif')
              .style('font-size', '13px');
        },
        dispatch: d3.dispatch("selected_by_radar")
    };
  return nweRadar
}

var get_academic_data = function(course_idx) {
  // expected output
  // [{label:"Artificial Intelligence",          value:3},
  //  {label:"Data Science",                     value:4},
  //  {label:"Database Systems",                 value:1},
  //  {label:"Theory",                           value:4},
  //  {label:"Human-Computer Interaction",       value:1},
  //  {label:"Software Engineering",             value:0},
  //  {label:"Game and Real-Time Systems",       value:4},
  //  {label:"Software and Systems Development", value:2}]

  // console.log(course_idx);

  

  // var levels = new Set()
  
  // for (j = 0; j < courseData.length; j++){
  //     levels.add(courseData[j]['level'])
  // }
  // // console.log(levels)

  // var res = new Array;
  // levels.forEach( function(d){ console.log({label: d, value: 0});
  //                                 res.push({label: d, value: 0}); 
  //                             })
  // console.log(res)
  var res = [ {label:"Artificial Intelligence",          value:1},
              {label:"Data Science",                     value:1},
              {label:"Database Systems",                 value:1},
              {label:"Theory",                           value:1},
              {label:"Human-Computer Interaction",       value:1},
              {label:"Software Engineering",             value:1},
              {label:"Game and Real-Time Systems",       value:1},
              {label:"Software and Systems Development", value:1}]
  
  for (i = 0; i < course_idx.length; i++){
      for (j = 0; j < courseData.length; j++){
          // compare the course name
          if (courseData[course_idx[i]]['name'] == courseData[j]['name']) {
            // loop through all concentration
            for (k = 0; k < res.length; k++){
                if (res[k]['label'] == courseData[j]['level']) {
                    res[k]['value']+=1;} 
              }
          }
      }
  }

  return res
};