/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriLeafLetCtrlBase*/
/** 
 * ApriLeafletLayerBase is a base class for creating leaflet layers.
 * @framework ApriLeafLetLayerBase
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriLeafLetLayerBase class def ===============================================================================
// parent:
var ApriLeafLetLayerBase = ApriCore.ApriLeafLetLayerBase = ApriCore.ApriLeafLetLayerBase || Class.extend(function () {
	

	var layerClass = L.Class.extend({
		initialize: function (latlng) {
        	// save position of the layer or any options from the constructor
        	this._latlng = latlng;
    	},

    	onAdd: function (map) {
        	this._map = map;

	        // create a DOM element and put it into one of the map panes
    	    this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');
       		 map.getPanes().overlayPane.appendChild(this._el);

			_add();

        	// add a viewreset event listener for updating layer's position, do the latter
        	map.on('viewreset', this._reset, this);			
        	this._reset();
    	},

    	onRemove: function (map) {
		
			_remove();
			
        	// remove layer's DOM elements and listeners
        	map.getPanes().overlayPane.removeChild(this._el);
        	map.off('viewreset', this._reset, this);
    	},

		_reset: function () {
        	// update layer's position
        	var pos = this._map.latLngToLayerPoint(this._latlng);
        	L.DomUtil.setPosition(this._el, pos);
    	}
		
	});
	
	var _layer;
		
	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our class-specific properties
		//this.options = options;
		
		console.log(' Constructor of ApriLeafLetLayerBase');
		
	}
	
	this.initLayer = function(options) {
		_layer = new layerClass(options.latLng);
		return _layer;
	}

	var _add = function(e) {

		if (_layer.layerControl) {
			if ( Object.prototype.toString.call( _layer.layerControl ) === '[object Array]' ) {
				for (var i=0;i<_layer.layerControl.length;i++) {
					_layer.layerControl[i].show();
				}
			} else {
				_layer.layerControl.show();
			}
		}

	}

	var _remove = function(e) {

		if (_layer.options) {

	//		if (e.layer.options.layerType == 'baseLayer') {
				//e.layer.refreshData=true;
				// remove control ?? e.layer.layerControl = initLayerCtrl();
	//		}
			
		}
	
		if (_layer.layerControl) {
			if ( Object.prototype.toString.call( _layer.layerControl ) === '[object Array]' ) {
				for (var i=0;i<_layer.layerControl.length;i++) {
					_layer.layerControl[i].hide();
				}
			} else {
				_layer.layerControl.hide();
			}
		}
		
	}
		
	var _clearControl = function() {
	}

	
});

// ApriLeafLetLayerBase Class end ===============================================================================



