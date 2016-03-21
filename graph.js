d3.json("data/data.json", function(error, data){
  // console.log(data.data.rows);

  // Data prep: ignore entries by timestamp.
  var ignoreTimeStamps = [ 1457869810 ];
  data.data.rows = data.data.rows.filter(function(d) {
    return ignoreTimeStamps.indexOf(d.timeStamp) === -1;
  });

  // Data prep: get JS dates from input string.
  data.data.rows.forEach(function(d) {
    d.date = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.createTime);
    d.bmi = +d.bmi;
    d.bmr = +d.bmr;
    d.fat = +d.fat;
    d.water = +d.water;
    d.weight = +d.weight;
  });

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 50, bottom: 35, left: 50},
  width = 960 - margin.left - margin.right,
  height = 470 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var yBMI = d3.scale.linear().range([height, 0]);
  var yBMR = d3.scale.linear().range([height, 0]);
  var yFat = d3.scale.linear().range([height, 0]);
  var yWater = d3.scale.linear().range([height, 0]);
  var yWeight = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .ticks(5);
  var yAxisBMI = d3.svg.axis().scale(yBMI)
    .orient("right")
    .ticks(5);
  var yAxisBMR = d3.svg.axis().scale(yBMR)
    .orient("right")
    .ticks(2);
  var yAxisFat = d3.svg.axis().scale(yFat)
    .orient("right")
    .ticks(5);
  var yAxisWater = d3.svg.axis().scale(yWater)
    .orient("left")
    .ticks(5);
  var yAxisWeight = d3.svg.axis().scale(yWeight)
    .orient("left")
    .ticks(5);

  // Define the lines.
  var valuelineBMI = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yBMI(d.bmi);
    });
  var valuelineBMR = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yBMR(d.bmr);
    });
  var valuelineFat = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yFat(d.fat);
    });
  var valuelineWater = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yWater(d.water);
    });
  var valuelineWeight = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yWeight(d.weight);
    });

  // Adds the svg canvas
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style('margin', '0 auto')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data.data.rows, function(d) { return d.date; }));
  // This domain should show relevant range (eg 45-55% of BMI).
  yBMI.domain([0.95 * d3.min(data.data.rows, function(d) { return d.bmi; }), 1.05 * d3.max(data.data.rows, function(d) { return d.bmi; })]);
  yBMR.domain([0.95 * d3.min(data.data.rows, function(d) { return d.bmr; }), 1.05 * d3.max(data.data.rows, function(d) { return d.bmr; })]);
  yFat.domain([0.95 * d3.min(data.data.rows, function(d) { return d.fat; }), 1.05 * d3.max(data.data.rows, function(d) { return d.fat; })]);
  yWater.domain([0.99 * d3.min(data.data.rows, function(d) { return d.water; }), 1.01 * d3.max(data.data.rows, function(d) { return d.water; })]);
  yWeight.domain([0.95 * d3.min(data.data.rows, function(d) { return d.weight; }), 1.05 * d3.max(data.data.rows, function(d) { return d.weight; })]);

  // Add the valueline paths.
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8'))
    .style('stroke', 'red')
    .attr("d", valuelineBMI(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '3'))
    .style('stroke', 'purple')
    .attr("d", valuelineBMR(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8', '2'))
    .style('stroke', 'green')
    .attr("d", valuelineFat(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    // .style('stroke')
    .style('stroke', 'lightblue')
    .attr("d", valuelineWater(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    // .style('stroke-dasharray', ('2', '8'))
    .style('stroke', 'black')
    .attr("d", valuelineWeight(data.data.rows));

  // console.log(valuelineWater(data.data.rows));

  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yBMI(data.data.rows[data.data.rows.length-1].bmi) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'red')
    .text('BMI');
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yBMR(data.data.rows[data.data.rows.length-1].bmr) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'purple')
    .text('BMR');
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yFat(data.data.rows[data.data.rows.length-1].fat) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'green')
    .text('Fat');
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yWater(data.data.rows[data.data.rows.length-1].water) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'lightblue')
    .text('Water');
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yWeight(data.data.rows[data.data.rows.length-1].weight) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'black')
    .text('Weight');

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the y Axes
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(10,0)")
    .style('fill', 'green')
    .call(yAxisBMI);
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(50,0)")
    .style('fill', 'purple')
    .call(yAxisBMR);
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(30,0)")
    .style('fill', 'red')
    .call(yAxisFat);
  svg.append("g")
    .attr("class", "y axis")
    // .attr("transform", "translate(0,0)")
    .style('fill', 'black')
    .call(yAxisWeight);

  svg.append('text')
    .attr('x', (width / 2))
    .attr('y', (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Body Stats');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom)
    .style('text-anchor', 'middle')
    .style('font-size', '14px')
    .text('Date');

/*
  var p = d3.select("body").selectAll("p")
    .data(data.data.rows)
    .enter()
    .append("p")
    .text(function(measure) {
      return measure.createTime + ': ' + measure.bmi;
    });
  */
})
