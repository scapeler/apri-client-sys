/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriLeafLetCtrlBase*/
/** 
 * ApriLeafletBase is a base class for creating instances which make use of the Leafletjs library.
 * @framework ApriLeafLetCtrlBase
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.



// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriLeafLetCtrlBase = ApriCore.ApriLeafLetCtrlBase = ApriCore.ApriLeafLetCtrlBase || Class.extend(function () {
	

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriLeafLetCtrlBase');

		container = document.getElementsByClassName('leaflet-bottom leaflet-left')[0];
		controlElement = document.createElement('div');
		controlElement.id = APRI.UTIL.apriGuid(controlElement.id );
		controlElement.className = controlElement.className + " leaflet-control";
		container.appendChild(controlElement);
		controlContent = document.createElement('div');
		controlContent.className = controlContent.className + " apri-leaflet-control-content";
		controlElement.appendChild(controlContent);

		controlHeader = document.createElement('div');
		controlHeader.className = controlHeader.className + " apri-leaflet-control-header";
		controlBody = document.createElement('div');
		controlBody.className = controlBody.className + " apri-leaflet-control-body apri-leaflet-control-scroll";
		controlFooter = document.createElement('div');
		controlFooter.className = controlFooter.className + " apri-leaflet-control-footer";

		controlContent.appendChild(controlHeader);
		controlContent.appendChild(controlBody);
		controlContent.appendChild(controlFooter);		
						
		controlElement.addEventListener("click", function(e){
//    		event.preventDefault();
			e.stopPropagation();
		});
		controlElement.addEventListener("dblclick", function(e){
//    		e.preventDefault();
			e.stopPropagation();
		});
		controlElement.addEventListener("mousedown", function(e){
//    		event.preventDefault();
			e.stopPropagation();
		});
		controlElement.addEventListener("wheel", function(e){
//    		event.preventDefault();
			e.stopPropagation();
		});
		
	}

	var container, controlElement, controlContent, controlHeader, controlBody, controlBodyContent, controlFooter;
	
	this.initControl = function(options) {
		//var controlElement = this.controlElement;
		controlElement.className = controlElement.className + " apri-leaflet-control-active ";
		if ( options && options.type == "legendPgn") {
			controlBody.innerHTML = '<img src="' + options.url + '"></img>';
		};
		
	}

	this.hide = function() {
		controlElement.classList.remove("visible");
		controlElement.classList.add("hide");
	}

	this.show = function() {
		controlElement.classList.remove("hide");
		controlElement.classList.add("visible");
	}
		
	this.clearControl = function() {
		if (controlBodyContent) controlBodyContent.innerHTML = "";
	}
	
	this.fillControl = function(data) {
		var i;
		controlContent.className = controlContent.className + " apri-leaflet-control-legend";
		
//		var controlHeader = document.createElement('div');
//		controlHeader.className = controlHeader.className + " apri-leaflet-control-header";
//		var controlBody = document.createElement('div');
//		controlBody.className = controlBody.className + " apri-leaflet-control-body apri-leaflet-control-scroll";
//		var controlFooter = document.createElement('div');
//		controlFooter.className = controlFooter.className + " apri-leaflet-control-footer";
		
		controlHeader.innerHTML = "<h2>NSL maatregelen 2013</h2>";
		controlFooter.innerHTML = "<div>Nationaal Samenwerkingsprogramma Luchtkwaliteit (NSL)</div>";
		
		//var tree = new ApriCore.ApriTreeBase();
		var hierarchicalTreeArray = [];
		var idx = 1;
		var prevParentId;
		var hierarchicalTreeArrayRoot = {id: idx, parentId:null, name: 'root' };
		hierarchicalTreeArray.push(hierarchicalTreeArrayRoot);
		for (i=0;i<data.length;i++) {
			if (i==0 || hierarchicalTreeArray[prevParentId-1].maatr_id != data[i].properties.maatr_id) {
				var hierarchicalTreeArrayHashLvl2 = {};
				idx++;
				prevParentId = idx;
				hierarchicalTreeArrayHashLvl2.id = idx;
				hierarchicalTreeArrayHashLvl2.parentId = 1;	//root	
				hierarchicalTreeArrayHashLvl2.maatr_id = data[i].properties.maatr_id;
				hierarchicalTreeArrayHashLvl2.name = data[i].properties.naam;
				hierarchicalTreeArrayHashLvl2.properties = {};
				hierarchicalTreeArrayHashLvl2.properties.maatr_id = data[i].properties.maatr_id;
				hierarchicalTreeArray.push(hierarchicalTreeArrayHashLvl2);			
			}
			idx++;
			var hierarchicalTreeArrayHashLvl3 = {};
			hierarchicalTreeArrayHashLvl3.id = idx;
			hierarchicalTreeArrayHashLvl3.parentId = prevParentId;
			hierarchicalTreeArrayHashLvl3.name = data[i].properties.naam;
			hierarchicalTreeArrayHashLvl3.geometry = data[i].geometry;
			hierarchicalTreeArrayHashLvl3.properties = data[i].properties;
			hierarchicalTreeArray.push(hierarchicalTreeArrayHashLvl3);
		}
		
		var tree= ApriCore.ApriTreeBase.createFromFlatTable(hierarchicalTreeArray);
		var simpleObject = tree.toSimpleObject();
		
		controlBodyContent = document.createElement('table');
		for (i=0;i<simpleObject.children.length;i++) {
			var _simpleObjectRecord = simpleObject.children[i];
			var tableRow = document.createElement('tr');
			var _string = "";
			if (_simpleObjectRecord.properties && _simpleObjectRecord.properties.maatr_id) {
				_string = ' maatregel ' + _simpleObjectRecord.properties.maatr_id; // + ' ' + _simpleObjectRecord.properties.naam + " (" + _simpleObjectRecord.properties.stof + " fact.:" + _simpleObjectRecord.properties.factor + ")";
			};
			tableRow.innerHTML = "<td>" + _simpleObjectRecord.name  + _string + " </td>";
			controlBodyContent.appendChild(tableRow);
		}
		controlBody.appendChild(controlBodyContent);
		
//		controlContent.appendChild(controlHeader);
//		controlContent.appendChild(controlBody);
//		controlContent.appendChild(controlFooter);
	}


	
});

// ApriLeafLetCtrlBase Class end ===============================================================================



