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
    d.bmi = 0 + d.bmi;
  });

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 35, left: 50},
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

  // Define the line
  var valueline = d3.svg.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.bmi);
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
  y.domain([0.9 * d3.min(data.data.rows, function(d) { return d.bmi; }), 1.1 * d3.max(data.data.rows, function(d) { return d.bmi; })]);

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data.data.rows));

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append('text')
    .attr('x', (width / 2))
    .attr('y', (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('text-decoration', 'underline')
    .text('BMI');

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
//      console.log(measure);
      return measure.createTime + ': ' + measure.bmi;
    });
})
