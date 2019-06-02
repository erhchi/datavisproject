// -------------------------
// Selected Class List 
// Drag Event Handlers
// -------------------------
// Sets data of dragged object
function dragBeginHandler(ev){
    console.log(ev.target);
    ev.dataTransfer.setData("text", ev.target);
}



// Fires when drag event ends.
function dragEndHandler(ev){
    // If dropped back in pool, do nothing.
    if (ev.dataTransfer.dropEffect != "none"){
        console.log("Abort End");
    }
    // Otherwise remove from course pool and selected display.
    else {
        // Remove from pool
        for (var i = 0; i < selectedCoursePool.length; ++i){
            if (selectedCoursePool[i] == ev.target.value){
                selectedCoursePool.splice(i, 1);
            }
        }

        console.log(selectedCoursePool);
        var list = $("#list");
        //console.log(list[0].childNodes);
        var listElements = list[0].childNodes;
        
        for (var i = 0; i < listElements.length; ++i){
            if (listElements[i].value == ev.target.value){
                list[0].removeChild(listElements[i]);
            }
        }
        test();
    }
}



// Needed to designate an element as a drop zone.
function dragover_handler(ev) {
        ev.preventDefault();
        // Set the dropEffect to move
        console.log("drag over");
}



// Fires if dragged element is dropped back in course pool.
function drop_handler(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "none";
        console.log("drop");
        console.log(ev.dataTransfer.dropEffect)
}




// --------------------
// Data Methods
// --------------------
function LogConcChange(){
    console.log( $("#concDrop")[0].value );
}


function LoadConcentrations(data){
    d3.select("#concDrop")
    .selectAll("option")
    .data(data).enter()
    .append("option")
    .attr("value", function(d) { return d.concentration; })
    .text(function(d) { return d.concentration; });
}


function LoadConcentrationCourses(data){
    var drop = d3.select("#courseDrop");
    drop.selectAll("option").remove();

    var selectedConcentration = $("#concDrop")[0].value;
    
    var selectedData = [];
    for (var i = 0; i < data.length; ++i){
        if (data[i].level == selectedConcentration)
            selectedData.push(data[i]);
    }
    
    d3.select("#courseDrop")
        .selectAll("empty")
        .data(selectedData)
        .enter()
        .append("option")
        .attr("value", function(d) { return d.index; } )
        .attr("draggable", "true")
        .text( function(d) { return d.dept + d.cno + " - " + d.name; } );
}


function ContainsCourse(courseIndex){
    return selectedCoursePool.filter(i => i == courseIndex).length != 0;
}


function AddCourseToPool(courseData){
    var courseIndex = +$("#courseDrop")[0].value;
    // console.log(courseData[courseIndex]);
    var flag = !ContainsCourse(courseIndex)

    if (flag) {
        d3.select("#list").append("li")
            .attr("value", courseIndex)
            .attr("draggable", "true")
            .attr("ondragstart", "dragBeginHandler(event)")
            .text(courseData[courseIndex].dept + courseData[courseIndex].cno + " - " + courseData[courseIndex].name)
            .style("font-family", "sans-serif");
        selectedCoursePool.push(courseIndex);
    } else {
        console.log("Course already selected.");
    }

    test();
}


function ClearSelections(){

    while(selectedCoursePool.length) { 
        selectedCoursePool.pop(); 
    }

    d3.select("#list").selectAll("li").remove();
    test();
}


function getConcList(){
    var visited = new Set(),
        res_list = [];

    d3.csv("./data/courses.csv", function(error, data){
        
        for (i=0; i<data.length; i++){
            if ( !(visited.has(data[i]["level"])) ) {
                visited.add(data[i]["level"]);
                res_list.push( {concentration: data[i]["level"]} );
            }
        }
    })
    res_list.columns = ["concentration"];
    return res_list;        
}