var dataSet = [ ["Aguascalientes",1994,3.0],
["Baja California",1994,98.0],
["Baja California Sur",1994,5.0],
["Campeche",1994,0.0],
["Chiapas",1994,14.0],
["Chihuahua",1994,31.0],
["Coahuila de Zaragoza",1994,1.0],
["Colima",1994,0.0],
["Distrito Federal",1994,41.0],
["Durango",1994,37.0],
["Guanajuato",1994,55.0],
["Guerrero",1994,22.0],
["Hidalgo",1994,5.0],
["Jalisco",1994,14.0]];

var margin = {top: 20, right: 20, bottom: 70, left: 40},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var x = d3.scale.ordinal().rangeRoundBands([0, width],.05);

var y = d3.scale.linear().range([ 0, height]);

x.domain(dataSet.map(function(d) { return d[0]; }));
y.domain([0, d3.max(dataSet, function(d) { return d[2]; })]);


var verticalScale = d3.scale.linear()
  .domain([0, d3.max(dataSet, function(d) { return d[2]; })])
  .range([height, 0])


var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(verticalScale)
  .orient("left")
  .ticks(5);

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-90)" );

svg.append("g")
  .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average");

var bars = svg.selectAll("rect")
  .data(dataSet)
  .enter().append("rect")
  .style("fill", "steelblue")
  .attr("x", function(d) { return x(d[0]); })
  .attr("width", x.rangeBand())
  .attr("height", 0)
  .attr("y", height)
  .on("mouseover", function(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(d[0] + "<br/> (" + d[1] + ", " + d[2] + ")")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
  });

bars.transition()
  .attr('height', function (d) {
    return y(d[2]);
  })
  .attr('y', function (d) {
    return height - y(d[2]);
  })
  .delay(function (data, i) {
    return i * 20;
  })
  .duration(2000)
  .ease('elastic')
