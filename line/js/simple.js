
var dataSet = [ 
  ["Aguascalientes",1994,3.0],
  ["Baja California",1995,98.0],
  ["Baja California Sur",1996,5.0],
  ["Campeche",1997,0.0],
  ["Chiapas",1998,14.0],
  ["Chihuahua",1999,31.0],
  ["Coahuila de Zaragoza",2000,1.0],
  ["Colima",2001,0.0],
  ["Distrito Federal",2002,41.0],
  ["Durango",2003,37.0],
  ["Guanajuato",2004,55.0],
  ["Guerrero",2005,22.0],
  ["Hidalgo",2006,5.0],
  ["Jalisco",2007,14.0]
];

var margin = {top: 20, right: 50, bottom: 30, left: 50},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var x = d3.scale.linear().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .tickFormat(function(d) { return d; })
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var line = d3.svg.line()
  //.interpolate("monotone")
  .x(function(d) { return x(+d[1]); })
  .y(function(d) { return y(d[2]); });



var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([+dataSet[0][1], +dataSet[dataSet.length - 1][1]]);
y.domain(d3.extent(dataSet, function(d) { return d[2]; }));

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Price ($)");




svg.append("path")
  .datum(dataSet)
  .attr("class", "line")
  .attr("d", line)

var bisectDate = d3.bisector(function(d) { return +d[1]; }).left;

var focus = svg.append("g")
  .attr("class", "focus")
  .style("display", "none");

focus.append("circle")
  .attr("r", 4.5);

focus.append("text")
  .attr("x", 9)
  .attr("dy", ".35em");

svg.append("rect")
  .attr("class", "overlay")
  .attr("width", width)
  .attr("height", height)
  .on("mouseover", function() { focus.style("display", null); })
  .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

function mousemove() {
  var x0 = x.invert(d3.mouse(this)[0]),
    i = bisectDate(dataSet, x0, 1),
    d0 = dataSet[i - 1],
    d1 = dataSet[i],
    d = x0 - d0[1] > d1[1] - x0 ? d1 : d0;
    
    focus.attr("transform", "translate(" + x(d[1]) + "," + y(d[2]) + ")");
    focus.select("text").text(d[0]);
  }

  
var curtain = svg.append('rect')
  .attr('x', -1 * width)
  .attr('y', -1 * height)
  .attr('height', height)
  .attr('width', width)
  .attr('class', 'curtain')
  .attr('transform', 'rotate(180)')
  .style('fill', '#ffffff')

var guideline = svg.append('line')
  .attr('stroke', '#333')
  .attr('stroke-width', 0)
  .attr('class', 'guide')
  .attr('x1', 1)
  .attr('y1', 1)
  .attr('x2', 1)
  .attr('y2', height)

var t = svg.transition()
  .delay(750)
  .duration(2000)
  .ease('linear')
  .each('end', function() {
    d3.select('line.guide')
    .transition()
    .style('opacity', 0)
    .remove()
  });

t.select('rect.curtain')
  .attr('width', 0);
t.select('line.guide')
  .attr('transform', 'translate(' + width + ', 0)')
