/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriD3GraphicDouble*/
/** 
 * ApriD3GraphicDouble is a for creating instances of the apri d3 double (timelined) graphic.
 * @framework ApriD3GraphicDouble
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriD3GraphicDouble class def ===============================================================================
// parent: class ApriD3Base
var ApriD3GraphicDouble = ApriCore.ApriD3GraphicDouble = ApriCore.ApriD3GraphicDouble || ApriCore.ApriD3Base.extend(function () {

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriD3GraphicDouble');
	}

	
	var margin = {top: 35, right: 10, bottom: 100, left: 40},
    	margin2 = {top: 210, right: 10, bottom: 20, left: 40},
    	width = 450 - margin.left - margin.right,
    	height = 280 - margin.top - margin.bottom,
    	height2 = 250 - margin2.top - margin2.bottom,
		focus;

	this.render = function(data, container, options){
	}


	this.createGraphic = function(inputData, options){
		var _data;
		var svg = d3.select(options.container).append("svg")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
			.attr("class","graphicdouble");

		svg.append("defs").append("clipPath")
    		.attr("id", "clip")
  			.append("rect")
    		.attr("width", width)
    		.attr("height", height);

		focus = svg.append("g")
    		.attr("class", "focus")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var context = svg.append("g")
    		.attr("class", "context")
    		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

		_data = inputData;
		_data.forEach(function(d) {
    		d.date = new Date(d.date); //parseDate(d.date);
  		});

		var data = _data.sort(function(a, b){
  			if (a.date > b.date) { return 1;}
			if (a.date < b.date) { return -1;}
			// a must be equal to b
			return 0;
		});



  		x.domain(d3.extent(data.map(function(d) { return d.date; })));
  		y.domain([0, d3.max(data.map(function(d) { return d.pm1; }))]);
  		x2.domain(x.domain());
  		y2.domain(y.domain());

  		focus.append("path")
      		.datum(data)
      		.attr("class", "area")
      		.attr("d", area);

  		focus.append("g")
      		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height + ")")
      		.call(xAxis);

  		focus.append("g")
      		.attr("class", "y axis")
      		.call(yAxis);

  		context.append("path")
      		.datum(data)
      		.attr("class", "area")
      		.attr("d", area2);

  		context.append("g")
      		.attr("class", "x axis")
      		.attr("transform", "translate(0," + height2 + ")")
      		.call(xAxis2);

  		context.append("g")
      		.attr("class", "x brush")
      		.call(brush)
    		.selectAll("rect")
      		.attr("y", -6)
      		.attr("height", height2 + 7);

  		return this;
	};




var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("bundle")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.pm1); });

var area2 = d3.svg.area()
    .interpolate("bundle")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.pm1); });

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

function type(d) {
  d.date = parseDate(d.date);
  d.pm1 = +d.pm1;
  return d;
}






//	return this;

});

// ApriD3GraphicDouble Class end ===============================================================================



