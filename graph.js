d3.json("data.json", function(error, data){
  console.log(data.data.rows);

  // Data prep: ignore entries by timestamp.
  var ignoreTimeStamps = [ 1457869810 ];
  data.data.rows = data.data.rows.filter(function(d) {
    return ignoreTimeStamps.indexOf(d.timeStamp) === -1;
  });

  // Data prep: get JS dates from input string.
  data.data.rows.forEach(function(d) {
    d.date = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.createTime);
    d.bmi = +d.bmi;
    d.fat = +d.fat;
  });

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 50, bottom: 35, left: 50},
  width = 800 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var yBMI = d3.scale.linear().range([height, 0]);
  var yFat = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
  var yAxisBMI = d3.svg.axis().scale(yBMI)
    .orient("left").ticks(5);
  var yAxisFat = d3.svg.axis().scale(yFat)
    .orient("right").ticks(5);

  // Define the line
  var valuelineBMI = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yBMI(d.bmi);
    });

  // Define the line
  var valuelineFat = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yFat(d.fat);
    });

  // Adds the svg canvas
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data.data.rows, function(d) { return d.date; }));
  // This domain should show relevant range (eg 45-55% of BMI).
  yBMI.domain([0.9 * d3.min(data.data.rows, function(d) { return d.bmi; }), 1.1 * d3.max(data.data.rows, function(d) { return d.bmi; })]);
  yFat.domain([0.9 * d3.min(data.data.rows, function(d) { return d.bmi; }), 1.1 * d3.max(data.data.rows, function(d) { return d.fat; })]);

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8'))
    .style('stroke', 'red')
    .attr("d", valuelineBMI(data.data.rows));

  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yFat(data.data.rows[data.data.rows.length-1].bmi) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'red')
    .text('BMI');

  // Add a second valueline path.
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8'))
    .style('stroke', 'green')
    .attr("d", valuelineFat(data.data.rows));

  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + yFat(data.data.rows[data.data.rows.length-1].fat) + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'green')
    .text('Fat');

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the BMI y Axis
  svg.append("g")
    .attr("class", "y axis")
    // .attr("transform", "translate(" + width + ",0)")
    .style('fill', 'green')
    .call(yAxisBMI);

  // Add the BMI y Axis
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(0,0)")
    .style('fill', 'red')
    .call(yAxisFat);

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

  var p = d3.select("body").selectAll("p")
    .data(data.data.rows)
    .enter()
    .append("p")
    .text(function(measure) {
      return measure.createTime + ': ' + measure.bmi;
    });
})
