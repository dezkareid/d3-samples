var dataSet = 
  [ 
    [1,"Aguascalientes",1994,3.0],
    [2,"Baja California",1994,98.0],
    [3,"Baja California Sur",1994,5.0],
    [4,"Campeche",1994,0.0],
    [5,"Chiapas",1994,14.0],
    [6,"Chihuahua",1994,31.0],
    [7,"Coahuila de Zaragoza",1994,1.0],
    [8,"Colima",1994,0.0],
    [9,"Distrito Federal",1994,41.0],
    [10,"Durango",1994,37.0],
    [11,"Guanajuato",1994,55.0],
    [12,"Guerrero",1994,22.0],
    [13,"Hidalgo",1994,5.0],
    [14,"Jalisco",1994,14.0],
    [1,"Aguascalientes",1995,40.0],
    [2,"Baja California",1995,60.0],
    [3,"Baja California Sur",1995,67.0],
    [4,"Campeche",1995,40.0],
    [5,"Chiapas",1995,15.0],
    [6,"Chihuahua",1995,32.0],
    [7,"Coahuila de Zaragoza",1995,2.0],
    [8,"Colima",1995,1.0],
    [9,"Distrito Federal",1995,42.0],
    [10,"Durango",1995,38.0],
    [11,"Guanajuato",1995,56.0],
    [12,"Guerrero",1995,23.0],
    [13,"Hidalgo",1995,6.0],
    [14,"Jalisco",1995,15.0],
    [1,"Aguascalientes",1996,70.0],
    [2,"Baja California",1996,50.0],
    [3,"Baja California Sur",1996,90],
    [4,"Campeche",1996,50],
    [5,"Chiapas",1996,97.0],
    [6,"Chihuahua",1996,69.0],
    [7,"Coahuila de Zaragoza",1996,80.0],
    [8,"Colima",1996,78.0],
    [9,"Distrito Federal",1996,67.0],
    [10,"Durango",1996,52.0],
    [11,"Guanajuato",1996,90.0],
    [12,"Guerrero",1996,45.0],
    [13,"Hidalgo",1996,89.0],
    [14,"Jalisco",1996,64.0]
  ];

var margin = {top: 20, right: 90, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var x = d3.scale.ordinal()
  .domain(dataSet.map(function(d) { return d[1]; }))
  .rangeRoundBands([0, width], 0.05),
  y = d3.scale.linear().range([height, 0]),
  z = d3.scale.linear().range(["white", "steelblue"]);

var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



y.domain(d3.extent(dataSet, function(d) { return d[2]; }));
z.domain([0, d3.max(dataSet, function(d) { return d[3]; })]);

y.domain([y.domain()[0]-1, y.domain()[1] ]);


var heatMap = svg.selectAll(".tile")
  .data(dataSet)
  .enter().append("rect")
  .attr("x", function(d) { return x(d[1]); })
  .attr("y", function(d,i) { return y(d[2]); })
  .attr("width", x.rangeBand())
  .attr("height",  function(d,i) { return y(i) - y(i+1); })
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
  .attr("transform", "translate(0," + height + ")")
  .call(d3.svg.axis().scale(x).orient("bottom").tickFormat(
    function(d){ 
      return d;
    }
  ))
  .append("text")
  .attr("x", width)
  .attr("y", -6)
  .attr("text-anchor", "end")
  .text("States");

       
svg.append("g")
  .call(d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("d")))
  .append("text")
  .attr("y", 6)
  .attr("dy", ".71em")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .text("Year");

heatMap.transition()
  .duration(2000)
  .style("fill", function(d) { return z(d[3]); }); 
