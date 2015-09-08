/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriLeafLetCtrlInfoCtrl*/
/** 
 * ApriLeafletBase is a base class for creating instances which make use of the Leafletjs library.
 * @framework ApriLeafLetCtrlInfoCtrl
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriLeafLetCtrlInfoCtrl = ApriCore.ApriLeafLetCtrlInfoCtrl = ApriCore.ApriLeafLetCtrlInfoCtrl || ApriCore.ApriLeafLetCtrlBase.extend(function () {
	
	
	var infoCtrlItem;

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(options) {
		//Execute the constructor of the class we extended.
        this.super(options);
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriLeafLetCtrlInfoCtrl');
		
		var infoCtrl = this.getInfoCtrl();
		infoCtrl.className = infoCtrl.className + ' infoctrl';
		
		infoCtrlItem = document.createElement('div');
		infoCtrlItem.id = APRI.UTIL.apriGuid(infoCtrlItem.id );
		infoCtrlItem.className = "infoCtrlItem";
		var bc = this.getCtrlBodyContent();
		bc.appendChild(infoCtrlItem);
		
		
/*
		container = document.getElementsByClassName(ctrlPosition)[0];
		//container = document.getElementsByTagName('body')[0];
		infoCtrlContainer = document.createElement('div');
		infoCtrlContainer.id = APRI.UTIL.apriGuid(infoCtrlContainer.id );
		infoCtrlContainer.style.clear = "both";
		infoCtrlContainer.style.margin = "10px";
		container.appendChild(infoCtrlContainer);
*/		

//		tableContainer = d3.select('#'+infoCtrlContainer.id )
//			.append("table");
						
/*		svgContainer = d3.select('#'+infoCtrlContainer.id )
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.style("margin","12px")
			.append("g");

		var infoCtrlGroup = svgContainer
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 12 + ")")
			.attr("class","infoctrl")
			.append("text")
			.attr("class","caption")
			.text("Meetwaarden:");

		var infoCtrlMeetWaardenGroup = svgContainer
			.append("g")
			.attr("class","infoctrl-meetwaarden")
			;
			
		infoCtrlMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 24 + ")")
			.append("text")
			.attr("class","infoctrl-text")
			.text("PM1:");

		infoCtrlMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 38 + ")")
			.append("text")
			.attr("class","infoctrl-text")
			.text("PM2.5:");

		infoCtrlMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 52 + ")")
			.append("text")
			.attr("class","infoctrl-text")
			.text("PM10:");

		infoCtrlMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 66 + ")")
			.append("text")
			.attr("class","infoctrl-text")
			.text("Overall:");
*/


	}
	
/*
	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	   	width = 300 - margin.left - margin.right,
    	height = 120 - margin.top - margin.bottom;
	var container;
	var infoCtrlContainer;
	var svgContainer;
	var tableContainer;	

	this.getSvgContainer = function() {
		return svgContainer;
	}
	this.getTableContainer = function() {
		return tableContainer;
	}
*/

	this.setInfoCtrlItemHtml = function(itemContent) {
		infoCtrlItem.innerHTML = itemContent;
	}

});

// ApriLeafLetCtrlInfoCtrl Class end ===============================================================================



