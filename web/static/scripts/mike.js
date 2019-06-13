// Load data.
var concData = d3.csvParse(conc_data);
var courseData = d3.csvParse(course_data, function(d, i) { d.index = i; return d;});
// Initial menu loads
// console.log(concData);
var concData1 = getConcList();
LoadConcentrations(concData);
LoadConcentrationCourses(courseData);

$("#list").on("click", "li", function(ev) {

for (var i = 0; i < selectedCoursePool.length; ++i){
            if (selectedCoursePool[i] == ev.target.value){
                selectedCoursePool.splice(i, 1);
            }
        }

        console.log(selectedCoursePool);
        var list = $("#list");
        var listElements = list[0].childNodes;

        for (var i = 0; i < listElements.length; ++i){
            if (listElements[i].value == ev.target.value){
                list[0].removeChild(listElements[i]);
            }
        }
test();

});

// Global pool.
selectedCoursePool = [];
