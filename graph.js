d3.json("data.json", function(error, data){
//  console.log(data.data, 'data');

  var rows = [];
  data.data.rows.forEach(function(d, i) {
    if (d.timeStamp !== 1457869810) {
      rows[i] = d;
    }
  });

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

  // Method to parse the date / time
  var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

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
      // console.log(d.bmi, 'bmi');
      return y(d.bmi);
    });

  // Adds the svg canvas
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  rows.forEach(function(d) {
    d.date = parseDate(d.createTime);
    d.bmi = 0 + d.bmi;
    console.log(d, 'd');
  });

  // Scale the range of the data
  console.log(rows);
  x.domain(d3.extent(rows, function(d) {
    if (typeof d !== 'undefined') {
      return d.date;
    }
  }));
  y.domain([0, 2 * d3.max(rows, function(d) {
    if (typeof d !== 'undefined') {
      return d.bmi;
    }
  })]);

  // Add the valueline path.
//  console.log(rows, 'wos');
  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(rows));

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

  var p = d3.select("body").selectAll("p")
    .data(rows)
    .enter()
    .append("p")
    .text(function(measure) {
//      console.log(measure);
      return measure.createTime + ': ' + measure.bmi;
    });
})
