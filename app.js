var csvBasePath = "csv-files",
    today = new Date(),
    csvFilenameForDate = d3.timeFormat(csvBasePath+"/%Y_%m.csv"),
    parseTimestamp = d3.utcParse("%a %b %e %H:%M:%S UTC %Y");


var filename = csvFilenameForDate(today);
d3.csv(filename, function(err, data){
  if(err) throw err;

  //
  // draw the 'actual chart'
  //


  // use the row from the file for the 'actual' data
  var last = data[data.length - 1];

  // add the timestamp to the page
  var formatTimestamp = d3.timeFormat("%d.%m.%Y %H:%M");
  d3.select("#timestamp")
    .text(formatTimestamp(new Date(last.timestamp)))
    .call(function(d) {
      if(d3.timeDay.count(new Date(last.timestamp), today) > 0) {
        d.style("color", "red");
      };
    });


  // draw the chart
  drawActualChart(last);




  //
  // draw the 'history chart'
  //
  fetchAndDrawHistoryChartForDate(today);
});







// react on button event to change history range
//   TODO: this doesn't work with 'd3' - why???
$("#hist-range input").change(function(){
  switch(this.id) {
  case 'this-month':
    fetchAndDrawHistoryChartForDate(today);
    break;
  case 'last-month':
    var oneMonthAgo = d3.timeMonth.offset(today, -1);
    fetchAndDrawHistoryChartForDate(oneMonthAgo);
    break;
  default:
    console.log("invalid id", this.id);
  }
});




function fetchAndDrawHistoryChartForDate(date){
  var converter = function(d){
    d.timestamp = parseTimestamp(d.timestamp);
    d.quota     = +d.quota;
    d.used      = +d.used;
    d.available = +d.available;
    return d;
  }

  var filename = csvFilenameForDate(date);
  d3.csv(filename, converter, function(err, data){
    drawHistoryChart(data);
  });
}
