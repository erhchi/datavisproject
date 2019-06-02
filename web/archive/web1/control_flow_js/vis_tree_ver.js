var job_data = d3.csvParse(jobs);
var has_bar ="false";
var sub_data = [];
var bar_title = '';

function test(){
    // create SVGs
    var svg_academic = d3.select("#d3_academic"),
        svg_career = d3.select("#d3_career"),
        svg_path = d3.select("#d3_path");
    svg_path.selectAll("g").remove();


    // if no selection
    if (selectedCoursePool.length === 0) {
        console.log("Selected list is empty.");
        svg_career.selectAll("g").remove();
        svg_academic.selectAll("g").remove();
        has_path ="false";
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
        Rose.rose_plot(svg_career, get_career_data(data), d3.schemeCategory20);


        var Tree = TP_Vis();
    
    
        Rose.dispatch.on("selected_by_rose",
                        function(selectedVar){ has_path = "ture";
                                            sub_data = get_path_data(data, selectedVar);
                                            Tree.tree_path(svg_path, sub_data )});


        Radar.dispatch.on("selected_by_radar",
                        function(selectedVar){ 
                            if (has_path=='ture') {
                                console.log('run tree plot!');
                                d3.json("/get_groupby_sim/?data=" + selectedCoursePool, function(error, data){
                                    Tree.tree_path(svg_path, get_saturation(sub_data, data[selectedVar[0]]), selectedVar[1])
                                })
                            } else {
                                console.log('no tree plot yet.');
                            } 
                        });
    })
};