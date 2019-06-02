// Load data.
var concData = d3.csvParse(conc_data);
var courseData = d3.csvParse(course_data, function(d, i) { d.index = i; return d;});
// Initial menu loads
// console.log(concData);
var concData1 = getConcList();
LoadConcentrations(concData);
LoadConcentrationCourses(courseData);

// Global pool.
selectedCoursePool = [];
