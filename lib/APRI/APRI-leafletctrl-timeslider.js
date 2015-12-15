/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriLeafLetCtrlTimeSlider*/
/** 
 * ApriLeafletBase is a base class for creating instances which make use of the Leafletjs library.
 * @framework ApriLeafLetCtrlTimeSlider
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



var _options;

// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriLeafLetCtrlTimeSlider = ApriCore.ApriLeafLetCtrlTimeSlider = ApriCore.ApriLeafLetCtrlTimeSlider || Class.extend(function () { //ApriCore.ApriLeafLetCtrlBase(function () {
	
	var layer;

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(options) {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;
		
		_options = options;

		layer = options.layer;
		
		console.log(' Constructor of ApriLeafLetCtrlTimeSlider');

		container = document.getElementsByClassName('leaflet-bottom leaflet-left')[0];
		//container = document.getElementsByTagName('body')[0];
		controlElement = document.createElement('div');
		controlElement.id = APRI.UTIL.apriGuid(controlElement.id );
		controlElement.className = controlElement.className + " leaflet-control";
		container.appendChild(controlElement);
		
		//controlElement.on("click", function(d){
        //	alert (d); // document.location.href = "http://www.example.com/" + d;
    	//});
		
//		controlElement.addEventListener("click", clickMe, false);
						
		var _currentDateTime = new Date().getTime();
	
		timeScale = d3.time.scale()
		//	.domain([new Date().getTime()-100000, new Date()])
			.domain([_currentDateTime-80000000, _currentDateTime])
			.range([0, width-margin.right-margin.left]);
			
		var xAxis = d3.svg.axis()
			.scale(timeScale)
		//	.orient("bottom")
	//		.ticks(4)
			.tickSubdivide(5)
			.tickSize(4,8,-4)
			.ticks(d3.time.minute, 60)
//			.tickFormat(d3.time.format('%H:%M'))
			.tickFormat(customTimeFormat);
			;
			
		var svgContainer = d3.select('#'+controlElement.id )
			.append("svg")
			.attr("class", "timeslidercontrol")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		
/*		var activeDateTimeGroup = svgContainer
			.append("g")
			.attr("class","activedatetime")
			.append("text")
			.attr("class","caption")
			.attr("y", -20)
			.text(activeDateTime);
*/
		var timeSliderGroup = svgContainer
			.append("g")
			.attr("class","timeslideraxis")
			.call(xAxis);
			
		timeSliderGroup
			.append("text")
			.attr("class","caption")
			.attr("y", -6)
			.text(_options.label);
		timeSliderActiveDateTime = timeSliderGroup
//			.append("g")
//			.attr("class","activedatetime")
			.append("text")
			.attr("class","activedatetime")
			.attr("x", 220)
			.attr("y", -6)
//			.text(activeDateTime);
			.text('init');


		this.setActiveDateTime (new Date(), '(init)' );

			
		var _1 = d3.select('#' + controlElement.id);
		var _2 = _1.selectAll('.tick');
		//var _3 = _2.on('click',clickMe);
		_2.on("click", this.tickHandler); 
		//		function(d){
        //	alert (d); // document.location.href = "http://www.example.com/" + d;
    	//});


//		var _2 = slider(d3Slider);
//		var _3 = _2.axis(true);
//		d3Slider.call(slider(d3Slider).axis(true));
		//d3Slider.axis(true);
//		d3Slider.min(2000);
//		d3Slider.max(2100);
		//.call(slider().axis(true).min(2000).max(2100).step(5));
	}

	var container, controlElement, timeScale;
    var handle1,
      	handle2 = null;
		
	//var activeDateTime;
	var timeSliderActiveDateTime;
	
	
	this.tickHandler = function(d) {
		if (document.documentMode) {
			// iexplorer
			var evt = document.createEvent("Event");
			evt.initEvent('tickEvent', true, false);
			//document.getElementById('target').dispatchEvent(evt); 
			document.dispatchEvent(evt);
		} else {
			var tickEvent = new CustomEvent('tickEvent', {detail: {layer:layer,sliderDate: d}});
			document.dispatchEvent(tickEvent);
		}
	}
	
	var margin = {top: 35, right: 20, bottom: 0, left: 20},
    	width = 520 - margin.left - margin.right,
    	height = 45 - margin.top - margin.bottom;

	var customTimeFormat = d3.time.format.multi([
		[".%L", function(d) { return d.getMilliseconds(); }],
  		[":%S", function(d) { return d.getSeconds(); }],
  		["%M", function(d) { return d.getMinutes(); }],
  		["%I:%M", function(d) { return d.getMinutes(); }],
  		["%H", function(d) { return d.getHours(); }],
  		["%I %p", function(d) { return d.getHours(); }],
  		["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
  		["%b %d", function(d) { return d.getDate() != 1; }],
  		["%B", function(d) { return d.getMonth(); }],
  		["%Y", function() { return true; }]
	]);
	
	this.setActiveDateTime = function(date, prefix) {
		var tmp1 = timeSliderActiveDateTime[0];
		var tmp2 = tmp1[0];
		tmp2.textContent = formattedDate(date) + prefix;
//		return formattedDate(date);
	}
	
	function formattedDate(date) {
    	var d = new Date(date || Date.now()),
        	month = '' + (d.getMonth() + 1),
        	day = '' + d.getDate(),
        	year = d.getFullYear(),
			hour = '' + d.getHours(),
			minute = '' + d.getMinutes();

    	if (month.length < 2) month = '0' + month;
    	if (day.length < 2) day = '0' + day;
    	if (hour.length < 2) hour = '0' + hour;
    	if (minute.length < 2) minute = '0' + minute;

		return [day, month, year].join('-') + ' ' + hour + ':' + minute;
	}
	
	this.initControl = function(options) {
		controlElement.className = controlElement.className + " apri-leaflet-control-active ";
	}
	
	this.hide = function() {
		controlElement.classList.remove("visible");
		controlElement.classList.add("hide");
	}

	this.show = function() {
		controlElement.classList.remove("hide");
		controlElement.classList.add("visible");
	}


/*
  // Public variables width default settings
  var min = 0,
      max = 100,
      step = 0.01,
      animate = true,
      orientation = "horizontal",
      axis = false,
      margin = 50,
      value,
      active = 1,
      snap = false,
      scale;

  // Private variables
  var axisScale,
      dispatch = d3.dispatch("slide", "slideend"),
      formatPercent = d3.format(".2%"),
      tickFormat = d3.format(".0"),
      handle1,
      handle2 = null,
      sliderLength;

  function slider(selection) {
    selection.each(function() {

//      // Create scale if not defined by user
//      if (!scale) {
//        scale = d3.scale.linear().domain([min, max]);
//      }

      // Start value
//      value = value || scale.domain()[0];
      value = value || timeScale.domain()[0];

      // DIV container
      var div = d3.select(this).classed("d3-slider d3-slider-" + orientation, true);
      
      var drag = d3.behavior.drag();
      drag.on('dragend', function () {
        dispatch.slideend(d3.event, value);
      })

      // Slider handle
      //if range slider, create two
      var divRange;

      if ( value.length == 2 ) {
        handle1 = div.append("a")
          .classed("d3-slider-handle", true)
          .attr("xlink:href", "#")
          .attr('id', "handle-one")
          .on("click", stopPropagation)
          .call(drag);
        handle2 = div.append("a")
          .classed("d3-slider-handle", true)
          .attr('id', "handle-two")
          .attr("xlink:href", "#")
          .on("click", stopPropagation)
          .call(drag);
      } else {
        handle1 = div.append("a")
          .classed("d3-slider-handle", true)
          .attr("xlink:href", "#")
          .attr('id', "handle-one")
          .on("click", stopPropagation)
          .call(drag);
      }
      
      // Horizontal slider
      if (orientation === "horizontal") {

        div.on("click", onClickHorizontal);
        
        if ( value.length == 2 ) {
          divRange = d3.select(this).append('div').classed("d3-slider-range", true);

          handle1.style("left", formatPercent(scale(value[ 0 ])));
          divRange.style("left", formatPercent(scale(value[ 0 ])));
          drag.on("drag", onDragHorizontal);

          var width = 100 - parseFloat(formatPercent(scale(value[ 1 ])));
          handle2.style("left", formatPercent(scale(value[ 1 ])));
          divRange.style("right", width+"%");
          drag.on("drag", onDragHorizontal);

        } else {
          handle1.style("left", formatPercent(scale(value)));
          drag.on("drag", onDragHorizontal);
        }

		var _tst = div.style("height");
        if (div.style("height")!=undefined) {
			sliderLength = parseInt(div.style("height"), 10);
		} else sliderLength = 100;

      } else { // Vertical

        div.on("click", onClickVertical);
        drag.on("drag", onDragVertical);
        if ( value.length == 2 ) {
          divRange = d3.select(this).append('div').classed("d3-slider-range-vertical", true);

          handle1.style("bottom", formatPercent(scale(value[ 0 ])));
          divRange.style("bottom", formatPercent(scale(value[ 0 ])));
          drag.on("drag", onDragVertical);

          var top = 100 - parseFloat(formatPercent(scale(value[ 1 ])));
          handle2.style("bottom", formatPercent(scale(value[ 1 ])));
          divRange.style("top", top+"%");
          drag.on("drag", onDragVertical);

        } else {
          handle1.style("bottom", formatPercent(scale(value)));
          drag.on("drag", onDragVertical);
        }
        
		var _tst = div.style("height");
        if (div.style("height")!=undefined) {
			sliderLength = parseInt(div.style("height"), 10);
		} else sliderLength = 100;

      }
      
      if (axis) {
        createAxis(div);
      }


      function createAxis(dom) {

        // Create axis if not defined by user
        if (typeof axis === "boolean") {

          axis = d3.svg.axis()
              .ticks(Math.round(sliderLength / 100))
              .tickFormat(tickFormat)
              .orient((orientation === "horizontal") ? "bottom" :  "right");

        }

        // Copy slider scale to move from percentages to pixels
        axisScale = scale.copy().range([0, sliderLength]);
          axis.scale(axisScale);

          // Create SVG axis container
        var svg = dom.append("svg")
            .classed("d3-slider-axis d3-slider-axis-" + axis.orient(), true)
            .on("click", stopPropagation);

        var g = svg.append("g");

        // Horizontal axis
        if (orientation === "horizontal") {

          svg.style("margin-left", -margin + "px");

          svg.attr({
            width: sliderLength + margin * 2,
            height: margin
          });

          if (axis.orient() === "top") {
            svg.style("top", -margin + "px");
            g.attr("transform", "translate(" + margin + "," + margin + ")");
          } else { // bottom
            g.attr("transform", "translate(" + margin + ",0)");
          }

        } else { // Vertical

          svg.style("top", -margin + "px");

          svg.attr({
            width: margin,
            height: sliderLength + margin * 2
          });

          if (axis.orient() === "left") {
            svg.style("left", -margin + "px");
            g.attr("transform", "translate(" + margin + "," + margin + ")");
          } else { // right          
            g.attr("transform", "translate(" + 0 + "," + margin + ")");
          }

        }

        g.call(axis);

      }

      function onClickHorizontal() {
        if (!value.length) {
          var pos = Math.max(0, Math.min(sliderLength, d3.event.offsetX || d3.event.layerX));
          moveHandle(stepValue(scale.invert(pos / sliderLength)));
        }
      }

      function onClickVertical() {
        if (!value.length) {
          var pos = sliderLength - Math.max(0, Math.min(sliderLength, d3.event.offsetY || d3.event.layerY));
          moveHandle(stepValue(scale.invert(pos / sliderLength)));
        }
      }

      function onDragHorizontal() {
        if ( d3.event.sourceEvent.target.id === "handle-one") {
          active = 1;
        } else if ( d3.event.sourceEvent.target.id == "handle-two" ) {
          active = 2;
        }
        var pos = Math.max(0, Math.min(sliderLength, d3.event.x));
        moveHandle(stepValue(scale.invert(pos / sliderLength)));
      }

      function onDragVertical() {
        if ( d3.event.sourceEvent.target.id === "handle-one") {
          active = 1;
        } else if ( d3.event.sourceEvent.target.id == "handle-two" ) {
          active = 2;
        }
        var pos = sliderLength - Math.max(0, Math.min(sliderLength, d3.event.y))
        moveHandle(stepValue(scale.invert(pos / sliderLength)));
      }

      function stopPropagation() {
        d3.event.stopPropagation();
      }

    });

  }

  // Move slider handle on click/drag
  function moveHandle(newValue) {
    var currentValue = value.length ? value[active - 1]: value,
        oldPos = formatPercent(scale(stepValue(currentValue))),
        newPos = formatPercent(scale(stepValue(newValue))),
        position = (orientation === "horizontal") ? "left" : "bottom";
    if (oldPos !== newPos) {

      if ( value.length === 2) {
        value[ active - 1 ] = newValue;
        if (d3.event) {
          dispatch.slide(d3.event, value );
        };
      } else {
        if (d3.event) {
          dispatch.slide(d3.event.sourceEvent || d3.event, value = newValue);
        };
      }

      if ( value[ 0 ] >= value[ 1 ] ) return;
      if ( active === 1 ) {
        if (value.length === 2) {
          (position === "left") ? divRange.style("left", newPos) : divRange.style("bottom", newPos);
        }

        if (animate) {
          handle1.transition()
              .styleTween(position, function() { return d3.interpolate(oldPos, newPos); })
              .duration((typeof animate === "number") ? animate : 250);
        } else {
          handle1.style(position, newPos);
        }
      } else {
        
        var width = 100 - parseFloat(newPos);
        var top = 100 - parseFloat(newPos);

        (position === "left") ? divRange.style("right", width + "%") : divRange.style("top", top + "%");
        
        if (animate) {
          handle2.transition()
              .styleTween(position, function() { return d3.interpolate(oldPos, newPos); })
              .duration((typeof animate === "number") ? animate : 250);
        } else {
          handle2.style(position, newPos);
        }
      }
    }
  }

  // Calculate nearest step value
  function stepValue(val) {

    if (val === scale.domain()[0] || val === scale.domain()[1]) {
      return val;
    }

    var alignValue = val;
    if (snap) {
      var val_i = scale(val);
      var dist = scale.ticks().map(function(d) {return val_i - scale(d);});
      var i = -1,
          index = 0,
          r = scale.range()[1];
      do {
          i++;
          if (Math.abs(dist[i]) < r) {
            r = Math.abs(dist[i]);
            index = i;
          };
      } while (dist[i] > 0 && i < dist.length - 1);
      alignValue = scale.ticks()[index];
    } else{
      var valModStep = (val - scale.domain()[0]) % step;
      alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += (valModStep > 0) ? step : -step;
      }
    };

    return alignValue;

  }

  // Getter/setter functions
  slider.min = function(_) {
    if (!arguments.length) return min;
    min = _;
    return slider;
  };

  slider.max = function(_) {
    if (!arguments.length) return max;
    max = _;
    return slider;
  };

  slider.step = function(_) {
    if (!arguments.length) return step;
    step = _;
    return slider;
  };

  slider.animate = function(_) {
    if (!arguments.length) return animate;
    animate = _;
    return slider;
  };

  slider.orientation = function(_) {
    if (!arguments.length) return orientation;
    orientation = _;
    return slider;
  };

  slider.axis = function(_) {
    if (!arguments.length) return axis;
    axis = _;
    return slider;
  };

  slider.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return slider;
  };

  slider.value = function(_) {
    if (!arguments.length) return value;
    if (value) {
      moveHandle(stepValue(_));
    };
    value = _;
    return slider;
  };

  slider.snap = function(_) {
    if (!arguments.length) return snap;
    snap = _;
    return slider;
  };

  slider.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return slider;
  };

  d3.rebind(slider, dispatch, "on");

 // return slider;


*/

	
});

// ApriLeafLetCtrlTimeSlider Class end ===============================================================================



