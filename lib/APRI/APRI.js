/*
	The MIT License (MIT)

	Copyright (c) 2015+ Scapeler

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global APRI*/
/** 
 * The APRI framework manages all the global actions like loading of classes, modules (js, css) and cares about dependencies.
 *  Also creates instances/objects of loaded classes and is the place for central info and methods.
 * @framework APRI
 */ 

"use strict"; // This is for your code to comply with the ECMAScript 5 standard.


// create bind function if current browser version does not support it. Standard as of ECMA-262.
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}

if (!Date.prototype.toISOString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };

  }());
}

if (!Math.fround) {
    Math.fround = (function() {
		if (Float32Array) {	
      		var temp = new Float32Array(1);
      		return 
				function fround(x) {
        			temp[0] = +x;
        			return temp[0];
      			}
		} else return Math.round;		
    })();
}
/* example: fround and float 32bit precision for performance reasons
var f32 = new Float32Array(1000);
  for(var i = 0; i < 999; ++i)
    f32[i] = Math.fround(f32[i] + f32[i+1]) + 1;
*/


/*
	ExtendJS 0.2.2
	More info at http://extendjs.org

	Copyright (c) 2013+ ChrisBenjaminsen.com

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
(function(global){
    "use strict";
	//Helper method for creating an super copied object clone
	function initialize(method){
		//Recursivly execute parent methods.
		if(method.parent instanceof Function){
			initialize.apply(this,[method.parent]);
			this.super = cloneCopy(this,
				superCopy(this,this.constructor)
			);
		}
		method.apply(this, arguments);
	}

	//Helper method which allows for super referances.
	function cloneCopy(from, to){
		for(var x in from){
			if(x !== "super" && from[x] instanceof Function){
				//Never create circular super referances.
				to[x] = from[x].super || superCopy(from, from[x]);
			}
		}
		return to;
	}

	function superCopy(scope, method){
		var scopeSuper = scope.super;
		return method.super = function(){
			scope.super = scopeSuper;
			return method.apply(scope, arguments);
		}
	}

	//Create Class object
	global.Class = function(){};
	global.Class.extend = function ext(to){
		function child(){
			//Prevent the prototype scope set executing the constructor.
			if(initialize !== arguments[0]){
				//Create inhereted object
				initialize.apply(this,[to]);
				//Setup scope for class instance method calls
				cloneCopy(this,this);
				if(this.initializer instanceof Function)
					this.initializer.apply(this);
				this.constructor.apply(this,arguments);
			}
		}

		//Set prototype and constructor enabeling propper type checking.
		child.prototype = new this(initialize);
		child.prototype.constructor = child;

		//Return expected result from toString
		child.toString = function(){
			return to.toString()
		}

		//Allow the child to be extended.
		child.extend = function(target){
			//Create parent referance and inherentence path.
			target.parent = to;
			return ext.apply(child,arguments);
		}
	
		return child
	}
	//Bootstrap Class by inheriting itself with empty constructor.
	global.Class = global.Class.extend(function() {
        this.constructor=function(){}
    });
})(this);


/*
	ApriJS 0.1.0
	More info at http://scapeler.com

	Copyright (c) 2013+ Scapeler.com

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

// create Apri class structure
window.Apri_Classes 		= {};
window.Apri_Classes.core 	= {};
window.Apri_Classes.apps 	= {};
window.Apri_Classes.module 	= {};
window.Apri_Instances 		= {};
window.Apri_Instances.apps	= {};
window.ApriCore				= Apri_Classes.core;
window.ApriApps				= Apri_Classes.apps;		
window.ApriModule			= Apri_Classes.module;	

(function(global){

    "use strict";// function to create ApriBase class after extend is loaded

	ApriCore.ApriBase = ApriCore.ApriBase || Class.extend(function(){

		var _urlPath 		= global.location.pathname;
		var _urlPathNames	= _urlPath.split('/');
		var _documentHead 	= document.getElementsByTagName('head')[0];
		
		var bodyElement;
		var clientInfo 			= {};
		var instances			= {};
		var newInstanceIndex 	= 0;
		var config		= {
			  urlSystemCode	: 'default'
			, urlSystemRoot	: 'default'
			, urlTheme		: 'default'
			, libPath		: '/apri/lib'
		};

		//initializer is executed before the constructor.
    	this.initializer = function(){
    	};
	
		this.constructor = function() {
			//Execute the constructor of the class we extended.
        	this.super();
		
  			// Initialize our APRI-specific attributes
			var _urlPathNames;
//				_urlPath,

			// set clientinfo
			clientInfo.language 		= navigator.language;
			clientInfo.appCodeName 		= navigator.appCodeName;
			clientInfo.appName 			= navigator.appName;
			clientInfo.appVersion 		= navigator.appVersion;
			clientInfo.cookieEnabled 	= navigator.cookieEnabled;	
			if ("geolocation" in navigator) {
  				/* geolocation is available */
					clientInfo.geolocationEabled = true
			} else {
  				/* geolocation IS NOT available */
					clientInfo.geolocationEabled = false
			}

			var config = this.getConfig();	
			// get theme and skin from url path (optional) else 'default'
			  //_urlPath 					= window.location.pathname;
			  //_urlPathNames				= _urlPath.split('/');
			_urlPathNames				= window.location.pathname.split('/');
			config.urlSystemCode		= _urlPathNames[1]||'default';  	// eg. TSCAP-550
			config.urlSystemRoot		= "/" + config.urlSystemCode;  		// eg. /TSCAP-550
			config.urlTheme				= _urlPathNames[4]||'default';
			config.urlSkin				= _urlPathNames[5]||'default';

			if ( ApriCore.ApriController != undefined) { // if grunted (concat/uglify) then class is allready available
				onloadApriControllerJs();
			} else {
				loadScript(config.urlSystemRoot + config.libPath + '/APRI/APRI-controller.js', onloadApriControllerJs);
			}
		}

		var onloadApriControllerJs = function (e) {
			// get start app. eg. <body apri="apri-leaflet">  => apri/lib/apri-leaflet.js
			bodyElement = document.getElementsByTagName('body')[0];
			
			// wait until body element is in dom
			if (bodyElement == undefined) { 
				return void setTimeout(onloadApriControllerJs, 1, e);
			}
						
			// set width and height of body element on window values, style AND attribute. Adjust on resize.
			var resizeBody = function() {
				bodyElement.style.height 	= window.innerHeight + 'px';
        		bodyElement.style.width 	= window.innerWidth + 'px';
				bodyElement.setAttribute('height', bodyElement.style.height);
				bodyElement.setAttribute('width', bodyElement.style.width);
				// fire apriResize event for internal actions
				if ( window.ActiveXObject != undefined ) { 
					//iexplorer
					var _alert = 'test';
				} else {
					var event = new Event('apriResize');
					document.dispatchEvent(event);
				}
			}
			resizeBody();
			window.addEventListener("resize", resizeBody);
			
			var appId   				= bodyElement.getAttribute("apri");
			var appContainerSelector 	= bodyElement.getAttribute("apri-container")||'body';
			window.apriController 		= new ApriCore.ApriController;
			if (appId.substring(0,6)=='start-') {
				// todo: change old 'start-'-apps into direct start of app
				APRI.UTIL.loader (appId, {});
			} else { // new version
				apriController.activateApp(appId, {container:appContainerSelector });
			}
		};

		var loadScript = function(scriptSrc, callback) {
			var _scriptNode		= document.createElement('script');
			_scriptNode.onload = onloadApriControllerJs;
			_scriptNode.type 	= 'text/javascript';
			_scriptNode.async = true;
			_scriptNode.src 	= scriptSrc;
			_documentHead.appendChild(_scriptNode);
		}
		
/* todo: introduce or remove
		var createInstance	= function(className, options) {
			var _class;
			_class = apriClasses.classname || apriClasses.classname.core;
			if (_class == undefined) {
				alert ('Classname ' + className + ' could not be initiated');
			} else {
				var _newInstance 			= Object.create(className, options);
				_newInstance.apri_zIndexes 	= _newInstance.zIndexes = _newInstance.zIndexes || {};
				newInstanceIndex++;
				apriInstances[newInstanceIndex]	= _newInstance;
			}
		};
*/

		// public methode to get client/browser info
		this.getClientInfo = function() {
			return clientInfo;
		}

		// public methode to get Apri config info
		this.getConfig = function() {
			return config;
		}
	
	});  // end of ApriCore.ApriBase def

})(this);





/*
	ApriJS 0.1.0
	More info at http://scapeler.com

	Copyright (c) 2013+ Scapeler.com

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/// ApriAjax class def ===============================================================================
var ApriAjax = ApriCore.ApriAjax = ApriCore.ApriAjax || function (config) {
	
  	// Initialize our ApriAjax-specific properties
	var _config		= this.config	= config; 
	var _url 		= this.url 		= _config.url;
	var _method		= this.method	= _config.method || 'GET';  //defaults to GET
	var _query		= this.query 	= _config.query || "";
	var _callback	= this.callback = _config.callback;
	var _context	= this.context 	= _config.context;
	var _timeout	= this.timeout 	= _config.timeout || 10000;  // defaults to 10s (only async requests with an owning window)

	this.xmlhttp	= new XMLHttpRequest();
	
	//APRI.clientInfo
	
	var onreadystatechange = this.xmlhttp.onreadystatechange = function() {
  		if (this.readyState==4 && this.status==200) {
			try {
				var responseDataJson =JSON.parse(this.responseText);
				var _test = this.response;
				_callback(responseDataJson, _context, null);
			}
			catch(error) {
				alert ('Error parsing responseText http call ApriAjax (' + _url + ')');
				_callback(this.responseText, _context, error);
			}
		}
	}
	var ontimeout = this.xmlhttp.ontimeout = function(e) {
	
		// readyState:
		// 0	UNSENT	open()has not been called yet.
		// 1	OPENED	send()has not been called yet.
		// 2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
		// 3	LOADING	Downloading; responseText holds partial data.
		// 4	DONE	The operation is complete.
  		//if (this.readyState==4 && this.status==200) {
			alert ('Time out occured when retrieving data (' + _url + '). Readystate was: ' + e.readyState);
		//	}
		//}
	}

	this.xmlhttp.open(_method, _url+'?query='+_query,true);
	this.xmlhttp.send();
}
//// Create a class.prototype object that inherits from parent class.prototype.
//// The correct place to call class is above, where we call it from the class.
////ApriAjax.prototype = Object.create(XMLHttpRequest.prototype);
// Set the "constructor" property to refer to ApriPanel
ApriAjax.prototype.constructor = ApriAjax;


// ApriAjax Class end ===============================================================================

/*
	ApriJS 0.1.0
	More info at http://scapeler.com

	Copyright (c) 2013+ Scapeler.com

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
// ApriAjax class def ===============================================================================
var ApriAjaxDataView = ApriCore.ApriAjaxDataView = ApriCore.ApriAjaxDataView || function (config) {
	
  	// Initialize our ApriAjax-specific properties
	var _config			= this.config			= config;
	var _url 			= this.url 				= _config.url;
	var _method			= this.method			= _config.method 	|| 'POST';  //defaults to POST
	var _query			= this.query 			= _config.query 	|| "";
	var _data			= this.data 			= _config.data 		|| "";
	var _templates		= this.templates 		= _config.templates || [];
	var _callback		= this.callback 		= _config.callback;
	var _context		= this.context 			= _config.context;
	var _viewContainerId	= this.viewContainerId 	= _config.viewContainerId;
	var _timeout		= this.timeout 			= _config.timeout 	|| 10000;  // defaults to 10s (only async requests with an owning window)

	this.xmlhttp	= new XMLHttpRequest();	
	
	//APRI.clientInfo
	
	var onreadystatechange = this.xmlhttp.onreadystatechange = function() {
  		if (this.readyState==4 && this.status==200) {
			try {
				var responseDataJson =JSON.parse(this.response);
			}
			catch(error) {
				alert ('Error parsing responseText http call ApriAjax (' + _url + ')');
				_callback(this.responseText, _context, error);
				return;
			}
			_callback(responseDataJson, _context);
		}
	}
	var ontimeout = this.xmlhttp.ontimeout = function(e) {
	
		// readyState:
		// 0	UNSENT	open()has not been called yet.
		// 1	OPENED	send()has not been called yet.
		// 2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
		// 3	LOADING	Downloading; responseText holds partial data.
		// 4	DONE	The operation is complete.
  		//if (this.readyState==4 && this.status==200) {
			alert ('Time out occured when retrieving data (' + _url + '). Readystate was: ' + e.readyState);
		//	}
		//}
	}
	
	var requestParameters 			= {};
	requestParameters.clientInfo 	= APRI.getClientInfo();
	requestParameters.config 		= APRI.getConfig();
	requestParameters.query 		= _query;
	requestParameters.data 			= _data;
	requestParameters.templates		= _templates;
	requestParameters.viewContainerId = _viewContainerId;

	this.xmlhttp.open(_method, _url+'?query='+_query,true);
	this.xmlhttp.send(JSON.stringify(requestParameters));
}
//// Create a class.prototype object that inherits from parent class.prototype.
//// The correct place to call class is above, where we call it from the class.
////ApriAjax.prototype = Object.create(XMLHttpRequest.prototype);
// Set the "constructor" property to refer to ApriPanel
ApriAjaxDataView.prototype.constructor = ApriAjaxDataView;


// ApriAjax Class end ===============================================================================





