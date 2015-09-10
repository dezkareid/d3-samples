var dataSet = [ 
  ["Baja California",1994,98.0],
  ["Chihuahua",1994,31.0],
  ["Distrito Federal",1994,41.0],
  ["Durango",1994,37.0],
  ["Guanajuato",1994,55.0],
  ["Guerrero",1994,22.0]
];

var width = 960,
  height = 500,
  radius = Math.min(width, height) / 2;


var color = d3.scale.category10();

var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) { return d[2]; });

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var g = svg.selectAll(".arc")
  .data(pie(dataSet))
  .enter().append("g")
  .attr("class", "arc")
  .on("mouseover", function(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(d.data[0] + "<br/> (" + d.data[1] + ", " + d.data[2] + ")")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

function tweenPie(finish) {
  var start = {
    startAngle: 0,
    endAngle: 0
  };
  
  var i = d3.interpolate(start, finish);
  return function(d) { return arc(i(d)); };
}
  
g.append("path")
  .attr("d", arc)
  .style("fill", function(d) { return color(d.data[2]); })
  .transition()
  .duration(2000)
  .attrTween('d', tweenPie);
      

g.append("text")
  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .style("text-anchor", "middle")
  .text(function(d) { return d.data[0] });

