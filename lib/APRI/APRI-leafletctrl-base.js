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
	
	var ctrlPosition;
	var ctrlContainer, ctrlInfoCtrl, ctrlHeader, ctrlBody, ctrlBodyContent, ctrlFooter;
	
		var controlContent;
	
	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(options) {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriLeafLetCtrlBase');
		
		ctrlPosition = 'leaflet-top leaflet-left'; // default
		if (options) {
			if (options.ctrlPosition && options.ctrlPosition !='') {
				ctrlPosition = options.ctrlPosition;
			}
		}

		//container 
		ctrlContainer = document.getElementsByClassName(ctrlPosition)[0];
		ctrlInfoCtrl = document.createElement('div');
		ctrlInfoCtrl.id = APRI.UTIL.apriGuid(ctrlInfoCtrl.id );
		ctrlInfoCtrl.className = ctrlInfoCtrl.className + " leaflet-control";
		ctrlContainer.appendChild(ctrlInfoCtrl);
		controlContent = document.createElement('div');
		controlContent.className = controlContent.className + " apri-leaflet-control-content";
		ctrlInfoCtrl.appendChild(controlContent);

		ctrlHeader = document.createElement('div');
		ctrlHeader.className = ctrlHeader.className + " apri-leaflet-control-header";
		ctrlBody = document.createElement('div');
		ctrlBody.className = ctrlBody.className + " apri-leaflet-control-body apri-leaflet-control-scroll";
		ctrlBodyContent = document.createElement('div');
		ctrlBodyContent.className = "apri-leaflet-control-body-content";
		ctrlFooter = document.createElement('div');
		ctrlFooter.className = ctrlFooter.className + " apri-leaflet-control-footer";

		controlContent.appendChild(ctrlHeader);
		controlContent.appendChild(ctrlBody);
		ctrlBody.appendChild(ctrlBodyContent);
		controlContent.appendChild(ctrlFooter);		
						
		ctrlInfoCtrl.addEventListener("click", function(e){
//    		event.preventDefault();
			e.stopPropagation();
		});
		ctrlInfoCtrl.addEventListener("dblclick", function(e){
//    		e.preventDefault();
			e.stopPropagation();
		});
		ctrlInfoCtrl.addEventListener("mousedown", function(e){
//    		event.preventDefault();
			e.stopPropagation();
		});
		ctrlInfoCtrl.addEventListener("wheel", function(e){
//    		event.preventDefault();
			e.stopPropagation();
		});
		
	}


	
	this.initControl = function(options) {
		//var ctrlInfoCtrl = this.ctrlInfoCtrl;
		ctrlInfoCtrl.className = ctrlInfoCtrl.className + " apri-leaflet-control-active ";
		if ( options && options.type == "legendPgn") {
			ctrlBody.innerHTML = '<img src="' + options.url + '"></img>';
		};
		
	}

	this.hide = function() {
		ctrlInfoCtrl.classList.remove("visible");
		ctrlInfoCtrl.classList.add("hide");
	}

	this.show = function() {
		ctrlInfoCtrl.classList.remove("hide");
		ctrlInfoCtrl.classList.add("visible");
	}
		
	this.clearControl = function() {
		if (ctrlBodyContent) ctrlBodyContent.innerHTML = "";
	}
	
	this.getCtrlBodyContent = function() {
		return ctrlBodyContent;
	}
	
	this.getInfoCtrl = function() {
		return ctrlInfoCtrl;
	}	
		
	this.fillControl = function(data) {
		var i;
		controlContent.className = controlContent.className + " apri-leaflet-control-legend";
		
//		var ctrlHeader = document.createElement('div');
//		ctrlHeader.className = ctrlHeader.className + " apri-leaflet-control-header";
//		var ctrlBody = document.createElement('div');
//		ctrlBody.className = ctrlBody.className + " apri-leaflet-control-body apri-leaflet-control-scroll";
//		var ctrlFooter = document.createElement('div');
//		ctrlFooter.className = ctrlFooter.className + " apri-leaflet-control-footer";
		
		ctrlHeader.innerHTML = "<h2>NSL maatregelen 2013</h2>";
		ctrlFooter.innerHTML = "<div>Nationaal Samenwerkingsprogramma Luchtkwaliteit (NSL)</div>";
		
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
		
		ctrlBodyContent = document.createElement('table');
		for (i=0;i<simpleObject.children.length;i++) {
			var _simpleObjectRecord = simpleObject.children[i];
			var tableRow = document.createElement('tr');
			var _string = "";
			if (_simpleObjectRecord.properties && _simpleObjectRecord.properties.maatr_id) {
				_string = ' maatregel ' + _simpleObjectRecord.properties.maatr_id; // + ' ' + _simpleObjectRecord.properties.naam + " (" + _simpleObjectRecord.properties.stof + " fact.:" + _simpleObjectRecord.properties.factor + ")";
			};
			tableRow.innerHTML = "<td>" + _simpleObjectRecord.name  + _string + " </td>";
			ctrlBodyContent.appendChild(tableRow);
		}
		ctrlBody.appendChild(ctrlBodyContent);
		
//		controlContent.appendChild(ctrlHeader);
//		controlContent.appendChild(ctrlBody);
//		controlContent.appendChild(ctrlFooter);
	}


	
});

// ApriLeafLetCtrlBase Class end ===============================================================================



