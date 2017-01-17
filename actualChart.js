function drawActualChart(last){

  //
  // setup /  initialization
  //
  var width = 600,
      height = 600,
      radius = Math.min(width, height) / 2 - 70;
  
  var svg = d3.select("div#actual-container")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 "+width+" "+height)
      .attr("style", "max-width: "+width+"px; max-height: "+height+"px")
      .classed("svg-content", true)
      .append("g")
      .attr("transform", "translate("+ width/2 + ","+ height/2 +")");



  //
  // draw 'usage' arc with 'available' and 'used'.
  //
  drawUsageArc([
    { value: last.available, color: "green" },
    { value: last.used,      color: "red" },
  ]);


  //
  // draw 'days left' arc
  //
  drawDaysLeftArc(last["days-left"]);
  



  

  //
  // draw arc functions
  //
  function drawUsageArc(data) {
    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 40);

    var pieChart = d3.pie()
        .sort(null)
        .sortValues(null)    
        .value(function(d) { return d.value })
        .padAngle(.02);

    var pieChartData = pieChart(data);

    var g = svg.append("g")
    g.selectAll("path")
      .data(pieChartData)
      .enter()
      .append("path")
      .attr("fill", function (d) { return d.data.color  })
      .attr("d", arc);


    var offsetX = 20; // half from arc width
    var offsetY = 35;
    addLabel(pieChartData, g, offsetX, offsetY, function(d){
      return (d.value / 1000).toFixed(1) + " GB"
    });
    
    addCircleMarker(pieChartData, g);
    addLineFromLabelToMarker(pieChartData, g);

    
  }


  function drawDaysLeftArc(daysLeft) {
    var arc = d3.arc()
        .outerRadius(radius - 45)
        .innerRadius(radius - 60);

    var pieChart = d3.pie()
        .sort(null)
        .sortValues(null)    
        .value(function(d) { return d.value});

    var pieChartData = pieChart([
      { value: daysLeft,      color: "yellow" },
      { value: 31 - daysLeft, color: "white" },
    ]);

    var g = svg.append("g");
    g.selectAll("path")
      .data(pieChartData)
      .enter()
      .append("path")
      .attr("fill", function(d){ return d.data.color })
      .attr("d", arc);


    var offsetX = 52;
    var offsetY = 45;
    addLabel([pieChartData[0]], g, offsetX, offsetY, function(d){
      return d.value + " Tage"
    });
    
    addCircleMarker([pieChartData[0]], g);
    addLineFromLabelToMarker([pieChartData[0]], g);
    
  }



  //
  // arc utilty functions
  // 
  function addLabel(pieChartData, g, offsetX, offsetY, f){
    g.selectAll("text").data(pieChartData)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cx = Math.cos(a) * (radius - offsetX);
        return d.x = Math.cos(a) * (radius + offsetY);
      })
      .attr("y", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cy = Math.sin(a) * (radius - offsetX);
        return d.y = Math.sin(a) * (radius + offsetY); 
      })
      .text(f)
      .each(function(d) {
        var bbox = this.getBBox();
        d.sx = d.x - bbox.width/2 - 5;
        d.ox = d.x + bbox.width/2 + 5;
        d.sy = d.oy = d.y + 5;
      });
  }

  function addCircleMarker(pieChartData, g){
    g.append("defs").append("marker")
      .attr("id", "circ")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("refX", 3)
      .attr("refY", 3)
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3);
  }

  function addLineFromLabelToMarker(pieChartData, g){    
    g.selectAll("path.pointer").data(pieChartData).enter()
      .append("path")
      .attr("class", "pointer")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("marker-end", "url(#circ)")
      .attr("d", function(d) {
        if(d.cx > d.ox) {
          return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
        } else {
          return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
        }
      });    
  }
}
