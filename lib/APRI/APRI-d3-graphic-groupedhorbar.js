/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriD3GraphicGroupedHorBar*/
/** 
 * ApriD3GraphicTrend is a for creating instances of the apri d3 trend graphic.
 * @framework ApriD3GraphicTrend
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriD3GraphicTrend class def 
// ===============================================================================
// parent: class ApriD3Base
var ApriD3GraphicGroupedHorBar = ApriCore.ApriD3GraphicGroupedHorBar = ApriCore.ApriD3GraphicGroupedHorBar || ApriCore.ApriD3Base.extend(function () {

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriD3GraphicGroupedHorBar');
	}

	
	var margin = {top: 35, right: 10, bottom: 100, left: 40},
    	margin2 = {top: 210, right: 10, bottom: 20, left: 40},
    	width = 450 - margin.left - margin.right,
    	height = 300 - margin.top - margin.bottom,
    	height2 = 250 - margin2.top - margin2.bottom,
		focus;

	this.render = function(data, container, options){
	}


	this.createGraphic = function(inputData, options){
/*
		var _data = inputData;
		//margin = { top: 20, right: 80, bottom: 30, left: 50 }
		//width  = 720 - margin.left
		//height = 500 - margin.top

		//var dateParser 	= d3.time.format("%x").parse;

		var parseDate 	= d3.time.format("%b %Y").parse;
		
		var color      = d3.scale.category10();

		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			//.ticks(d3.time.years, 1)
			.orient('bottom');
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left');

		var line = d3.svg.line()
			.interpolate('basis')
			.x(function(d) { 
				var _x = x(d.date);
				return _x; })
			.y(function(d) { 
				return y(d.val); })
			//.x((d) -> x(d.date))
			//.y((d) -> y(d.val))
			;
		//var svg = d3.select('#res-graph')

		var labels = d3.select(options.container)
			.append('div')
			;
			
		var svg = d3.select(options.container)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', "translate("+margin.left+","+margin.top+")")
			;

//		d3.csv '/resolution_graph_data.csv', (error, data) ->

//		color.domain(d3.keys(data[0])); //.filter( function(key) { return  key!='Week'?key:null;  }));

		var colorDomain = [];
		for (var key in _data[0] ) {
			if (key != 'date' ) colorDomain.push(key);
		}

//		for (var i=0;i<=_data.length;i++) {
//			var inputRecord = _data[i];
//			var tmpRecord = {};
//			//tmpRecord.date = dateParser(inputRecord.date);
//		};

		_data.forEach(function(d) {
    		d.date = new Date(d.date); //parseDate(d.date);
  		});
		
		var data = _data.sort(function(a, b){
  			if (a.date > b.date) { return 1;}
			if (a.date < b.date) { return -1;}
			// a must be equal to b
			return 0;
		});


		
var data = {
  labels: [
    'resilience', 'maintainability', 'accessibility',
    'uptime', 'functionality', 'impact'
  ],
  series: [
    {
      label: '2012',
      values: [4, 8, 15, 16, 23, 42]
    },
    {
      label: '2013',
      values: [12, 43, 22, 11, 73, 25]
    },
    {
      label: '2014',
      values: [31, 28, 14, 8, 15, 21]
    },]
};

*/

var data = inputData;

var chartWidth       = 300,
    barHeight        = 20,
    groupHeight      = barHeight * data.series.length,
    gapBetweenGroups = 10,
    spaceForLabels   = 80,
    spaceForLegend   = 100;

// Zip the series data together (first values, second values, etc.)
var zippedData = [];
for (var i=0; i<data.labels.length; i++) {
  for (var j=0; j<data.series.length; j++) {
    zippedData.push(data.series[j].values[i]);
  }
}

// Color scale
var color = d3.scale.category20();
var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

var x = d3.scale.linear()
    .domain([0, d3.max(zippedData)])
    .range([0, chartWidth]);

var y = d3.scale.linear()
    .range([chartHeight + gapBetweenGroups, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat('')
    .tickSize(0)
    .orient("left");

// Specify the chart area and dimensions
		var svg = d3.select(options.container)
			.append('svg')
			.attr('width', spaceForLabels + chartWidth + spaceForLegend)
			.attr('height', chartHeight)
			.attr("class", "groupedhorbar")
			;
//var chart = d3.select(".chart")
//    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
//    .attr("height", chartHeight);

// Create bars
var bar = svg.selectAll("g")
    .data(zippedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
    });

// Create rectangles of the correct width
bar.append("rect")
    .attr("fill", function(d,i) { return color(i % data.series.length); })
    .attr("class", "bar")
    .attr("width", x)
    .attr("height", barHeight - 1);

// Add text label in bar
bar.append("text")
    .attr("x", function(d) { return x(d) +7 ; })
    .attr("y", barHeight / 2)
    //.attr("fill", "red")
    .attr("dy", ".35em")
    .text(function(d) { return d; });

// Draw labels
bar.append("text")
    .attr("class", "label")
    .attr("x", function(d) { return - 60; })
    .attr("y", groupHeight / 2)
    .attr("dy", ".35em")
    .text(function(d,i) {
      if (i % data.series.length === 0)
        return data.labels[Math.floor(i/data.series.length)];
      else
        return ""});

svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
      .call(yAxis);

// Draw legend
var legendRectSize = 18,
    legendSpacing  = 4;

var legend = svg.selectAll('.legend')
    .data(data.series)
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = -gapBetweenGroups/2;
        var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function (d, i) { return color(i); })
    .style('stroke', function (d, i) { return color(i); });

legend.append('text')
    .attr('class', 'legend')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d.label; });



}





//	return this;

});

// ApriD3GraphicTrend Class end 
// ===============================================================================



