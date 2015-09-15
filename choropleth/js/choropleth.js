var width = 960,
    height = 600;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var projection = d3.geo.mercator()
    .scale(1280)
    .center([ -100.366806, 25.657792]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "estados.json")
    .await(ready);

function ready(error, estados) {
  if (error) throw error;

var g = svg.append("g");

var path = g.selectAll("path")
    .data(topojson.feature(estados, estados.objects.states).features)
    .enter().append("path")
    .attr("d", d3.geo.path().projection(projection))
    .attr("fill", "transparent")
    .style("stroke", "#333")
    .attr('opacity', 0)
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("<b>" + d.properties.state_name + "</b>")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

    path.transition()
    .delay(10)
    .duration(1250)
    .attr('opacity', 1);

}

