/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriD3Base*/
/** 
 * ApriD3Base is a base class for creating instances which make use of the D3js library.
 * @framework ApriD3Base
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriD3Base = ApriCore.ApriD3Base = ApriCore.ApriD3Base || Class.extend(function () {
	
	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriD3Base');

		loadDependencies('d3', setStatusActive);
		
		svg = null;
	}


	// private vars
	var statusActive = false;
	var svg;
	// public vars
	this.statusActive = false;	
	
	//private methods
	var setStatusActive = function() {
		statusActive = true;
	};
	
	var loadDependencies = function(objectId, callback) {
		APRI.UTIL.loader (objectId, null, null, callback);
	}

	this.getSvg = function() { 
		console.log('svg wordt opgehaald');
		return svg;
	};
	this.setSvg = function(newSvg) { 
		console.log('svg wordt gezet');
		svg = newSvg
		//return svg;
	};

});

// ApriD3Base Class end ===============================================================================



