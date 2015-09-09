
var dataSet = [ 
  [1,"Aguascalientes","1994-07-20",3.0],
  [2,"Baja California","1994-07-20",98.0],
  [3,"Baja California Sur","1994-07-20",5.0],
  [4,"Campeche","1994-07-20",0.0],
  [5,"Chiapas","1994-07-20",14.0],
  [6,"Chihuahua","1994-07-20",31.0],
  [7,"Coahuila de Zaragoza","1994-07-20",1.0],
  [8,"Colima","1994-07-20",0.0],
  [9,"Distrito Federal","1994-07-20",41.0],
  [10,"Durango","1994-07-20",37.0],
  [11,"Guanajuato","1994-07-20",55.0],
  [12,"Guerrero","1994-07-20",22.0],
  [13,"Hidalgo","1994-07-20",5.0],
  [14,"Jalisco","1994-07-20",14.0],
  [1,"Aguascalientes","1994-07-21",10.0],
  [2,"Baja California","1994-07-21",5.0],
  [3,"Baja California Sur","1994-07-21",6.0],
  [4,"Campeche","1994-07-21",1.0],
  [5,"Chiapas","1994-07-21",15.0],
  [6,"Chihuahua","1994-07-21",32.0],
  [7,"Coahuila de Zaragoza","1994-07-21",2.0],
  [8,"Colima","1994-07-21",1.0],
  [9,"Distrito Federal","1994-07-21",42.0],
  [10,"Durango","1994-07-21",38.0],
  [11,"Guanajuato","1994-07-21",56.0],
  [12,"Guerrero","1994-07-21",23.0],
  [13,"Hidalgo","1994-07-21",6.0],
  [14,"Jalisco","1994-07-21",15.0],
  [1,"Aguascalientes","1994-07-22",5.0],
  [2,"Baja California","1994-07-22",100.0],
  [3,"Baja California Sur","1994-07-22",7.0],
  [4,"Campeche","1994-07-22",2.0],
  [5,"Chiapas","1994-07-22",16.0],
  [6,"Chihuahua","1994-07-22",33.0],
  [7,"Coahuila de Zaragoza","1994-07-22",3.0],
  [8,"Colima","1994-07-22",2.0],
  [9,"Distrito Federal","1994-07-22",43.0],
  [10,"Durango","1994-07-22",39.0],
  [11,"Guanajuato","1994-07-22",57.0],
  [12,"Guerrero","1994-07-22",24.0],
  [13,"Hidalgo","1994-07-22",7.0],
  [14,"Jalisco","1994-07-22",16.0]
];

var margin = {top: 20, right: 90, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var parseDate = d3.time.format("%Y-%m-%d").parse,
  formatDate = d3.time.format("%b %d");

var x = d3.time.scale().range([0, width]),
  y = d3.scale.linear().range([height, 0]),
  z = d3.scale.linear().range(["white", "steelblue"]);

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var xStep = 864e5,
  yStep = 1;

x.domain(d3.extent(dataSet, function(d) {return parseDate(d[2]); }));
y.domain(d3.extent(dataSet, function(d) { return d[0]; }));
z.domain([0, d3.max(dataSet, function(d) { return d[3]; })]);

x.domain([x.domain()[0], +x.domain()[1] + xStep]);
y.domain([y.domain()[0]-yStep, y.domain()[1] + yStep]);

var heatMap = svg.selectAll(".tile")
  .data(dataSet)
  .enter().append("rect")
  .attr("class", "tile")
  .attr("x", function(d) { return x(parseDate(d[2])); })
  .attr("y", function(d) { return y(d[0])+ yStep; })
  .attr("width", function(d,i) { return x(xStep)-x(0) })
  .attr("height",function(d,i) { return  y(0) - y(yStep) })
  .style("fill", "white")
  .on("mouseover", function(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(d[0] + "<br/> (" + d[1] + ", " + d[3] + ")")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });                                                                                                                                                                                                                                                                             

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.svg.axis().scale(x).ticks(d3.time.days).tickFormat(formatDate).orient("bottom"))
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .attr("text-anchor", "end")
  .text("Date");

svg.append("g")
  .attr("class", "y axis")
  .call(d3.svg.axis().scale(y).orient("left"))
  .append("text")
  .attr("class", "label")
  .attr("y", 6)
  .attr("dy", ".71em")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .text("Value");

heatMap.transition()
  .duration(2000)
  .style("fill", function(d) { return z(d[3]); });