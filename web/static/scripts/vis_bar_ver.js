

var job_data = d3.csvParse(jobs);


var has_bar = "false";
var has_select_conc = "false";
var sub_data = [];
var bar_title = '';
var bar_color = '';
var career_data;


function test(){
    
    // create SVGs
    var svg_academic = d3.select("#d3_academic"),
        svg_career = d3.select("#d3_career"),
        svg_bar = d3.select("#d3_bar");

    // 
    
    // if no selection
    if (selectedCoursePool.length === 0) {
        console.log("Selected list is empty.");
        svg_career.selectAll("g").remove();
        svg_academic.selectAll("g").remove();
        svg_bar.selectAll("g").remove();
        has_bar ="false"
        return;
    }

    // Create Radar Plot
    var Radar = radar_Vis(),
        config = {w:400, h:400, maxValue:8, levels:8};
    Radar.radar_plot(svg_academic, get_academic_data(selectedCoursePool), config);

    // Create Rose Plot
    d3.csv("/get_sim/?data=" + selectedCoursePool, function(error, data){
        data = data.columns.map(function(el){ return +el;})
        var Rose = RP_Vis();
        career_data = get_career_data(data)
        Rose.rose_plot(svg_career, career_data, d3.schemeCategory20);

        
        for (let i=0; i < career_data.length; i++) {
            var title = career_data[i]["label"];
            if (has_bar=='false') {
                sub_data[title] = get_bar_data(data, title);
            } else {
                if (has_select_conc=='false') {
                    mod_bar_data(data, title);
                } else {
                    // get saturate value
                }
            }
        }

        var Bar = BC_Vis();

        if (has_bar=='true') {
            Bar.bar_cahrt(svg_bar, sub_data[bar_title], bar_title, bar_color);
        } 

        Rose.dispatch.on("selected_by_rose",
                        function(selectedVar){ has_bar = "true";
                                                bar_title = selectedVar[0];
                                                bar_color = selectedVar[1];                                                
                                                Bar.bar_cahrt(svg_bar, sub_data[bar_title], bar_title, bar_color)});


        Radar.dispatch.on("selected_by_radar",
                        function(selectedVar){ 
                            if (has_bar=='true') {
                                has_select_conc = 'true';
                                console.log('run bar plot!');
                                d3.json("/get_groupby_sim/?data=" + selectedCoursePool, function(error, data){
                                    // selectedVar: d.label
                                    
                                    //console.log( get_saturation_bar1(selectedVar, data[selectedVar]) )
                                    Bar.bar_cahrt(svg_bar, get_saturation_bar(sub_data[bar_title], data[selectedVar]), bar_title, bar_color)
                                })
                            } else {
                                console.log('no bar plot yet.');
                            } 
                        });

    })
}; 