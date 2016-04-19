/**
 * @TODO:
 *  - load in data dynamically (switch user)
 *  - average weight by day, week
 *  - stack bone / muscle / fat, sum to 100%
 */

// Muscle: 40-60
// Fat: 11-22-27
// BMI: 18.5-24-28-35
// Age: 43 (vs DOB)
// BMR: 1779 (?)
// Water: 55-65
// Bone %ge: 3.9%
// Weight: 90-75
var bodyStats = {
  graph: {
    margin: {
      top: 30,
      right: 100,
      bottom: 35,
      left: 50
    },

    width: 960,
    height: 470
  },

  colors: {
    bone: 'ivory',
    muscle: '#993333',
    fat: 'brown',
    water: 'rgba(211, 211, 255, 0.5)'
  },

  ignoreTimestamps: [
    1457869810,
    1460379447,
    1460379467
  ],

  filterData: function(d) {
    return bodyStats.ignoreTimestamps.indexOf(d.timeStamp) === -1;
  },

  prepRow: function(d) {
    d.date = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.createTime);
    // d.date = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.date.toISOString().substring(0, 10) + ' 12:00:00');
    d.bmi = +d.bmi;
    d.bmr = +d.bmr;
    d.fat = +d.fat;
    d.water = +d.water;
    d.weight = +d.weight;
  },

  adjustFinal: function(d) {
    console.log(d);
  },

  drawGraph: function() {


  }
};

d3.json("data/data.json", function(error, data) {
  // Data prep: ignore entries by timestamp.
  data.data.rows = data.data.rows.filter(bodyStats.filterData);

  // Data prep: get JS dates from input string.
  data.data.rows.forEach(bodyStats.prepRow);

  // Set the dimensions of the canvas / graph
  var margin = bodyStats.graph.margin,
    width = bodyStats.graph.width - bodyStats.graph.margin.left - bodyStats.graph.margin.right,
    height = bodyStats.graph.height - bodyStats.graph.margin.top - bodyStats.graph.margin.bottom;

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style('margin', '0 auto')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var table = d3.select("body").append("table");
  var thead = table.append("thead"),
    tbody = table.append("tbody");

  var columns = [
    // 'id',
    'createTime',
    // 'timeStamp',
    'weight',
    'bone',
    'muscle',
    'fat',
    'bmi',
    'kcal',
    'visFat',
    'water',
    'resistance'
  ];

  // append the header row
  thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(column) { return column; });
  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
    .data(data.data.rows)
    .enter()
    .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
    .data(function(row) {
      return columns.map(function(column) {
        return {column: column, value: row[column]};
      });
    })
    .enter()
    .append("td")
    .html(function(d) { return d.value; });

  svg.append("svg:line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height/4)
    .attr("y2", height/4)
    .style("stroke", "rgb(189, 189, 189)");

/*
  svg.append("rect")
    .attr("class", "quartile")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height/4)
    .style('fill', 'rgba(255, 235, 211, 0.5)')
    .style('opacity', 0.5);
*/

  svg.append("svg:line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height/4*3)
    .attr("y2", height/4*3)
    .style("stroke", "rgb(189, 189, 189)");
/*
  svg.append("rect")
    .attr("class", "quartile")
    .attr("x", 0)
    .attr("y", height/4*3)
    .attr("width", width)
    .attr("height", height/4)
    .style('fill', 'rgba(211, 255, 211, 0.5)')
    .style('opacity', 0.5);
*/

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  var yBone = d3.scale.linear().range([height, 0]);
  var yMakeup = d3.scale.linear().range([height, 0]);
  var yBMI = d3.scale.linear().range([height, 0]);
  var yBMR = d3.scale.linear().range([height, 0]);
  var yFat = d3.scale.linear().range([height, 0]);
  var yMuscle = d3.scale.linear().range([height, 0]);
  var yVisFat = d3.scale.linear().range([height, 0]);
  var yWater = d3.scale.linear().range([height, 0]);
  var yWeight = d3.scale.linear().range([height, 0]);

  // Scale the range of the data
  x.domain(d3.extent(data.data.rows, function(d) { return d.date; }));
  x.domain([x.domain()[0], new Date()]);
  // console.log(x.domain());
  // console.log(x.domain());

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
  var yAxisBone = d3.svg.axis().scale(yMakeup)
    .orient("right")
    .ticks(5);
  var yAxisMuscle = d3.svg.axis().scale(yMakeup)
    .orient("right")
    .ticks(5);
  var yAxisFat = d3.svg.axis().scale(yMakeup)
    .orient("right")
    .ticks(5);
  var yAxisVisFat = d3.svg.axis().scale(yVisFat)
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

  var valuelineBone = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      console.log(yMakeup(d.bone), 'bone');
      return yMakeup(d.bone);
    });
  var valuelineMuscle = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      console.log(yMakeup(d.muscle + d.bone), 'muscle + bone');
      return yMakeup(d.muscle + d.bone);
    });
  var valuelineFat = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yMakeup(d.fat + d.muscle + d.bone);
    });

  // These three get stacked together; in theory they
  // should add up to 100%.
  var valueareaBone = d3.svg.area()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
      return yMakeup(d.bone);
    });
  var valueareaMuscle = d3.svg.area()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y0(function(d) {
      return yMakeup(d.bone);
    })
    .y1(function(d) {
      return yMakeup(d.muscle + d.bone);
    });
  var valueareaFat = d3.svg.area()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y0(function(d) {
      return yMakeup(d.muscle + d.bone);
    })
    .y1(function(d) {
      return yMakeup(d.fat + d.muscle + d.bone);
    });

  var valuelineVisFat = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yVisFat(d.visFat);
    });
  var valuelineWater = d3.svg.area()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return yWater(d.water);
    });
  var valueareaWater = d3.svg.area()
    .interpolate('basis')
    .x(function(d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
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

  // console.log([0.95 * d3.min(data.data.rows, function(d) { return d.bmr; }), 1.05 * d3.max(data.data.rows, function(d) { return d.bmr; })], 'bmr');
  // console.log([0.95 * d3.min(data.data.rows, function(d) { return d.fat; }), 1.05 * d3.max(data.data.rows, function(d) { return d.fat; })], 'fat');
  // console.log([0.99 * d3.min(data.data.rows, function(d) { return d.water; }), 1.01 * d3.max(data.data.rows, function(d) { return d.water; })]);

  // This domain should show relevant range (eg 45-55% of BMI).
  yMakeup.domain([0, 100]);
  yBMI.domain([18.5, 35]);
  yBMR.domain([0.95 * d3.min(data.data.rows, function(d) { return d.bmr; }), 1.05 * d3.max(data.data.rows, function(d) { return d.bmr; })]);
  yFat.domain([0, 100]);
  yBone.domain([0, 100]);
  yMuscle.domain([0, 100]);
  yWater.domain([50, 60]);
  yWeight.domain([80, 88]);

  // console.log(data.data.rows, 'data');
  // console.log(valuelineBMI(data.data.rows), 'BMI');

  // Add the valueline paths.
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8'))
    .style('stroke', 'red')
    .attr("d", valuelineBMI(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '3'))
    .style('stroke', 'grey')
    .attr("d", valuelineBMR(data.data.rows));

  // Bone, muscle, fat.
/*
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8', '2'))
    .style('stroke', 'black')
    .style('stroke-width', 1)
    .attr("d", valuelineBone(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('20', '10', '20'))
    .style('stroke', 'pink')
    .style('stroke-width', 1)
    .attr("d", valuelineMuscle(data.data.rows));
  svg.append("path")
    .attr("class", "line")
    .style('stroke-dasharray', ('2', '8', '2'))
    .style('stroke', 'brown')
    .style('stroke-width', 1)
    .attr("d", valuelineFat(data.data.rows));
*/

  svg.append("path")
    // .style('stroke')
    .classed('bone', true)
    .attr("d", valueareaBone(data.data.rows));
  svg.append("path")
    // .style('stroke')
    .classed('muscle', true)
    .attr("d", valueareaMuscle(data.data.rows));
  svg.append("path")
    // .style('stroke')
    .classed('fat', true)
    .attr("d", valueareaFat(data.data.rows));

  // Water.
  svg.append("path")
    .attr("class", "line")
    .style('stroke', 'blue')
    .style('stroke-width', 0.5)
    .classed('water', true)
    .attr("d", valuelineWater(data.data.rows));
  svg.append("path")
    // .style('stroke')
    .classed('water', true)
    .attr("d", valueareaWater(data.data.rows));

  svg.append("path")
    .attr("class", "line")
    // .style('stroke-dasharray', ('2', '8'))
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .attr("d", valuelineWeight(data.data.rows));

  bodyStats.final = {
    water: {
      label: 'Water: ' + data.data.rows[data.data.rows.length-1].water + '%',
      value: yWater(data.data.rows[data.data.rows.length-1].water),
    },
    bone: {
      label: 'Bone: ' + data.data.rows[data.data.rows.length-1].bone.toFixed(1),
      value: yMakeup(data.data.rows[data.data.rows.length-1].bone)
    },
    fat: {
      label: 'Fat: ' + data.data.rows[data.data.rows.length-1].fat.toFixed(1) + '%',
      value: yMakeup(data.data.rows[data.data.rows.length-1].muscle + data.data.rows[data.data.rows.length-1].bone + data.data.rows[data.data.rows.length-1].fat)
    },
    muscle: {
      label: 'Muscle: ' + data.data.rows[data.data.rows.length-1].muscle.toFixed(1) + '%',
      value: yMakeup(data.data.rows[data.data.rows.length-1].muscle + data.data.rows[data.data.rows.length-1].bone)
    },
    bmi: {
      label: 'BMI: ' + data.data.rows[data.data.rows.length-1].bmi.toFixed(1),
      value: yBMI(data.data.rows[data.data.rows.length-1].bmi)
    },
    bmr: {
      label: 'BMR: ' + data.data.rows[data.data.rows.length-1].bmr.toFixed(1),
      value: yBMR(data.data.rows[data.data.rows.length-1].bmr)
    },
    weight: {
      label: 'Weight: ' + data.data.rows[data.data.rows.length-1].weight.toFixed(1),
      value: yWeight(data.data.rows[data.data.rows.length-1].weight)
    }
  };

  // Get position order for the labels.
  var finals = Object.keys(bodyStats.final);
  finals.sort(function(a, b) { return bodyStats.final[a].value - bodyStats.final[b].value });
  // Ensure a minimum of 10px between each label.
  var prev = bodyStats.final[finals[0]].value;
  finals.forEach(function (key, i) {
    // Compare against previous, so skip 0th.
    if (i && bodyStats.final[key].value < (prev + 10)) {
      bodyStats.final[finals[i-1]].value += 8;
      bodyStats.final[key].value -= 8;
    }
    prev = bodyStats.final[finals[i]].value;
  });

  // console.log(finals);

  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.water.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'blue')
    .text(bodyStats.final.water.label);
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.bmi.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'red')
    .text(bodyStats.final.bmi.label);
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.bmr.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'grey')
    .text(bodyStats.final.bmr.label);

  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.bone.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'grey')
    .text(bodyStats.final.bone.label);
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.muscle.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'grey')
    .text(bodyStats.final.muscle.label);
  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.fat.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'grey')
    .text(bodyStats.final.fat.label);

  svg.append('text')
    .attr('transform', 'translate(' + (width + 3) + ',' + bodyStats.final.weight.value + ')')
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .style('fill', 'black')
    .text(bodyStats.final.weight.label);

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the y Axes
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(30,0)")
    .style('fill', 'blue')
    .call(yAxisWater);
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(20,0)")
    .style('fill', 'green')
    .call(yAxisBMI);
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(40,0)")
    .style('fill', 'brown')
    .call(yAxisFat);
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(40,0)")
    .style('fill', 'pink')
    .call(yAxisMuscle);
  svg.append("g")
    .attr("class", "y axis ghost")
    .attr("transform", "translate(60,0)")
    .style('fill', 'purple')
    .call(yAxisBMR);
  svg.append("g")
    .attr("class", "y axis")
    // .attr("transform", "translate(0,0)")
    .style('fill', 'black')
    .call(yAxisWeight);

  svg.append('text')
    .attr('x', (width / 2))
    .attr('y', (margin.top / 2) - 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Body Stats');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom)
    .style('text-anchor', 'middle')
    .style('font-size', '14px')
    .text('Date');

})
