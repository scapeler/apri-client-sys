/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriLeafLetBase*/
/** 
 * ApriLeafletBase is a base class for creating instances which make use of the Leafletjs library.
 * @framework ApriLeafLetBase
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriLeafLetBase = ApriCore.ApriLeafLetBase = ApriCore.ApriLeafLetBase || Class.extend(function () {
	
	var map;
	
	// private vars
	var viewCoordinates;
	var viewZoomLevel;
	var topAreaHeight;
	var mapHeaderHeight;
	var mapFooterHeight;
	var timeDimension, timeDimensionControl, timeDimensionOptions;
	var statusActive = false;
	// public vars
	this.statusActive = false;	
	
	this.mapHeader;
	this.mapBody;
	this.mapFooter;
	
	var defaultMapBaseLayerUrl;
	var defaultMapLayerAttribution;
	
	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(options) {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;
		
		// default values
		viewCoordinates 	= [52.490, 4.97];
		viewZoomLevel 		= 12;
		topAreaHeight		= 0;
		mapHeaderHeight		= 80;
		mapFooterHeight		= 60;
		
		timeDimension		= false;
		timeDimensionControl= false;
		timeDimensionOptions= {};
		
		defaultMapBaseLayerUrl = 'https://scapeler.com/extern/{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
		defaultMapLayerAttribution = '&copy; <a href="https://scapeler.com/extern/openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://scapeler.com/extern/creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles courtesy of <a href="https://scapeler.com/extern/hot.openstreetmap.org/' ;
		
		if (options) {
			if (options.viewCoordinates) 				viewCoordinates = options.viewCoordinates;
			if (options.viewZoomLevel) 					viewZoomLevel 	= options.viewZoomLevel;
			if (options.mapHeaderHeight) 				mapHeaderHeight = options.mapHeaderHeight;
			if (options.mapFooterHeight) 				mapFooterHeight = options.mapFooterHeight;
			if (options.defaultMapBaseLayerUrl) 		defaultMapBaseLayerUrl 	= options.defaultMapBaseLayerUrl;
			if (options.defaultMapLayerAttribution) 	defaultMapLayerAttribution 	= options.defaultMapLayerAttribution;
			if (options.timeDimension) 					timeDimension 	= options.timeDimension;
			if (options.timeDimensionControl) 			timeDimensionControl 	= options.timeDimensionControl;
			if (options.timeDimensionOptions) 			timeDimensionOptions 	= options.timeDimensionOptions;
		}
		
		console.log(' Constructor of ApriLeafLetBase');

		loadDependencies('Leaflet', setStatusActive);
		
	}

	
	
	//private methods
	var setStatusActive = function() {
		statusActive = true;
	};
	
	var loadDependencies = function(objectId, callback) {
		APRI.UTIL.loader (objectId, null, null, callback);
	}
	
	this.createMap = function(container, options ) {
	
		var that = this;
		
		if (options && options.viewCoordinates) viewCoordinates 	= options.viewCoordinates;
		if (options && options.viewZoomLevel) 	viewZoomLevel 		= options.viewZoomLevel;
		if (options && options.topAreaHeight) 	topAreaHeight 		= options.topAreaHeight;
		if (options && options.timeDimension) 					timeDimension 	= options.timeDimension;
		if (options && options.timeDimensionControl) 			timeDimensionControl 	= options.timeDimensionControl;
		if (options && options.timeDimensionOptions) 			timeDimensionOptions 	= options.timeDimensionOptions;
		
		
		
		var _resize = function () {
//			var offsetSize = APRI.UTIL.getElementSize(container.offsetParent||container.parentElement);
			var offsetSize = APRI.UTIL.getElementSize(container.offsetParent||container);
			container.style.height 	= offsetSize.height+'px';
			container.style.width 	= offsetSize.width+'px';
			container.setAttribute('height', container.style.height);
			container.setAttribute('width', container.style.width);
			
			var _mapHeaderStyle = window.getComputedStyle(that.mapHeader);
			if (_mapHeaderStyle.display != 'none') {
				mapHeaderHeight 	= _mapHeaderStyle.height!=""?parseInt(_mapHeaderStyle.height):mapHeaderHeight;
			} else mapHeaderHeight	= 0;
			
			var _mapFooterStyle = window.getComputedStyle(that.mapFooter);
			if (_mapFooterStyle.display != 'none') {
				mapFooterHeight = _mapFooterStyle.height!=""?parseInt(_mapFooterStyle.height):mapFooterHeight;
			} else mapFooterHeight	= 0;
			
			var _ll = container.getElementsByClassName('apri-leaflet-app-body')[0];
			_ll.style.height 	= (offsetSize.height-topAreaHeight-mapHeaderHeight-mapFooterHeight)+'px'; //
			_ll.style.width 	= offsetSize.width+'px';
			_ll.setAttribute('height', _ll.style.height);
			_ll.setAttribute('width', _ll.style.width);
			_ll.style.position 	= 'relative';
			
		}	
		
		this.mapHeader = document.createElement('div');
		this.mapHeader.id = APRI.UTIL.apriGuid(this.mapHeader.id );
		this.mapHeader.className += " " + "apri-leaflet-app-header";
		container.appendChild(this.mapHeader);
		mapHeaderHeight = this.mapHeader.style.height!=""?parseInt(this.mapHeader.style.height):mapHeaderHeight;
		this.mapBody = document.createElement('div');
		this.mapBody.id = APRI.UTIL.apriGuid(this.mapBody.id );
		this.mapBody.style.height 	= container.style.height;
		this.mapBody.style.width 	= container.style.width;
		this.mapBody.setAttribute('height', container.style.height);
		this.mapBody.setAttribute('width', container.style.width);
		this.mapBody.className = "apri-leaflet-app-body";
		container.appendChild(this.mapBody);
		this.mapFooter = document.createElement('div');
		this.mapFooter.id = APRI.UTIL.apriGuid(this.mapFooter.id );
		this.mapFooter.className = "apri-leaflet-app-footer";
		container.appendChild(this.mapFooter);



		map = L.map(this.mapBody, { maxZoom: 18
			, timeDimension, timeDimensionControl, timeDimensionOptions
			})
			.setView(viewCoordinates, viewZoomLevel)
			;
		//map.setZoom(viewZoomLevel);
		//map.maxZoom(6);
		console.log('MaxZoom: %s', map.getMaxZoom() );

		var _resizedWindow = function () {
			_resize();
			map._onResize();		
		}
		
		// force resize to adjust map to offsetsize
		_resize();
		map._onResize();
		
		document.addEventListener("apriResize", _resizedWindow);
		
//        container.onresize=function(){
//			_resize();
//			map._onResize();
//            Y.windowBody.setStyle( 'height', window.innerHeight );
//            Y.windowBody.setStyle( 'width', window.innerWidth );
//            container.setStyle( 'height', window.innerHeight );
//            container.setStyle( 'width', window.innerWidth );
//        };
		
						
		// todo: this overrules onresize funtion. This is not correct.
//***		Y.on('resize', _onresize, window, this);
//        window.onresize=function(){
//            _leafletContainer.setStyle( 'height', window.innerHeight );
//            _leafletContainer.setStyle( 'width', window.innerWidth );
//        };



		map.invalidateSize(true);
			
		map.on('layeradd',
			function (e) {
				if (e.layer.options) {
//					var name = e.layer.options.name;
//					if (e.layer.options.loadLianderData) {
//						loadDataLianderOnce(e.layer.options.loadLianderData);
//					}
//					if (name == 'bestemmingsPlanWfsLayer' && e.layer.options.refreshData == true) {
//						e.layer.options.refreshData=false;
//						//this.getBestemmingsPlanWfs();
//					}
				if (e.layer.options.layerType == 'powerPlantsLayer' && e.layer.options.refreshData == true) {
					e.layer.options.refreshData=false;
					e.layer.options.loadDataOnce();
				}

// see overlayadd event
//					if (e.layer.options.loadDataAiReas) {
//						loadDataAiReas();
//					}
					
						


				}
			}
		);

		map.on('overlayadd',
			function (e) {
//				var name = e.layer.options.name;
//				if (e.layer.options.loadLianderData) {
//					loadDataLianderOnce(e.layer.options.loadLianderData);
//				}
//				if (e.layer.options.loadDataAiReas) {
//					loadDataAiReas();
//				}
//				if (name == 'bestemmingsPlanWfsLayer' ) {
//					//this.getBestemmingsPlanWfs();
//				}
//				if (e.layer.options.layerType == 'aardbevingenLocationsLayer' && e.layer.options.refreshData == true) {
//					e.layer.options.refreshData=false;
//					e.layer.options.loadDataOnce();
//				}
				if (e.layer.options.layerType == 'powerPlantsLayer' && e.layer.options.refreshData == true) {
					e.layer.options.refreshData=false;
					e.layer.options.loadDataOnce();
				}
//				if (e.layer.options.layerType == 'nsStationsLayer' && e.layer.options.refreshData == true) {
//					e.layer.options.refreshData=false;
//					e.layer.options.loadDataOnce();
//				}
//				if (e.layer.options.layerType == 'meetNetLocationsLayer' && e.layer.options.refreshData == true) {
//					e.layer.options.refreshData=false;
//					e.layer.options.loadDataOnce();
//				}


			}
		);
			
			
		return map;	
	}
	
	this.createTileLayer = function(url, options) {
		var _options = options||{};
		var _layer = L.tileLayer( url||defaultMapBaseLayerUrl, {
			attribution:  _options.attribution||defaultMapLayerAttribution
				, minZoom: 0
				, maxZoom: 18
            });
		_layer.addTo(map);
		return _layer;
	};
	

	this.createPowerPlantLayer = function() {	
    	// https://scapeler.com/TSCAP-550/enipedia/
		// Enipedia Power plants
		var powerPlantsLayer = new L.geoJson(null,{layerType:"powerPlantsLayer"
	//		var powerPlantsLayer = new L.Proj.GeoJson(null,{layerType:"powerPlantsLayer"
			, onEachFeature:onEachPowerPlantFeature
			, pointToLayer: function (feature, latlng) {
			
				
				if (feature.properties.pointType == 'showOutputMWh') {
					var OutputMWh = feature.properties.OutputMWh?feature.properties.OutputMWh/200:1;
					OutputMWh = OutputMWh<1?1:OutputMWh;
					//OutputMWh = OutputMWh>10000?10000:OutputMWh;
					//return L.circleMarker( latlng, {radius: OutputMWh});
					return L.circle(latlng, OutputMWh, {color:'#00F', weight:2, opacity:0.3}) ;//L.circle(latlng, OutputMWh).addTo(map);
				}
				if (feature.properties.pointType == 'showCO2') {
					var CO2kg = feature.properties.CO2kg?feature.properties.CO2kg/200000:1;
					CO2kg = CO2kg<1?1:CO2kg;
					//CO2kg = CO2kg>1000?1000:CO2kg;
					return L.circle(latlng, CO2kg, {color:'#F00', weight:2, opacity:0.3}); // L.circleMarker( latlng, {radius: CO2kg} );
				}
				return L.circleMarker(latlng, {radius: 4, color:'#000', weight:1, opacity:1}); // icon: plantIcon} );
			}
//			, coordsToLatLng:function (a) { 
//			//	console.log('test');
//				return L.latLng(a[1], a[0]);
//				}
			, refreshData:true
			//	, crs: RDcrs
			, loadDataOnce:	function () {
				ajaxGetData(APRI.getConfig().urlSystemRoot + "/enipedia/",
					function(data) {
						powerPlantsLayer.addData(JSON.parse(data));
					}
				)
			}
		}).addTo(map);
	};
	

    var onEachPowerPlantFeature = function  (feature, layer) {
            // does this feature have a property named popupContent?
            if (feature.properties && feature.properties.name && feature.properties.title) {
                layer.bindPopup(feature.properties.name + ' / ' + feature.properties.title  + ' / ' + feature.properties.fuel_types );
            }

			(function(layer, properties) {
				// Create a mouseover event
      			layer.on("mouseover", function (e) {
        			// Change the style to the highlighted version
        	//		layer.setStyle(highlightStyle);
        			// Create a popup with a unique ID linked to this record
        			var popup = document.createElement("div"); //$("<div></div>", {
					popup.id = "popup-" + 'Powerplant'; // properties.name,
/*
            			css: {
                			position: "absolute",
                			bottom: "85px",
                			left: "50px",
                			zIndex: 1002,
                			backgroundColor: "white",
                			padding: "8px",
                			border: "1px solid #ccc"
            			}
*/
        			//});
       			// Insert a headline into that popup
/*
        			var hed = $("<div></div>", {
            			text: properties.title + ": " + properties.name,
            			css: {fontSize: "16px", marginBottom: "3px"}
        			}).appendTo(popup);
        			// Add the popup to the map
        			popup.appendTo("#"+map._container.id);
*/
				});
      			// Create a mouseout event that undoes the mouseover changes
      			layer.on("mouseout", function (e) {
        			// Start by reverting the style back
        	//		layer.setStyle(defaultStyle);
        			// And then destroying the popup
        			$("#popup-" + 'Powerplant').remove(); //properties.UICCode).remove();
      			});
      			// Close the "anonymous" wrapper function, and call it while passing
      			// in the variables necessary to make the events work the way we want.
			})(layer, feature.properties);
        };


	var ajaxGetData = function (url, callback ) {
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
  			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				callback(xmlhttp.responseText);
			}
  		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
	}


	
});

// ApriLeafLetBase Class end ===============================================================================



