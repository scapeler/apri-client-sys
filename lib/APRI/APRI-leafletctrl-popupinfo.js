/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriLeafLetCtrlPopupInfo*/
/** 
 * ApriLeafletBase is a base class for creating instances which make use of the Leafletjs library.
 * @framework ApriLeafLetCtrlPopupInfo
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriLeafLetCtrlPopupInfo = ApriCore.ApriLeafLetCtrlPopupInfo = ApriCore.ApriLeafLetCtrlPopupInfo || ApriCore.ApriLeafLetCtrlBase.extend(function () {
	

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriLeafLetCtrlPopupInfo');

		container = document.getElementsByClassName('leaflet-top leaflet-left')[0];
		//container = document.getElementsByTagName('body')[0];
		popupInfoContainer = document.createElement('div');
		popupInfoContainer.id = APRI.UTIL.apriGuid(popupInfoContainer.id );
		popupInfoContainer.style.clear = "both";
		popupInfoContainer.style.margin = "10px";
		container.appendChild(popupInfoContainer);
		

		tableContainer = d3.select('#'+popupInfoContainer.id )
			.append("table");
						
/*		svgContainer = d3.select('#'+popupInfoContainer.id )
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.style("margin","12px")
			.append("g");

		var popupInfoGroup = svgContainer
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 12 + ")")
			.attr("class","popupinfo")
			.append("text")
			.attr("class","caption")
			.text("Meetwaarden:");

		var popupInfoMeetWaardenGroup = svgContainer
			.append("g")
			.attr("class","popupinfo-meetwaarden")
			;
			
		popupInfoMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 24 + ")")
			.append("text")
			.attr("class","popupinfo-text")
			.text("PM1:");

		popupInfoMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 38 + ")")
			.append("text")
			.attr("class","popupinfo-text")
			.text("PM2.5:");

		popupInfoMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 52 + ")")
			.append("text")
			.attr("class","popupinfo-text")
			.text("PM10:");

		popupInfoMeetWaardenGroup
			.append("g")
			.attr("transform", "translate(" + 0 + "," + 66 + ")")
			.append("text")
			.attr("class","popupinfo-text")
			.text("Overall:");
*/


	}
	
	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	   	width = 300 - margin.left - margin.right,
    	height = 120 - margin.top - margin.bottom;
	var container;
	var popupInfoContainer;
	var svgContainer;
	var tableContainer;	

	this.getSvgContainer = function() {
		return svgContainer;
	}
	this.getTableContainer = function() {
		return tableContainer;
	}

});

// ApriLeafLetCtrlPopupInfo Class end ===============================================================================



