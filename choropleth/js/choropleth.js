var width = 960,
    height = 600;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


var rangesColors = [
    ["#ffffff","#ffe4b2", "#ffc04c", "#ffa500","#ff2500","#ff0000"],
    ["#ffffff", "#ffc04c","#ffa500", "#ff0000"],
    ["#ffffff","#ff0000"]
];

function getDomain() {
    var min, max;
    var len = inmigration_data.length;
    var percent = 0;
    for (var i = 0; i < len; i++) {
        percent = ((inmigration_data[i].pobindi1990* 1.0) / inmigration_data[i].tpobtot1990) * 100;
        if (typeof max === 'undefined'){
            max = percent;
            continue;
        }
        if (typeof min === 'undefined'){
            min = percent;
            continue;
        }
            
        if (percent > max) {
            max = percent;
        }else{
            if(percent < min){
                min = percent;
            }
        }
    }
    return [min,max];
}

function createBucketDomain(domain,numberBuckets ) {
    var min, max, bucket = [];
    min = domain[0];
    max = domain[1];
    if (numberBuckets === 2) {
        return domain;
    }
    bucket.push(min);
    var difference = ((max-min)*1.0)/(numberBuckets);
    var bucketSum = min;
    for (var i = 1; i < numberBuckets; i++) {
        bucketSum+= difference;
        bucket.push(bucketSum);
    }
    bucket.push(max);
    return bucket;
}

function createBucketColors(numberBuckets){
    switch (numberBuckets){
        case 3:{
            return rangesColors[1];
        } 
        case 5: {
            return rangesColors[0]
        }
        default: return rangesColors[2];
    }
}

var nBuckets = 5;

var color = d3.scale.linear().range(createBucketColors(nBuckets)).domain(createBucketDomain(getDomain(),nBuckets));

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

function getMigrationPercent1990 (state_code) {
    var inmigration = inmigration_data[state_code-1];
    var percent = ((inmigration.pobindi1990* 1.0) / inmigration.tpobtot1990) * 100;
    console.log(percent)
    return percent;
}

function ready(error, estados) {
  if (error) throw error;

var g = svg.append("g");

var path = g.selectAll("path")
    .data(topojson.feature(estados, estados.objects.states).features)
    .enter().append("path")
    .attr("d", d3.geo.path().projection(projection))
    .attr("fill", function (d) {
        return color( getMigrationPercent1990(d.properties.state_code));
    })
    .style("stroke", "#333")
    .attr('opacity', 0)
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("<b>" + d.properties.state_name +"<br> Porcentaje de inmigrantes: "+ getMigrationPercent1990(d.properties.state_code).toFixed(2)+ "%</b>")
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

