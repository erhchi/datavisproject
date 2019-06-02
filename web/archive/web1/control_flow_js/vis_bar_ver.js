

var job_data = d3.csvParse(jobs);
// var job_data = [];
// d3.csv('./data/jobs.csv', function(d) {
//     job_data.push({title : d.title,
//                     sub_title : d.sub_title,
//                     skills : d.skills,})
// })

var has_bar ="false";
var sub_data = [];
var bar_title = '';

function test(){
    
    // create SVGs
    var svg_academic = d3.select("#d3_academic"),
        svg_career = d3.select("#d3_career"),
        svg_bar = d3.select("#d3_bar");
    svg_bar.selectAll("g").remove();


    // if no selection
    if (selectedCoursePool.length === 0) {
        console.log("Selected list is empty.");
        svg_career.selectAll("g").remove();
        svg_academic.selectAll("g").remove();
        has_bar ="false";
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


        var Bar = BC_Vis();
    
        Rose.dispatch.on("selected_by_rose",
                        function(selectedVar){ has_bar = "ture";
                                            sub_data = get_bar_data(data, selectedVar);
                                            bar_title = selectedVar[0];
                                            Bar.bar_cahrt(svg_bar, sub_data, bar_title)});


        Radar.dispatch.on("selected_by_radar",
                        function(selectedVar){ 
                            if (has_bar=='ture') {
                                console.log('run bar plot!');
                                d3.json("/get_groupby_sim/?data=" + selectedCoursePool, function(error, data){

                                    Bar.bar_cahrt(svg_bar, get_saturation_bar(sub_data, data[selectedVar[0]]), bar_title)
                                })
                            } else {
                                console.log('no bar plot yet.');
                            } 
                        });
    })
}; 