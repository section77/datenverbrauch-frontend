function drawHistoryChart(data){

  //
  // setup /  initialization
  //  
  var margin = {top: 10, right: 50, bottom: 40, left: 60},
      initialWidth = 1200,
      initialHeight = 400,
      width = initialWidth - margin.left - margin.right,
      height = initialHeight - margin.top - margin.bottom;
  
  var x = d3.scaleTime()
      .range([0, width]);

  var yUsage = d3.scaleLinear()
      .range([height, 0]);

  var yDays = d3.scaleLinear()
      .range([height, 0]);

  d3.select("div#history-container svg").remove();
  var svg = d3.select("div#history-container")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 "+initialWidth+" "+initialHeight)
      .classed("svg-content", true)
      .append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");


  if(typeof data === 'undefined'){
    svg.append("text")
      .attr("lengthAdjust", "spacing")
      .attr("textLength", 200)
      .attr("y", 10)
      .text("UH - NOTHING FOUND!");
    return;
  }

  // configure x-axis and draw it
  x.domain(d3.extent(data, function(d){ return d.timestamp }));
  svg.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0, "+height+")")
    .call(d3.axisBottom(x));

  // configure left y-axis for the 'usage' and draw it
  yUsage.domain([0, d3.max(data, function(d){ return d.available })]);  
  svg.append("g")
    .attr("class", "axis axis-y y-usage")
    .call(d3.axisLeft(yUsage));
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("MB");
  

  // configure right y-axis for 'days-left' and draw it
  yDays.domain([0, d3.max(data, function(d){ return d["days-left"] })]);    
  var yy = svg.append("g")
      .attr("class", "axis axis-y y-days")
      .attr("transform", "translate(" + width + " ,0)")   
      .call(d3.axisRight(yDays));
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", width + 30)
    .attr("x", -height / 2)
    .attr("dy", "1em")  
    .style("text-anchor", "middle")
    .text("Tage");
  
  


  
  //
  // draw the chart-lines
  //
  drawPath("used", data, yUsage);
  drawPath("available", data, yUsage)
  drawPath("days-left", data, yDays);


  
  
  //
  // utility to draw a path in the svg
  //
  function drawPath(id, data, yf){
    var line = d3.line()
        .x(function(d) { return x(d.timestamp)})
        .y(function(d) { return yf(d[id])});
    
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("id", id)
      .attr("d", line);
  }
}

