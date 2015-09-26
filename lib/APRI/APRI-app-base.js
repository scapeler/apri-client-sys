/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global APRI*/
/** 
 * The APRI framework manages all the global actions like loading of classes, modules (js, css) and cares about dependencies.
 *  Also creates instances/objects of loaded classes and is the place for central info and methods.
 * @framework APRI
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.

// ApriAppBase class def ===============================================================================
// parent: class ApriAppBase
var ApriAppBase = ApriApps.ApriAppBase = ApriApps.ApriAppBase || Class.extend(function () {

	var apriAjaxBase;
	var _appContainer;
	
	this.id=null;
	this.appContainer;

	
	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(objectId, options) {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriAppBase-specific properties
		//this.options = options;

		//console.log(' Constructor of ApriAppBase');
		
	//	<div id="apri-app-body" style="position:relative; ">
	
		this.id = APRI.UTIL.apriGuid(null);
		Apri_Instances.apps[this.id] = this;
		
		if (options && options.container) {
			// insert app into dom
			
			var _appContainerElement = document.querySelector(options.container); 
			if (_appContainerElement==null) {
				_appContainerElement = document.getElementsByTagName('body')[0];  // defaults to <body>
			} 
			var appBody 		= document.createElement("div");
			appBody.id 			= this.id;
			appBody.className 	= 'apri-app-body ' + objectId;
			this.appContainer	= appBody;
			_appContainerElement.appendChild(appBody);
		}
		
		apriAjaxBase = new ApriCore.ApriAjaxBase();
		
	}

	
	this.getTemplate = function(templateName, params, options, callback, context) {
//		apriAjaxBase.request('http://localhost:3000'+params.urlSystemRoot+'/'+params.app+'/template/' + templateName,{},{},callback, context);
		if (params.appPath == undefined) params.appPath=''; 
		apriAjaxBase.request(params.urlSystemRoot+'/'+ params.appPath +params.app+'/template/' + templateName,{},{},callback, context);
	};
	
	
});
// ApriAppBase Class end ===============================================================================
