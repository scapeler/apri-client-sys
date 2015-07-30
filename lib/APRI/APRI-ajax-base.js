/*
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

/*global ApriAjaxBase*/
/** 
 * ApriAjaxBase is a base class for creating instances which make use of the D3js library.
 * @framework ApriAjaxBase
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.

// ApriAjaxBase class def ===============================================================================
var ApriAjaxBase = ApriCore.ApriAjaxBase = ApriCore.ApriAjaxBase || Class.extend(function () {
	
	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function() {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriAjaxBase');
//		requestParameters 				= {};
//		requestParameters.clientInfo 	= APRI.getClientInfo();
//		requestParameters.config 		= APRI.getConfig();

		this.xmlhttp	= new XMLHttpRequest();
		this.xmlhttp.onreadystatechange = onreadystatechange;
		this.xmlhttp.ontimeout 			= ontimeout;
	}
		
	var _callback, _context;
	
	
	this.xmlhttp;
	
	var onreadystatechange = function() {
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

	var ontimeout = function(e) {
	
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
	
	this.request = function(url, params, options, callback, context) {
		_callback 	= callback;
		_context 	= context;
		var _url 	= url;
		var _params = JSON.stringify(params);
		this.xmlhttp.open(options.method || 'GET', url, true);
		this.xmlhttp.send(_params);
	}
	
});

// ApriAjaxBase Class end ===============================================================================



