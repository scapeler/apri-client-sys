/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriD3GraphicTrend*/
/** 
 * ApriD3GraphicTrend is a for creating instances of the apri d3 trend graphic.
 * @framework ApriD3GraphicTrend
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriD3GraphicTrend class def 
// ===============================================================================
// parent: class ApriD3Base
var ApriD3GraphicTrend = ApriCore.ApriD3GraphicTrend = ApriCore.ApriD3GraphicTrend || ApriCore.ApriD3Base.extend(function () {

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriD3GraphicTrend');
	}

	
	var margin = {top: 25, right: 10, bottom: 50, left: 40},
    	margin2 = {top: 110, right: 10, bottom: 20, left: 40},
    	width = 450 - margin.left - margin.right,
    	height = 250 - margin.top - margin.bottom,
    	height2 = 230 - margin2.top - margin2.bottom,
		focus;

	this.render = function(data, container, options){
	}


	this.createGraphic = function(inputData, options){
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
			.attr('class', 'trend')
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
		
		var test = color.domain();
		
		var keywords = colorDomain.map(function(name, ndx) {
			var _values = data.map(function(d) { return { date: d.date, val: d[name] }; });
			var _color = color(ndx);
			var result = {
				name:   name,
				values: _values,
				color: _color 
			};
			return result;
		});

		var testDomain = d3.extent(data.map(function(d) {return d.date;} ));
		x.domain(d3.extent(data.map(function(d) {return d.date;} )));
  		y.domain([
    			d3.min(keywords, function(k) { return d3.min(k.values, function(v) { return v.val; } )}),
    			d3.max(keywords, function(k) { return d3.max(k.values, function(v) { return v.val; } )})
  			]);

		svg.append('g')
			.attr('class', 'x trendaxis')
			.attr('transform', "translate(0, " + height + ")")
			.call(xAxis.tickSize(-height, 0, 0))
			;

		svg.append('g')
			.attr('class', 'y trendaxis')
			.call(yAxis)
			;

		var keyword = svg.selectAll('.keyword')
			.data(keywords).enter()
			.append('g').attr('class', 'keyword')
			;

		keyword.append('path')
			.attr('class', 'trendline')
			.attr('id', function(d) { return d.name.replace(/\s/g,'') } )
			.attr('d', function(d) { 
				return line(d.values);
				 } )
			.attr('stroke', function(d) {  return d.color})
			;

		labels //= d3.select('#res-labels').
			.append('ul')
			.selectAll('li').data(keywords).enter()
			.append('li')
			.attr('class', 'color-label')
			.text(function(d) { return d.name;} )
			.style('color', function(d) { return d.color;})
			.on('mouseover', function(d) {
				var test = d3.select("#"+d.name.replace(/\s/g,'')+"")
				.style('stroke-opacity', 1);
				})
			.on('mouseout', function(d) {  
				var test = d3.select("#"+d.name.replace(/\s/g,'')+"")
				.style('stroke-opacity', 0.4); //.25);
				
				})
			;


/*		data.forEach(function(d) { d.date = dateParser(d.Week)} );

			keywords = color.domain().map (name, ndx) ->
			{
				name:   name,
				values: (data.map((d) -> { date: d.date, val: +d[name] })),
				color:  color(ndx)
			}

  			x.domain d3.extent(data, (d) -> d.date)
  			y.domain [
    			d3.min(keywords, (k) -> d3.min(k.values, (v) -> v.val)),
    			d3.max(keywords, (k) -> d3.max(k.values, (v) -> v.val))
  			]

			svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', "translate(0, #{height})")
				.call(xAxis.tickSize(-height, 0, 0))

			svg.append('g')
				.attr('class', 'y axis')
				.call(yAxis)

			keyword = svg.selectAll('.keyword')
				.data(keywords).enter()
				.append('g').attr('class', 'keyword')

			keyword.append('path')
				.attr('class', 'line')
				.attr('id',     (d) -> d.name.replace(/\s/g,'') )
				.attr('d',      (d) -> line(d.values))
				.attr('stroke', (d) -> color(d.name))

			labels = d3.select('#res-labels').append('ul')
				.selectAll('li').data(keywords).enter()
				.append('li')
				.attr('class', 'color-label')
				.text((d) -> d.name)
				.style('color', (d) -> d.color)
				.on('mouseover', (d) ->
					d3.select("##{d.name.replace(/\s/g,'')}")
				.style('stroke-opacity', '1'))
				.on('mouseout', (d) ->
				d3.select("##{d.name.replace(/\s/g,'')}")
				.style('stroke-opacity', '.15'))

*/

}

/*



		var _data;
		var svg = d3.select(options.container).append("svg")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom);

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


*/



//	return this;

});

// ApriD3GraphicTrend Class end 
// ===============================================================================


