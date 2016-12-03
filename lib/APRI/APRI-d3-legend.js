/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriD3Legend*/
/** 
 * ApriD3Legend is a for creating instances of the apri d3 logo.
 * @framework ApriD3Legend
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.


// ApriD3Legend class def ===============================================================================
// parent: class ApriD3Base
var ApriD3Legend = ApriCore.ApriD3Legend = ApriCore.ApriD3Legend || ApriCore.ApriD3Base.extend(function () {

	var container, controlElement;
	var _options;


	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(options) {
		//Execute the constructor of the class we extended.
        this.super();
		
		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriD3Legend');
		
		container = document.getElementsByClassName('leaflet-bottom leaflet-left')[0];
		//container = document.getElementsByTagName('body')[0];
		controlElement = document.createElement('div');
		controlElement.className = 'leaflet-control';
		controlElement.id = APRI.UTIL.apriGuid(controlElement.id );
		container.appendChild(controlElement);
		
		_options = options;
				
		this.createLegend();

	}


	this.createLegend = function(){
	
		var width = 482,
    		height = 62,
			top = 25,
    		formatPercent = d3.format(".0%"),
    		formatNumber = d3.format(".0f");
			
		if (_options.test == true) {
			height += 25;
		}			

		var threshold = d3.scale.threshold()
			.domain(_options.domain )
//			.domain([0].concat(_options.domain) )
		    .range(_options.range);
//		    .range(['#000000'].concat(_options.range) );

		// A position encoding for the key only.
		var x = d3.scale.linear()
//		    .domain([0.0, 100])
		    .domain([_options.domain[0], _options.domain[_options.domain.length-1] ])
		    .range([0, 440]);

		var xAxis = d3.svg.axis()
		    .scale(x)
    		.orient("bottom")
    		.tickSize(13)
    		.tickValues(threshold.domain())
    		.tickFormat(function(d) { return d === .5 ? formatPercent(d) : formatNumber(1 * d); });

		var svg = d3.select("#"+controlElement.id).append("svg")
			.attr("class", "legendkey")
    		.attr("width", width)
    		.attr("height", height);


		
		var g = svg.append("g")
    	//	.attr("class", "legendkey leaflet-bar leaflet-control")
    		.attr("transform", "translate(" + (width -445) / 2 + "," + top + ")"); //+ height / 2 + ")");

		g.selectAll("rect")
    		.data(threshold.range().map(function(color) {
      			var d = threshold.invertExtent(color);
      			if (d[0] == null) d[0] = x.domain()[0];
      			if (d[1] == null) d[1] = x.domain()[1];
      			return d;
    		}))
  			.enter().append("rect")
    		.attr("height", 8)
    		.attr("x", function(d) { return x(d[0]); })
    		.attr("width", function(d) { return x(d[1]) - x(d[0]); })
    		.style("fill", function(d) { return threshold(d[0]); });

		if (_options.test == true) {
			//alert('dit is een test');
			var gTest = svg.append("g")
    			.attr("transform", "translate(" + (width -445) / 2 + "," + top + ")")
			;
			
			var testItemWidth = 30;

			gTest.selectAll("rect")
    			.data(_options.domain)
  				.enter().append("rect")
    			.attr("height", 8)
    			.attr("x", function(d, i) { 
					return (i*(testItemWidth+5) ); })
    			.attr("y", 26)
    			.attr("width", testItemWidth )
    			.attr("height", 20 )
    			.style("fill", function(d) { 
					return threshold(d); })
//					return _options.scale(d); })
//				.append("text")
//    			.attr("class", "caption")
//    			.attr("y", 10)
//    			.text(function(d) { 
//					return d; })
				;

			gTest.selectAll("text")
    			.data(_options.domain)
  				.enter().append("text")
    			//.attr("height", 8)
    			.attr("x", function(d, i) { 
					return (i*(testItemWidth+5)+6 ); })
//    			.attr("y", 40)
//    			.attr("width", 20 )
//    			.attr("height", 20 )
//    			.style("fill", function(d) { 
//					return _options.scale(d); })
//				.append("text")
    			.attr("class", "caption")
    			.attr("y", 40)
    			.text(function(d) { 
					return d; });

		}

		g.call(xAxis).append("text")
    		.attr("class", "caption")
    		.attr("y", -6)
    		.text(_options.label);
				
	};

	this.initControl = function(options) {
		controlElement.className = controlElement.className + " apri-leaflet-control-active ";
		return controlElement;
	}
	
	this.hide = function() {
		controlElement.classList.remove("visible");
		controlElement.classList.add("hide");
	}

	this.show = function() {
		controlElement.classList.remove("hide");
		controlElement.classList.add("visible");
	}


});


// ApriD3Legend Class end ===============================================================================



