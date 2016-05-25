/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global YUI*/ 
/** 
 * The APRI-loader module manages the loading of modules and css and cares about dependencies. 
 * @module APRI-loader 
 */ 

var ApriController = window.ApriCore.ApriController = window.ApriCore.ApriController || Class.extend(function(){

	// Call the parent constructor, making sure (using Function#call) that "this" is
	// set correctly during the call
	//Class.call(this);
	this.constructor = function() {
	};

	// Public methode to start loading of an object and its dependencies
	//
	this.loadObject = function(objectId, options, callback) {
		console.log('ApriController: start loading object ' + objectId);
		apri.loader(objectId, options , callback )
	};

	// Public methode to start loading of an object and its dependencies
	//
	// options = target, params, initiator
	this.activateApp = function(appId, options) {
		console.log('ApriController: activate app ' + appId);
		this.loadObject( appId, options, _activateApp );
		return;
	};

	var _activateApp = function(appId, options) {
		console.log('Start initializing app: ' + appId );
		if (options && options.className && options.classGroup) {
			//console.log('Create object from Class: ' + options.classGroup + '.' + options.className);
			
			// create app instance from classGroup.className. App puts itself into Apri_Instances.apps[this.id], a kind of app stack
			new window[options.classGroup][options.className](appId, options);
		}		
	}




// Create a ApriUtilsDate.prototype object that inherits from ApriApp.prototype.
// The correct place to call ApriApp is above, where we call it from ApriPanel.
//ApriController.prototype = Object.create(Class.prototype); // See note below

// Set the "constructor" property to refer to ApriController
//ApriController.prototype.constructor = ApriController;



// Public methode to start loading of an object and its dependencies
//
// options = target, params, initiator
//ApriController.prototype.activateApp = function(appId, options) {
//	console.log('ApriController: activate app ' + appId);
//	this.loadObject( appId, options, _activateApp );
//	return;
//};


// todo: clean up all below.

//var APRI1 = (function () {

//	var AP = window.APRI;

	var apri = APRI.UTIL = APRI.UTIL || {};
	var apri_zIndexes = APRI.zIndexes = APRI.zIndexes || {};
//	var apriUrlPathname = window.location.pathname;
//	var apriUrlArray	= apriUrlPathname.split('/');
//	var apriUrlTheme	= apriUrlArray[4];
//	var apriUrlSkin		= apriUrlArray[5];



	// show boot screen only first start main app
	var apriStartScreen = document.getElementById('apri-startup-screen');
	if (apriStartScreen && apriStartScreen.className == "init") {
		apriStartScreen.style.visibility = 'visible';
		apriStartScreen.style.display = ''; //inline-block';
		apriStartScreen.className = "show";
		var apriAppsBody = document.getElementById('apri-apps-body');
		apriAppsBody.className = "hide";
		apriAppsBody.style.opacity = 0;
	}
		
				
//	var apri_logo_svg = APRI.logo_svg = '<g><rect x="0" y="0" width="486px" height="64px" style="fill:rgb(255,255,255); fill-opacity:0.7; stroke:black; stroke-opacity:0.2; stroke-width:1;"></rect><g Transform="translate(7,7)" ><g transform="scale(0.5)"><circle cx="45.5" cy="50" r="40" stroke="rgb(14,205,157)" stroke-width="11" fill-opacity="0"></circle><line x1="0.5" y1="50" x2="90.5" y2="50" stroke="rgb(14,205,157)" stroke-width="11"></line><line x1="45.5" y1="5" x2="45.5" y2="95" stroke="rgb(14,205,157)" stroke-width="11"></line></g><text x="56" y="48" style="font-family:sans-serif; letter-spacing:8px; fill: #999999; stroke: #888888;  font-size: 62px;">LAND</text><text x="250" y="48" style=" font-family:sans-serif; letter-spacing:4px; fill: none; stroke-width:1px; stroke: rgb(14,205,157);  font-size: 62px;">SCAPE</text></g></g>';

    var apriApps = {
        'start-apri-main': {
              'waitFor' : ['YUI']
            , 'require' : [
                  {'id':'YUI'}
           //     , {'id':'jQuery'}
                , {'id':'Leaflet'}
                , {'id':'proj4-compressed'}
                , {'id':'proj4leaflet'}
                , {'id':'leaflet.markercluster'}
                , {'id':'topojson.v1'}
                , {'id':'moment'}
            ]
            , 'src': '/client/apri-client-sys/lib/start-apri-main.js'
            , 'sleep' : 1
          }
        , 'apri-client-openiod': {
              'waitFor' : ['APRI-app-base']
            , 'require' : [
                  {'id':'APRI-app-base'}
				, {'id':'ApriAjaxBase'}
                , {'id':'moment'}
				, {'id':'handlebars'}  // not runtime because of missing compile function
				, {'id':'api-ui.css'}
            ]
			, 'className': 'ApriAppIod'	
			, 'classGroup': 'ApriApps'	
			, 'src': '/client/apri-client-openiod/lib/api-ui/api-ui.js'
            , 'sleep' : 1
		}
        , 'apri-client-scapeler': {
              'waitFor' : ['APRI-app-base']
            , 'require' : [
                  {'id':'APRI-app-base'}
				, {'id':'ApriAjaxBase'}
               // , {'id':'impress'}
               // , {'id':'moment'}
			//	, {'id':'handlebars'}  // not runtime because of missing compile function
				, {'id':'scapeler-main.css'}
            ]
			, 'className': 'ApriAppScapeler'	
			, 'classGroup': 'ApriApps'	
			, 'src': '/client/apri-client-scapeler/lib/scapeler/scapeler.js'
            , 'sleep' : 1
		}
        , 'apri-client-leaflet': {
              'waitFor' : ['APRI-app-base','d3','ApriAjaxBase','Leaflet'] //'ApriLeafLetCtrlBase',,'ApriLeafLetCtrlInfoCtrl'
            , 'require' : [
				 {'id':'Leaflet'}
				, {'id':'ApriLeafLetCtrlInfoCtrl'}
                , {'id':'APRI-app-base'}
				, {'id':'ApriAjaxBase'}
				, {'id':'d3'}
                , {'id':'proj4-compressed'}
                , {'id':'proj4leaflet'}
				, {'id':'ApriD3Base'}
				, {'id':'ApriD3Legend'}
				, {'id':'ApriLeafLetBase'}
				, {'id':'ApriLeafLetCtrlBase'}
				, {'id':'ApriLeafLetLayerBase'}	
				, {'id':'ApriCookieBase'}	
				, {'id':'moment'}
				, {'id':'handlebars'}  // not runtime because of missing compile function
				, {'id':'leaflet.awesome-markers'}
				, {'id':'APRI-d3-legend.css'}
				, {'id':'APRI-leaflet-base.css'}
				, {'id':'leaflet.awesome-markers.css'}
				, {'id':'font-awesome-4.5.0.css'}
				, {'id':'leaflet-main.css'}
				//, {'id':'leaflet-GPX'}
            ]
			, 'className': 'ApriAppLeaflet'	
			, 'classGroup': 'ApriApps'	
			, 'src': '/client/apri-client-leaflet/lib/leaflet/leaflet.js'
            , 'sleep' : 1
		}
		,  'apri-client-aireas-stats': {
              'waitFor' : [
			      'APRI-app-base'
				// , 'd3'
				// , 'ApriD3Base'
				// , 'ApriD3Graphic'
				//, 'Leaflet'
				]
           	, 'require' : [
                  {'id':'APRI-init.css'}
                , {'id':'APRI-app-base'}
				, {'id':'ApriAjaxBase'}
				, {'id':'sessionstorage'}
				, {'id':'handlebars'}  // not runtime because of missing compile function
				, {'id':'d3'}
				, {'id':'ApriD3Base'}
				, {'id':'ApriD3GraphicDouble'}
				, {'id':'ApriD3GraphicTrend'}
				, {'id':'ApriD3GraphicGroupedHorBar'}
				, {'id':'APRI-d3-graphic-double.css'}
				, {'id':'APRI-d3-graphic-trend.css'}
				, {'id':'APRI-d3-graphic-groupedhorbar.css'}
				, {'id':'aireas-stats.css'}
			]
			, 'className': 'ApriAppAireasStats'	
			, 'classGroup': 'ApriApps'	
			, 'src': '/client/apri-client-aireas/lib/aireas-stats/aireas-stats.js'
            , 'sleep' : 1
		}		
		,  'apri-client-human-sensor': {
              'waitFor' : [
			      'APRI-app-base','socketio'
				// , 'd3'
				// , 'ApriD3Base'
				// , 'ApriD3Graphic'
				//, 'Leaflet'
				]
           	, 'require' : [
                  {'id':'APRI-init.css'}
                , {'id':'APRI-app-base'}
				, {'id':'ApriAjaxBase'}
				, {'id':'socketio'}
				, {'id':'sessionstorage'}
				, {'id':'handlebars'}  // not runtime because of missing compile function
				, {'id':'ApriCookieBase'}	
//				, {'id':'spin'}	
//				, {'id':'leaflet-spin'}	
//				, {'id':'Leaflet'}
//              , {'id':'proj4-compressed'}
//              , {'id':'proj4leaflet'}
//				, {'id':'ApriLeafLetBase'}
//				, {'id':'APRI-leaflet-base.css'}
//				, {'id':'ApriLeafLetCtrlBase'}
//				, {'id':'ApriLeafLetLayerBase'}										
//				, {'id':'d3'}
//				, {'id':'ApriD3Base'}
//				, {'id':'ApriD3GraphicDouble'}
//				, {'id':'ApriD3GraphicTrend'}
//				, {'id':'ApriD3GraphicGroupedHorBar'}
//				, {'id':'APRI-d3-graphic-double.css'}
//				, {'id':'APRI-d3-graphic-trend.css'}
//				, {'id':'APRI-d3-graphic-groupedhorbar.css'}
				, {'id':'human-sensor.css'}
			]
			, 'className': 'ApriAppHumanSensor'	
			, 'classGroup': 'ApriApps'	
			, 'src': '/client/apri-client-human-sensor/lib/human-sensor/human-sensor.js'
            , 'sleep' : 1
		}	
        , 'apri-client-human-sensor-d3': { 
			  'type': 'group'
            , 'waitFor' : [
			      'd3','ApriD3Base','ApriD3GraphicTrend' 
				]
			, 'require' : [
				  {'id':'d3'}
				, {'id':'ApriD3Base'}
			//	, {'id':'ApriD3GraphicDouble'}
				, {'id':'ApriD3GraphicTrend'}
			//	, {'id':'ApriD3GraphicGroupedHorBar'}
			//	, {'id':'APRI-d3-graphic-double.css'}
				, {'id':'APRI-d3-graphic-trend.css'}
			//	, {'id':'APRI-d3-graphic-groupedhorbar.css'}
			]
		} 
				
		,  'apri-client-aireas': {
              'waitFor' : [
			      'APRI-app-base'
				// , 'd3'
				// , 'ApriD3Base'
				// , 'ApriD3Graphic'
				//, 'Leaflet'
				]
           	, 'require' : [
                  {'id':'APRI-init.css'}
                , {'id':'APRI-app-base'}
				, {'id':'ApriAjaxBase'}
				, {'id':'sessionstorage'}

				, {'id':'d3'}
//				, {'id':'CookieWarning'}
				, {'id':'Leaflet'}	
				, {'id':'handlebars'}
                , {'id':'proj4-compressed'}
                , {'id':'proj4leaflet'}
				, {'id':'ApriCookieBase'}
				, {'id':'ApriLeafLetBase'}
				, {'id':'ApriD3Base'}
				, {'id':'ApriLeafLetCtrlBase'}
				, {'id':'ApriLeafLetLayerBase'}				
                , {'id':'leaflet.css'}
				, {'id':'APRI-leaflet-base.css'}
				, {'id':'ApriTreeBase'}
				, {'id':'ApriD3Gauge'}
				, {'id':'ApriD3Menu'}
//				, {'id':'ApriVideoChat'}
//				, {'id':'ApriD3Graphic'}
				, {'id':'ApriD3GraphicDouble'}
				, {'id':'ApriD3GraphicTrend'}
				, {'id':'ApriD3GraphicGroupedHorBar'}
//				, {'id':'APRI-d3-graphic.css'}
				, {'id':'APRI-d3-graphic-double.css'}
				, {'id':'APRI-d3-graphic-trend.css'}
				, {'id':'APRI-d3-graphic-groupedhorbar.css'}
				, {'id':'APRI-d3-gauge.css'}
				, {'id':'APRI-d3-menu.css'}
//                , {'id':'ApriD3Logo'}
                , {'id':'Leaflet.heat'}				

  //              , {'id':'three'}
              //  , {'id':'tween'}
              //  , {'id':'CSS3DRenderer'}
              //  , {'id':'TrackballControls'}
				, {'id':'apri-leafletctrl-timeslider'}
				, {'id':'apri-leafletctrl-timeslider.css'}
				, {'id':'apri-leafletctrl-popupinfo'}
				, {'id':'apri-leafletctrl-popupinfo.css'}
				, {'id':'leaflet-sidebar-v2'} 
			//	, {'id':'leaflet-sidebar-v2-base.scss'} 
			//	, {'id':'leaflet-sidebar-v2.scss'} 
				, {'id':'leaflet-sidebar-v2.css'} 
				, {'id':'ApriD3Legend'}
				, {'id':'APRI-d3-legend.css'}
//				, {'id':'ApriD3Spider'}
//				, {'id':'APRI-d3-spider.css'}
	//			, {'id':'ApriThreeBase'}
	//			, {'id':'APRI-three-base.css'}
//				, {'id':'apri-webgl-utils'}
//				, {'id':'webgl-sylvester'}
//				, {'id':'ApriWebGlBase'}
//				, {'id':'APRI-webgl-base.css'}
                , {'id':'moment'}
				, {'id':'font-awesome-4.5.0.css'}
				, {'id':'leaflet.awesome-markers.css'}
				, {'id':'leaflet.awesome-markers'}
				, {'id':'leaflet-oms'}
	//			, {'id':'APRI-panel'}
				, {'id':'APRI-leafletctrl-base.css'}
	//			, {'id':'jquery.mCustomScrollbar.css'}
				, {'id':'apri-air.css'}
//                , {'id':'NonTiledLayer'}
//                , {'id':'NonTiledLayerWMS'}
//				, {'id':'iso8601'}			
//				, {'id':'timeDimension'}			
            	]
			, 'className': 'ApriAppAir'	
			, 'classGroup': 'ApriApps'	
			, 'src': '/client/apri-client-aireas/lib/aireas/aireas.js'
            , 'sleep' : 1
			}
		,  'apri-stats': {
              'waitFor' : [
			    'APRI-app-base', 'd3', 'ApriD3Base', 'ApriD3Graphic', 'ApriD3ForcedLayout', 'Leaflet']
           	, 'require' : [
                  {'id':'APRI-init.css'}
				, {'id':'d3'}				  
				, {'id':'Leaflet'}				  
                , {'id':'APRI-app-base'}
				, {'id':'ApriD3Base'}
				, {'id':'ApriLeafLetBase'}
				, {'id':'ApriD3Gauge'}
				, {'id':'ApriD3Graphic'}
				, {'id':'ApriD3GraphicDouble'}
				, {'id':'ApriD3ForcedLayout'}
				, {'id':'APRI-d3-graphic.css'}
				, {'id':'APRI-d3-graphic-double.css'}
				, {'id':'APRI-d3-gauge.css'}
				, {'id':'apri-stats.css'}
                , {'id':'leaflet.css'}
				, {'id':'font-awesome-4.5.0.css'}
		//		, {'id':'fontawesome-webfont.woff'}				
            	]
			, 'src': '/client/apri-client-sys/lib/apri-stats/apri-stats.js'
            , 'sleep' : 1
			}

        ,  'start-apri-leaflet': {
              'waitFor' : [ //'angular', 'angular-route'
			   //'ApriCore2',
			    'APRI-app-base', 'YUI', 'proj4leaflet','d3', 'ApriD3Base', 'ApriD3Graphic', 'ApriD3ForcedLayout',]
 //            , 'preLoad' : [
 //                 {'id':'YUI'}
 //               , {'id':'jQuery'}
 //               , {'id':'Leaflet'}
 //           ]
           , 'require' : [
    //              {'id':'angular'}
    //            , {'id':'angular-route'}
                  {'id':'APRI-app-base'}
                , {'id':'ApriD3Base'}
				, {'id':'start-apri-leaflet.css'}
                , {'id':'APRI-init.css'}
                , {'id':'APRI-panel'}
                , {'id':'start-apri-leaflet-YUI-config'}
                , {'id':'YUI'}
				, {'id':'apri-entrydetail'}
                , {'id':'apri-leaflet'}
                , {'id':'apri-events'}
                , {'id':'d3'}
                , {'id':'ApriD3Logo'}
				, {'id':'ApriD3Gauge'}
				, {'id':'ApriD3Graphic'}
				, {'id':'ApriD3GraphicDouble'}
				, {'id':'ApriD3ForcedLayout'}
				, {'id':'APRI-d3-graphic.css'}
				, {'id':'APRI-d3-graphic-double.css'}
				, {'id':'APRI-d3-gauge.css'}

              //  , {'id':'three'}
              //  , {'id':'tween'}
              //  , {'id':'CSS3DRenderer'}
              //  , {'id':'TrackballControls'}
                , {'id':'jQuery'}
                , {'id':'jquery-ui'}
                , {'id':'jquery.mousewheel'}				
                , {'id':'Leaflet'}
                , {'id':'proj4-compressed'}
                , {'id':'proj4leaflet'}
                , {'id':'leaflet.draw'}
                , {'id':'L.Control.ApriSideBar'}
                , {'id':'L.Control.AccountInfo'}
                , {'id':'L.Control.ExplorerInfo'}
                , {'id':'L.Control.RijksInfo'}
                , {'id':'L.Control.NsTreinInfo'}
                , {'id':'L.Control.TripPlannerInfo'}
                , {'id':'L.Control.Sidebar'}
                , {'id':'L.Control.ThemeInfo'}
                , {'id':'L.Control.TimeLineInfo'}
                , {'id':'L.Control.Layers.Minimap'}
                , {'id':'L.Map.Sync'}
                , {'id':'Control.MiniMap'}
                , {'id':'L.Control.Locate'}
                , {'id':'Control.Loading'}
                , {'id':'Control.FullScreen'}
                , {'id':'leaflet.measurecontrol'}   // depends on leaflet.draw
           //     , {'id':'leaflet.draw.Edit.Rectangle'}
                , {'id':'apri-leaflet-styleeditor'}
                , {'id':'apri-leaflet-formeditor'}
                , {'id':'leaflet.ajax'}
                , {'id':'leaflet.contextmenu'}
                , {'id':'leaflet.markercluster'}
                , {'id':'leaflet.plotter'}
                , {'id':'moment'}
			//	, {'id': 'video-js'}  //only for video-player ?
         //       , {'id':'timeline'}
                , {'id':'timeline-storyjs-embed'}
                , {'id':'timeline.css'}
              //  , {'id':'heatmap'}
              //  , {'id':'heatmapLeaflet'}
              //  , {'id':'QuadTree'}
               , {'id':'Leaflet.heat'}  // for L.heatLayer
				
//                , {'id':'heatmap-dev'}
//                , {'id':'heatmapLeaflet-dev'}

				// yui gallery modules
                , {'id':'gallery-formmgr'}
				, {'id':'gallery-popup-calendar'}
				, {'id':'gallery-popup-calendar.css'}
                , {'id':'gallery-accordion'}
                , {'id':'gallery-accordion.css'}

				// apri model modules
                , {'id':'aprimodel-aprisync'}
                , {'id':'aprimodel-entity'}
                , {'id':'aprimodel-entitylist'}
                , {'id':'aprimodel-aprimap'}
                , {'id':'aprimodel-aprimaplist'}

                , {'id':'apri-open-sans-fontfacekit.css'}
                , {'id':'cssbutton.css'}
                , {'id':'cssgrids-min.css'}
                , {'id':'cssbase-min.css'}
                , {'id':'leaflet.css'}
                , {'id':'L.Control.ApriSideBar.css'}
                , {'id':'L.Control.AccountInfo.css'}
                , {'id':'L.Control.ExplorerInfo.css'}
                , {'id':'L.Control.RijksInfo.css'}
                , {'id':'L.Control.NsTreinInfo.css'}
                , {'id':'L.Control.TripPlannerInfo.css'}
                , {'id':'L.Control.TimeLineInfo.css'}
                , {'id':'apri-leaflet-styleeditor.css'}
                , {'id':'leaflet.contextmenu.css'}
                , {'id':'MarkerCluster.Default.css'}
                , {'id':'MarkerCluster.css'}
                , {'id':'leaflet.draw.css'}
                , {'id':'Control.MiniMap.css'}
                , {'id':'L.Control.Locate.css'}
                , {'id':'Control.FullScreen.css'}
                , {'id':'Control.Loading.css'}
                , {'id':'leaflet.measurecontrol.css'}
                , {'id':'control.layers.minimap.css'}
                , {'id':'L.Control.Sidebar.css'}
                , {'id':'L.Control.ThemeInfo.css'}
                , {'id':'leaflet.fusesearch.css'}
                , {'id':'apri-leaflet.css'}
                , {'id':'apri-leaflet-base.css'}
				, {'id':'font-awesome-4.5.0.css'}
			//	, {'id':'fontawesome-webfont.woff'}				

              //  , {'id':'simpleheat'} // only for Leaflet.heat when src instead of dist
            ]
            , 'src': '/client/apri-client-sys/lib/start-apri-leaflet.js'
            , 'sleep' : 1
          }
        ,  'start-apri-leaflet-YUI-config': {
              'src': '/client/apri-client-sys/lib/start-apri-leaflet-YUI-config.js'
           }
        ,  'APRI-app-base': {
                'type': 'js'
              , 'src': '/client/apri-client-sys/lib/APRI/APRI-app-base.js'
           }
        ,  'APRI-panel': {
                'type': 'js'
				, 'require' : [
					 {'id':'APRI-app-base'}
					]
              , 'src': '/client/apri-client-sys/lib/APRI/APRI-panel.js'
           }
		, 'ApriD3Base':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-base.js' }
		, 'ApriAjaxBase':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-ajax-base.js' }
		, 'sessionstorage':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/ext/sessionstorage.min.js' }
		, 'ApriLeafLetBase':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-leaflet-base.js' }
		, 'ApriCookieBase':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-cookie-base.js' }
		, 'ApriLeafLetCtrlBase':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-base.js' }
		, 'ApriLeafLetCtrlInfoCtrl':	{  
			'waitFor' : ['ApriLeafLetCtrlBase'],
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-infoctrl.js' }
		, 'ApriLeafLetLayerBase':	{
			  'type': 'js'
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-leafletlayer-base.js' }
		, 'ApriD3Logo':	{
			  'type': 'js'
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-logo.js' }
		, 'ApriD3Graphic':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic.js' } 
		, 'ApriD3GraphicDouble':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic-double.js' } 
		, 'ApriD3GraphicTrend':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic-trend.js' } 
		, 'ApriD3GraphicGroupedHorBar':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic-groupedhorbar.js' } 
		, 'ApriD3Gauge':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-gauge.js' } 			
		, 'ApriD3Menu':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-menu.js' }
		, 'ApriVideoChat':	{
			  'type': 'js'
            , 'waitFor' : [
			    ]
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-videochat.js' } 	
		, 'ApriTreeBase':	{
			  'type': 'js'
            , 'waitFor' : []
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-tree-base.js' } 			
		, 'ApriD3Legend':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-legend.js' } 			
		, 'ApriD3Spider':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-spider.js' }
		, 'ApriThreeBase':	{
			  'type': 'js'
            , 'waitFor' : [
			    'three']
			, 'require' : ['three']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-three-base.js' }
		, 'apri-webgl-utils':	{
			  'type': 'js'
            , 'waitFor' : ['webgl-sylvester']
			, 'require' : ['webgl-sylvester']
			, 'src': '/client/apri-client-sys/lib/APRI/apri-webgl-utils.js' }
		, 'webgl-sylvester':	{
			  'type': 'js'
            , 'waitFor' : []
			, 'require' : []
			, 'src': '/client/apri-client-sys/lib/APRI/webgl-sylvester.js' }
		, 'ApriWebGlBase':	{
			  'type': 'js'
            , 'waitFor' : ['webgl-sylvester','apri-webgl-utils']
			, 'require' : ['apri-webgl-utils']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-webgl-base.js' }
		, 'ApriD3ForcedLayout':	{
			  'type': 'js'
            , 'waitFor' : [
			    'ApriD3Base']
			, 'require' : ['ApriD3Base']
			, 'src': '/client/apri-client-sys/lib/APRI/APRI-d3-forcedlayout.js' } 
        ,  'APRI-init.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-init.css'
           }
        ,  'start-apri-leaflet.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/start-apri-leaflet.css'
           }
//        ,  'start-apri-stats.css': {
//                'type': 'css'
//              , 'href': '/client/apri-client-sys/lib/start-apri-stats.css'
//           }
        ,  'apri-leaflet-base.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet/apri-leaflet-base.css'
           }
        ,  'APRI-leaflet-base.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-leaflet-base.css'
           }
        ,  'APRI-leafletctrl-base.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-base.css'
           }
        , 'apri-accounts':          {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
		/*			 {'id':'gallery-popup-calendar'}
                	, {'id':'gallery-formmgr'}
                	, {'id':'aprimodel-calevent'}
                	, {'id':'aprimodel-caleventlist'}
                	, {'id':'gallery-accordion'}
		*/			]
              	, 'src': '/client/apri-client-sys/lib/apri-accounts/apri-accounts.js'
			}
        , 'apri-cal':               {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					 {'id':'gallery-popup-calendar'}
                	, {'id':'gallery-formmgr'}
                	, {'id':'aprimodel-calevent'}
                	, {'id':'aprimodel-caleventlist'}
                	, {'id':'gallery-accordion'}
                	, {'id':'apriplug-multivalue-input'}
                	, {'id':'apriplug-multivalue-input.css'}
                	, {'id':'apriwidget-multivalueeditor'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-cal/apri-cal.js'
			}
        , 'apri-cal-todo':          {}
        , 'apri-entity':            {
				'type': 'js'
				, 'waitFor' : ['YUI']
              , 'src': '/client/apri-client-sys/lib/apri-entity/apri-entity.js'
			}
        , 'apri-entry':             {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					 {'id':'apri-soundmanager-player'}
                	, {'id':'aprimodel-aprientry'}
					, {'id':'aprimodel-aprientrylist'}
					, {'id':'aprientry-product'}
					, {'id':'aprientry-project'}
					, {'id':'apri-tabview'}
					]
              , 'src': '/client/apri-client-sys/lib/apri-entry/apri-entry.js'
			}
        , 'aprientry-product':             {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
           //     	 {'id':'aprimodel-aprientry'}
			//		, {'id':'aprimodel-aprientrylist'}
			//		, {'id':'aprientry-product'}
			//		, {'id':'aprientry-project'}
					]
              , 'src': '/client/apri-client-sys/lib/aprientry-product/aprientry-product.js'
			}
        , 'aprientry-project':             {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
           //     	 {'id':'aprimodel-aprientry'}
			//		, {'id':'aprimodel-aprientrylist'}
			//		, {'id':'aprientry-product'}
			//		, {'id':'aprientry-project'}
					]
              , 'src': '/client/apri-client-sys/lib/aprientry-project/aprientry-project.js'
			}
        , 'apri-events':            {
                'type': 'js'
				, 'waitFor' : ['YUI']
              , 'src': '/client/apri-client-sys/lib/apri-events/apri-events.js'
			}
        , 'apri-entrydetail':       {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
//					 {'id':'gallery-popup-calendar'}
                	 {'id':'gallery-formmgr'}
                	, {'id':'aprimodel-aprientry'}
//                	, {'id':'gallery-accordion'}
                	, {'id':'apri-entrydetail.css'}
					]
              , 'src': '/client/apri-client-sys/lib/apri-entrydetail/apri-entrydetail.js'
			}
        , 'apri-grid':              {}
        , 'apri-growl':             {}
        , 'apri-journalentry':      {}
        , 'apri-journalentry-info': {}
        , 'apri-d3calendarview':    {}
        , 'apri-d3swimlane':        {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id':'apri-d3swimlane.css'}
		//			 {'id':'gallery-popup-calendar'}
        //        	, {'id':'gallery-formmgr'}
                	, {'id':'aprimodel-calevent'}
                	, {'id':'aprimodel-caleventlist'}
                	, {'id':'aprimodel-caltodo'}
                	, {'id':'aprimodel-caltodolist'}
        //        	, {'id':'gallery-accordion'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-d3swimlane/apri-d3swimlane.js'
			}
        , 'apri-ldgr-entry':        {}
        , 'apri-login':             {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id': 'apri-login.css'}
					]
              , 'src': '/client/apri-client-sys/lib/apri-login/apri-login.js'
			}
        , 'apri-main':              {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id': 'apri-main.css'}
					, {'id': 'aprimodel-action'}
					, {'id': 'aprimodel-actionlist'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-main/apri-main.js'
			}
        , 'apri-main-zorg':         {}
        , 'apri-rss':               {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-rss/apri-rss.js'
			}
        , 'apri-tabview':           {
				'type': 'js'
              	, 'src': '/client/apri-client-sys/lib/apri-tabview/apri-tabview.js'
			}
        , 'apri-soundmanager-player':           {
				'type': 'js'
              	, 'src': '/client/apri-client-sys/lib/apri-soundmanager-player/apri-soundmanager-player.js'
			}
        , 'apri-accordion':         {
				'type': 'js'
				, 'require' : [
					{'id': 'apri-accordion.css'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-accordion/apri-accordion.js'
			}
        , 'apri-explorer':          {
				'type': 'js'
				, 'waitFor' : ['apri-sm-treeview-templates', 'apri-sm-treeview']
				, 'require' : [
					{'id': 'apri-sm-treeview'}
					, {'id': 'apri-sm-treeview-templates'}
					, {'id': 'apri-sm-treeview.css'}
					, {'id': 'apri-tree-informationable'}
					, {'id': 'apri-tree-audioplayable'}
					, {'id': 'apri-tree-refreshable'}
					, {'id': 'apri-tree-thumbnailable'}
					, {'id': 'apri-tree-workflowable'}
					, {'id': 'apri-uploader'}
					, {'id': 'apri-uploader-main'}
					, {'id': 'apri-uploader-html5'}
					, {'id': 'apri-uploader-queue'}
					, {'id': 'aprimodel-wfltask'}
					, {'id': 'aprimodel-action'}
					, {'id': 'aprimodel-actionlist'}
				//{'id': 'aprimodel-aprientry'}
				//	,{'id': 'aprimodel-aprientrylist'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-explorer/apri-explorer.js'
			}
		, 'apri-sm-treeview':          {
				'type': 'js'
				, 'require' : [
					{'id': 'apriwidget-workflow'}
                	, {'id':'apri-sm-treeview-templates'}
                	, {'id':'gallery-formmgr'}
					, {'id': 'aprimodel-wfltask'}
				//{'id': 'aprimodel-aprientry'}
				//	,{'id': 'aprimodel-aprientrylist'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-sm-treeview/apri-sm-treeview.js'
			}
		, 'apri-sm-treeview-templates':          {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-sm-treeview-templates/apri-sm-treeview-templates.js'
			}
		, 'apri-tree-informationable':          {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-tree-informationable/apri-tree-informationable.js'
			}
		, 'apri-tree-audioplayable':          {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-tree-audioplayable/apri-tree-audioplayable.js'
			}
		, 'apri-tree-refreshable':          {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-tree-refreshable/apri-tree-refreshable.js'
			}
		, 'apri-tree-thumbnailable':          {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-tree-thumbnailable/apri-tree-thumbnailable.js'
			}
		, 'apri-tree-workflowable':          {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-tree-workflowable/apri-tree-workflowable.js'
			}
        , 'apri-uploader':             {
				'type': 'js'
				, 'require' : [
					{'id': 'apri-uploader-main'}
				//{'id': 'aprimodel-forum'}
					//{'id': 'aprimodel-forumlist'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-uploader/apri-uploader.js'
			} 
        , 'apri-uploader-main':         {
				'type': 'js'
				, 'require' : [
					//{'id': 'apri-uploader-main'}
				//{'id': 'aprimodel-forum'}
					//{'id': 'aprimodel-forumlist'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-uploader-main/apri-uploader-main.js'
			} 
        , 'apri-uploader-html5':         {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-uploader-html5/apri-uploader-html5.js'
			} 
        , 'apri-uploader-queue':         {
				'type': 'js'
				, 'require' : [
					]
              	, 'src': '/client/apri-client-sys/lib/apri-uploader-queue/apri-uploader-queue.js'
			} 
		, 'apri-wfltask':           {
				'type': 'js'
              	, 'src': '/client/apri-client-sys/lib/apri-wfltask/apri-wfltask.js'
			}
        , 'apri-forum':             {
				'type': 'js'
				, 'require' : [//{'id': 'aprimodel-forum'}
					{'id': 'aprimodel-forumlist'}
					, {'id': 'apri-forum.css'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-forum/apri-forum.js'
			}
        , 'apri-search':            {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id': 'aprimodel-search'}
					, {'id': 'aprimodel-searchlist'}
					, {'id': 'apri-search.css'}
					]
				, 'src': '/client/apri-client-sys/lib/apri-search/apri-search.js'
			}
        , 'apri-videochat':         {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					]
				, 'src': '/client/apri-client-sys/lib/apri-videochat/apri-videochat.js'
			}
        , 'apri-videoplayer':       {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id': 'video-js'}
					]
				, 'src': '/client/apri-client-sys/lib/apri-videoplayer/apri-videoplayer.js'
			}
        , 'apri-d3topoview':        {}
        , 'apri-leaflet':           {
                'type': 'js'
				, 'waitFor' : ['YUI']
              , 'src': '/client/apri-client-sys/lib/apri-leaflet/apri-leaflet.js'
 //             , 'src': '/apri/build/apri-leaflet.min.js'
              , 'build': '/apri/build/apri-leaflet.min.js'
			}
//        , 'apri-stats':           {
//                'type': 'js'
//				, 'waitFor' : []
//              , 'src': '/client/apri-client-sys/lib/apri-stats/apri-stats.js'
//              , 'build': '/apri/build/apri-stats.min.js'
//			}
        , 'apri-ocd':             {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id': 'apri-ocd.css'}
					]              
				, 'src': '/client/apri-client-sys/lib/apri-ocd/apri-ocd.js'
			}
        , 'apri-rijks':             {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-rijks'}
					,{'id': 'aprimodel-rijkslist'}
					,{'id': 'apri-rijks.css'}
					]              
				, 'src': '/client/apri-client-sys/lib/apri-rijks/apri-rijks.js'
			}
        , 'apri-rijksdetail':       {angular:true
				, 'src': '/client/apri-client-sys/lib/apri-rijksdetail/apri-rijksdetail.js'
			}
        , 'apri-treinplanner':      {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-treinplanner'}
					,{'id': 'aprimodel-treinplannerlist'}
					,{'id': 'apri-treinplanner.css'}
					]              
				, 'src': '/client/apri-client-sys/lib/apri-treinplanner/apri-treinplanner.js'
			}			
        , 'apri-tripplanner':              {
				'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [
					{'id': 'apri-tripplanner.css'}
					, {'id': 'aprimodel-action'}
					, {'id': 'aprimodel-actionlist'}
					]
              	, 'src': '/client/apri-client-sys/lib/apri-tripplanner/apri-tripplanner.js'
			}
        , 'apriplug-actions-bestemmingsplan':           {
                'type': 'js'
				, 'require' : [
					// {'id': 'aprimodel-aprientry'}
					]
              	, 'src': '/apri/plugins/apriplug-actions-bestemmingsplan/apriplug-actions-bestemmingsplan.js'
			}
        , 'apriplug-actions-poi':           {
                'type': 'js'
				, 'require' : [
					// {'id': 'aprimodel-aprientry'}
					]
              	, 'src': '/apri/plugins/apriplug-actions-poi/apriplug-actions-poi.js'
			}
        , 'apriplug-d3calevents-maingraph':           {
                'type': 'js'
				, 'require' : [
				//{'id': 'aprimodel-aprientry'}
				//	,{'id': 'aprimodel-aprientrylist'}
					]
              	, 'src': '/apri/plugins/apriplug-d3calevents-maingraph/apriplug-d3calevents-maingraph.js'
			}
		, 'apriplug-explorer-accounts':           {
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-account'}
					,{'id': 'aprimodel-accountlist'}
					,{'id': 'aprimodel-accountdetailslist'}
					,{'id': 'aprimodel-accounttotalslist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-accounts/apriplug-explorer-accounts.js'
			}
        , 'apriplug-explorer-apri-entry':           {
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-aprientry'}
					,{'id': 'aprimodel-aprientrylist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-apri-entry/apriplug-explorer-apri-entry.js'
			}
		, 'apriplug-explorer-elasticsearch':           {
                'type': 'js'
				, 'require' : [
					  {'id': 'aprimodel-object'}
					, {'id': 'aprimodel-objectlist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-elasticsearch/apriplug-explorer-elasticsearch.js'
			}
        , 'apriplug-explorer-eolhierarchy':           {
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-eolhierarchy'}
					,{'id': 'aprimodel-eolhierarchylist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-eolhierarchy/apriplug-explorer-eolhierarchy.js'
			}
        , 'apriplug-explorer-gbif':      		{
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-gbif'}
					,{'id': 'aprimodel-gbiflist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-gbif/apriplug-explorer-gbif.js'
			}
		, 'apriplug-explorer-menu':           {
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-object'}
					,{'id': 'aprimodel-objectlist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-menu/apriplug-explorer-menu.js'
			}
		, 'apriplug-explorer-objects':           {
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-object'}
					,{'id': 'aprimodel-objectlist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-objects/apriplug-explorer-objects.js'
			}
        , 'apriplug-explorer-photos':           {
                'type': 'js'
				, 'require' : [{'id': 'aprimodel-photo'}
					,{'id': 'aprimodel-photolist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-photos/apriplug-explorer-photos.js'
			}
        , 'apriplug-explorer-wfltask':      		{
                'type': 'js'
				, 'waitFor' : ['aprimodel-wfltask','aprimodel-wfltasklist']
				, 'require' : [{'id': 'aprimodel-wfltask'}
					,{'id': 'aprimodel-wfltasklist'}
					]
              	, 'src': '/apri/plugins/apriplug-explorer-wfltask/apriplug-explorer-wfltask.js'
			}		
        , 'apriplug-multivalue-input':           {
                'type': 'js'
				, 'require' : [
				//{'id': 'aprimodel-photo'}
				//	,{'id': 'aprimodel-photolist'}
					]
              	, 'src': '/apri/plugins/apriplug-multivalue-input/apriplug-multivalue-input.js'
			}


        , 'apriwidget-multivalueeditor':      		{
                'type': 'js'
				, 'waitFor' : []
				, 'require' : [
				//{'id': 'aprimodel-wfltask'}
				//	, {'id': 'gallery-formmgr'}
					]
              	, 'src': '/apri/widgets/apriwidget-multivalueeditor/apriwidget-multivalueeditor.js'
			}		
        , 'apriwidget-workflow':      		{
                'type': 'js'
				, 'waitFor' : ['aprimodel-wfltask']
				, 'require' : [{'id': 'aprimodel-wfltask'}
					, {'id': 'gallery-formmgr'}
					]
              	, 'src': '/apri/widgets/apriwidget-workflow/apriwidget-workflow.js'
			}		
        , 'socketio':                	{ 'require' : []
											, 'depend' : []
											, 'src': '/client/apri-client-sys/ext/socket.io.min.js' }
        , 'eventsource':                	{ 'require' : []
											, 'depend' : []
											, 'src': '/client/apri-client-sys/ext/yaffle_eventsource.min.js' }
        , 'handlebars':                	{ 'require' : []
											, 'depend' : []
											, 'src': '/client/apri-client-sys/ext/handlebars-v3.0.3.js' }
									//		, 'src': '/client/apri-client-sys/ext/handlebars-v2.0.0.js' }
        , 'handlebars-runtime':                	{ 'require' : []
											, 'depend' : []
//											, 'src': '/client/apri-client-sys/ext/handlebars.runtime-v2.0.0.js' }
											, 'src': '/client/apri-client-sys/ext/handlebars.runtime-v3.0.3.js' }
//        , 'CookieWarning':                	{ 'require' : []
//											, 'depend' : []
//											, 'src': '/client/apri-client-sys/ext/CookieWarning-master/js/cookiewarning3.js' } 

        , 'Leaflet':                	{ 'require' : [
										      {'id':'proj4-compressed'}
                							, {'id':'proj4leaflet'}
											, {'id':'APRI-leaflet-base.css'}
											]
							           //   , 'waitFor' : ['proj4-compressed', 'proj4leaflet']
											, 'depend' : ['L']
											, 'src': '/client/apri-client-sys/ext/leaflet-0.7.5/leaflet.js' } 
//											, 'src': '/client/apri-client-sys/ext/leaflet-1.0.0-rc1/leaflet.js' } 
        , 'proj4-compressed':           { 'require' : ['Leaflet']
											, 'depend' : ['proj4']
											, 'src': '/client/apri-client-sys/ext/Proj4Leaflet-master/lib/proj4-compressed.js' }
        , 'proj4leaflet':               { 'require' : ['proj4-compressed']
										 , 'waitFor' : ['Leaflet','proj4-compressed']
										 , 'depend' : []
										 , 'src': '/client/apri-client-sys/ext/Proj4Leaflet-master/src/proj4leaflet.js' }
        , 'NonTiledLayer':               { 'require' : []
										 , 'waitFor' : ['Leaflet']
										 , 'depend' : []
										 , 'src': '/client/apri-client-sys/ext/Leaflet.NonTiledLayer-master/NonTiledLayer.js' }
        , 'NonTiledLayerWMS':               { 'require' : []
										 , 'waitFor' : ['Leaflet']
										 , 'depend' : []
										 , 'src': '/client/apri-client-sys/ext/Leaflet.NonTiledLayer-master/NonTiledLayer.WMS.js' }
        , 'timeDimension':               { 'require' : ['iso8601']
										 , 'waitFor' : ['Leaflet']
										 , 'depend' : []
										 , 'src': '/client/apri-client-sys/ext/Leaflet.TimeDimension-master/dist/leaflet.timedimension.src.js' }
        , 'iso8601':               { 'require' : []
										 , 'waitFor' : ['Leaflet']
										 , 'depend' : []
										 , 'src': '/client/apri-client-sys/ext/iso8601-js-period-master/iso8601.min.js' }
        , 'leaflet-sidebar-v2':               { 'require' : []
										 , 'waitFor' : ['Leaflet']
										 , 'depend' : []
										 , 'src': '/client/apri-client-sys/ext/sidebar-v2-gh-pages/js/leaflet-sidebar.min.js' }
        , 'apri-leafletctrl-timeslider':      { 'require' : ['d3']
                                            , 'waitFor' : ['d3']
                                            , 'src': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-timeslider.js' }
        , 'apri-leafletctrl-timeslider.css':      { 'require' : []
 			               ,'type': 'css'
                                            , 'waitFor' : []
                                            , 'href': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-timeslider.css' }
        , 'apri-leafletctrl-popupinfo':      { 'require' : ['d3']
                                            , 'waitFor' : ['d3']
                                            , 'src': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-popupinfo.js' }
        , 'apri-leafletctrl-popupinfo.css':      { 'require' : []
 			               ,'type': 'css'
                                            , 'waitFor' : []
                                            , 'href': '/client/apri-client-sys/lib/APRI/APRI-leafletctrl-popupinfo.css' }
        , 'L.Control.ApriSideBar':      { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-aprisidebar/src/L.Control.ApriSideBar.js' }
        , 'L.Control.AccountInfo':      { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-accountinfo/src/L.Control.AccountInfo.js' }
        , 'L.Control.ExplorerInfo':     { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-explorerinfo/src/L.Control.ExplorerInfo.js' }
        , 'L.Control.RijksInfo':        { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-rijksinfo/src/L.Control.RijksInfo.js' }
        , 'L.Control.NsTreinInfo':      { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-nstreininfo/src/L.Control.NsTreinInfo.js' }
        , 'L.Control.TripPlannerInfo':      { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-tripplannerinfo/src/L.Control.TripPlannerInfo.js' }
        , 'L.Control.Sidebar':          { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/leaflet-sidebar-master/src/L.Control.Sidebar.js' }
        , 'L.Control.ThemeInfo':          	{ 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-themeinfo/src/L.Control.ThemeInfo.js' }
        , 'L.Control.TimeLineInfo':     { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-timelineinfo/src/L.Control.TimeLineInfo.js' }
        , 'L.Control.Layers.Minimap':   { 'require' : []
                                            , 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/Leaflet.layerscontrol-minimap-gh-pages/L.Control.Layers.Minimap.js'
										}
        , 'L.Map.Sync':            		{ 'require' : []
                                            , 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/Leaflet.layerscontrol-minimap-gh-pages/lib/L.Map.Sync.js'
										}
        , 'Control.MiniMap':            { 'require' : []
                                            , 'waitFor' : ['Leaflet']
											, 'depend' : ['L.Control.MiniMap']
											, 'src': '/client/apri-client-sys/ext/Leaflet-MiniMap-master/src/Control.MiniMap.js'
										}
        , 'L.Control.Locate':           { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.js' }
        , 'Control.Loading':            { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/Leaflet.loading-master/src/Control.Loading.js' }
        , 'Control.FullScreen':         { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/brunob-leaflet.fullscreen-342abea/Control.FullScreen.js' }
        , 'leaflet-spin':               { 'require' : [
											  {'id':'Leaflet'}
											, {'id':'spin'}
											, {'id':'proj4-compressed'}
                							, {'id':'proj4leaflet'}
											, {'id':'APRI-leaflet-base.css'}]
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/leaflet.spin.js' }
        , 'spin':    		           { 'require' : []
                                            , 'waitFor' : []
                                            , 'src': '/client/apri-client-sys/ext/spin-min.js' }
        , 'leaflet.draw':               { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/Leaflet.draw-master/dist/leaflet.draw-src.js' }
//        , 'leaflet.draw.Edit.Rectangle': { 'require' : []
//                                            , 'waitFor' : ['Leaflet']
//                                            , 'src': '/client/apri-client-sys/ext/Leaflet.draw-master/src/edit/handler/Edit.Rectangle.js' }
        , 'leaflet.measurecontrol':     { 'require' : []
                                            , 'waitFor' : ['Leaflet','leaflet.draw']
											, 'depend' : []
											, 'src': '/client/apri-client-sys/ext/Leaflet.MeasureControl-gh-pages/leaflet.measurecontrol.js'
										}
        , 'apri-leaflet-styleeditor':   { 'require' : [{'id': 'apri-entrydetail'}]
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-styleeditor/src/javascript/apri-leaflet-styleeditor.js' }
        , 'apri-leaflet-formeditor':    { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/lib/apri-leaflet-styleeditor/src/javascript/apri-leaflet-styleforms.js' }
        , 'leaflet.ajax':               { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/leaflet-ajax-master/dist/leaflet.ajax.min.js' }
        , 'leaflet.contextmenu':      	{ 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/Leaflet.contextmenu-master/dist/leaflet.contextmenu.js' }
        , 'leaflet.markercluster':      { 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/Leaflet.markercluster-master/dist/leaflet.markercluster.js' }
        , 'leaflet-oms':      			{ 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/Leaflet-overlappingmarkerspiderfier/oms.min.js' }
        , 'leaflet.plotter':      		{ 'require' : []
                                            , 'waitFor' : ['Leaflet']
                                            , 'src': '/client/apri-client-sys/ext/leaflet-plotter-master/dist/leaflet.plotter.min.js' }
        , 'impress':                  { 'require' : []
											, 'src': '/client/apri-client-sys/ext/impress.js-master/js/impress.js' }
        , 'moment':                     { 'require' : [], 'src': '/client/apri-client-sys/ext/moment.min.js' }
        , 'video-js':                     { 'require' : [], 'src': '/client/apri-client-sys/ext/video-js/video.js' }
   //     , 'timeline':                   { 'require' : [], 'src': '/client/apri-client-sys/lib/TimelineJS-master/build/js/timeline-min.js' } //automaticly loaded by storyjs-embed
        , 'timeline-storyjs-embed':     { 'require' : [], 'src': '/client/apri-client-sys/lib/TimelineJS-master/build/js/storyjs-embed.js' }


        , 'gallery-formmgr': {
                'type': 'js'
				, 'waitFor' : ['YUI']
              , 'src': '/client/apri-client-sys/ext/yui3/yui-gallery/gallery-formmgr/gallery-formmgr-min.js'
           }
        , 'gallery-popup-calendar': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'gallery-popup-calendar.css'}]
              , 'src': '/client/apri-client-sys/ext/gallery-popup-calendar/gallery-popup-calendar.js'
           }
        , 'gallery-accordion': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'gallery-accordion.css'}]
              , 'src': '/client/apri-client-sys/ext/gallery-accordion/gallery-accordion.js'
           }

        , 'aprimodel-action': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-action.js'
           }
        , 'aprimodel-actionlist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-actionlist.js'
           }
        , 'aprimodel-aprisync': {
                'type': 'js'
				, 'waitFor' : ['YUI']
              , 'src': '/apri/models/aprimodel-aprisync.js'
           }
        , 'aprimodel-aprientry': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-aprientry.js'
           }
        , 'aprimodel-aprientrylist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-aprientrylist.js'
           }
        , 'aprimodel-aprimap': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-aprimap.js'
           }
        , 'aprimodel-aprimaplist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-aprimaplist.js'
           }
        , 'aprimodel-calevent': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-calevent.js'
           }
        , 'aprimodel-caleventlist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
				, 'src': '/apri/models/aprimodel-caleventlist.js'
           }
        , 'aprimodel-caltodo': {  //depricated
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-caltodo.js'
           }
        , 'aprimodel-caltodolist': { //depricated
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
				, 'src': '/apri/models/aprimodel-caltodolist.js'
           }
        , 'aprimodel-entity': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-entity.js'
           }
        , 'aprimodel-entitylist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-entitylist.js'
           }
        , 'aprimodel-eolhierarchy': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-eolhierarchy.js'
           }
        , 'aprimodel-eolhierarchylist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-eolhierarchylist.js'
           }
        , 'aprimodel-forum': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-forum.js'
           }
        , 'aprimodel-forumlist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-forumlist.js'
           }
        , 'aprimodel-gbif': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-gbif.js'
           }
        , 'aprimodel-gbiflist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-gbiflist.js'
           }
        , 'aprimodel-object': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-object.js'
           }
        , 'aprimodel-objectlist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-objectlist.js'
           }
        , 'aprimodel-rijks': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-rijks.js'
           }
        , 'aprimodel-rijkslist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-rijkslist.js'
           }
        , 'aprimodel-search': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-search.js'
           }
        , 'aprimodel-searchlist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-searchlist.js'
           }
        , 'aprimodel-treinplanner': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-treinplanner.js'
           }
        , 'aprimodel-treinplannerlist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-treinplannerlist.js'
           }
        , 'aprimodel-wfltask': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-wfltask.js'
           }
        , 'aprimodel-wfltasklist': {
                'type': 'js'
				, 'waitFor' : ['YUI']
				, 'require' : [{'id': 'aprimodel-aprisync'}]
              , 'src': '/apri/models/aprimodel-wfltasklist.js'
           }


        , 'timeline.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/TimelineJS-master/build/css/timeline.css'
           }
//        , 'jquery.mCustomScrollbar.css': {
//                'type': 'css'
//              , 'href': '/client/apri-client-sys/ext/malihu-custom-scrollbar-plugin-master/jquery.mCustomScrollbar.css'
//           }

        , 'gallery-popup-calendar.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/gallery-popup-calendar/assets/skins/sam/gallery-popup-calendar-skin.css'
           }
        , 'gallery-accordion.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/gallery-accordion/assets/skins/sam/gallery-accordion.css'
           }

        , 'apri-open-sans-fontfacekit.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-open-sans-fontfacekit/stylesheet.css'
           }
        , 'cssbutton.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/cssbutton/cssbutton.css'
           }
        , 'cssgrids-min.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/yui3/yui/build/cssgrids/cssgrids-min.css'
           }
        , 'cssbase-min.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/yui3/yui/build/cssbase/cssbase-min.css'
           }

//<link rel="stylesheet" type="text/css" href="/apri/lib/apri-open-sans-fontfacekit/stylesheet.css"/>
//<link rel="stylesheet" type="text/css" href="/apri/lib/cssbutton/cssbutton.css"/>
//<link rel="stylesheet" type="text/css" href="/js/yui3/yui/build/cssgrids/cssgrids-min.css"/>
//<link ref="stylesheet" type="text/css" href="/js/yui3/yui/build/cssbase/cssbase-min.css"/>

        , 'leaflet.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/leaflet-1.0.0-rc1/leaflet.css'
           }
        , 'leaflet-sidebar-v2.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/sidebar-v2-gh-pages/css/leaflet-sidebar.css'

           }
        , 'leaflet-sidebar-v2.scss': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/sidebar-v2-gh-pages/scss/leaflet-sidebar.scss'
           }
        , 'leaflet-sidebar-v2-base.scss': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/sidebar-v2-gh-pages/scss/_base.scss'
           }
		, 'apri-accordion.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-accordion/assets/skins/sam/apri-accordion.css'
           }
        , 'apri-entrydetail.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-entrydetail/apri-entrydetail.css'
           }
        , 'aprientry-product.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/aprientry-product/assets/skins/sam/aprientry-product.css'
           }
        , 'aprientry-project.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/aprientry-project/assets/skins/sam/aprientry-project.css'
           }
        , 'apri-forum.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-forum/assets/skins/sam/apri-forum.css'
           }
        , 'apri-search.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-search/assets/skins/sam/apri-search.css'
           }
        , 'apri-leaflet.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet/assets/skins/sam/apri-leaflet.css'
           }
        , 'api-ui.css': {
                'type': 'css'
              , 'href': '/client/apri-client-openiod/lib/api-ui/api-ui.css'
           }		   
        , 'scapeler-main.css': {
                'type': 'css'
              , 'href': '/client/apri-client-scapeler/lib/scapeler/scapeler-main.css'
           }		   
        , 'leaflet-main.css': {
                'type': 'css'
              , 'href': '/client/apri-client-leaflet/lib/leaflet/leaflet-main.css'
           }
        , 'aireas-stats.css': {
                'type': 'css'
              , 'href': '/client/apri-client-aireas/lib/aireas-stats/aireas-stats.css'
           }
        , 'human-sensor.css': {
                'type': 'css'
              , 'href': '/client/apri-client-human-sensor/lib/human-sensor/human-sensor.css'
//              , 'href': 'http://kevinvanderwiel.com/scapeler/human-sensor.css'
           }
		, 'apri-air.css': {
                'type': 'css'
              , 'href': '/client/apri-client-aireas/lib/aireas/aireas.css'
           }		   
        , 'apri-stats.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-stats/apri-stats.css'
           }		   
        , 'APRI-d3-graphic.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic.css'
           }
        , 'APRI-d3-graphic-double.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic-double.css'
           }
        , 'APRI-d3-graphic-trend.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic-trend.css'
           }
        , 'APRI-d3-graphic-groupedhorbar.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-graphic-groupedhorbar.css'
           }
        , 'APRI-d3-gauge.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-gauge.css'
           }		   		   		   
        , 'APRI-d3-menu.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-menu.css'
           }		   		   		   
        , 'APRI-d3-legend.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-legend.css'
           }		   		   		   
        , 'APRI-d3-spider.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-d3-spider.css'
           }		   		   		   
        , 'APRI-three-base.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-three-base.css'
           }		   		   		   
        , 'APRI-webgl-base.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/APRI/APRI-webgl-base.css'
           }		   		   		   
        , 'apri-login.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-login/assets/skins/sam/apri-login.css'
           }
        , 'apriplug-multivalue-input.css': {
                'type': 'css'
              , 'href': '/apri/plugins/apriplug-multivalue-input/assets/skins/sam/apriplug-multivalue-input.css'
           }
        , 'apri-main.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-main/assets/skins/sam/apri-main.css'
           }
        , 'apri-ocd.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-ocd/assets/skins/sam/apri-ocd.css'
           }
        , 'apri-rijks.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-rijks/assets/skins/sam/apri-rijks.css'
           }
        , 'apri-d3swimlane.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-d3swimlane/assets/skins/sam/apri-d3swimlane.css'
           }
        , 'apri-treinplanner.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-treinplanner/assets/skins/sam/apri-treinplanner.css'
           }
        , 'apri-tripplanner.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-tripplanner/assets/skins/sam/apri-tripplanner.css'
           }
        , 'apri-sm-treeview.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-sm-treeview/assets/skins/sam/apri-sm-treeview.css'
           }

//<link rel="stylesheet" href="/js/leaflet-0.7.2/leaflet.css" />

        , 'L.Control.ApriSideBar.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-aprisidebar/src/L.Control.ApriSideBar.css'
           }
        , 'L.Control.AccountInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-accountinfo/src/L.Control.AccountInfo.css'
           }
        , 'L.Control.ExplorerInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-explorerinfo/src/L.Control.ExplorerInfo.css'
           }
        , 'L.Control.RijksInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-rijksinfo/src/L.Control.RijksInfo.css'
           }
        , 'L.Control.NsTreinInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-nstreininfo/src/L.Control.NsTreinInfo.css'
           }
        , 'L.Control.TripPlannerInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-tripplannerinfo/src/L.Control.TripPlannerInfo.css'
           }
        , 'L.Control.TimeLineInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-timelineinfo/src/L.Control.TimeLineInfo.css'
           }
        , 'L.Control.ThemeInfo.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-themeinfo/src/L.Control.ThemeInfo.css'
           }
        , 'apri-leaflet-styleeditor.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/lib/apri-leaflet-styleeditor/src/css/apri-leaflet-styleeditor.css'
           }
        , 'leaflet.contextmenu.css': {
                  'type': 'css'
				, 'href': '/client/apri-client-sys/ext/Leaflet.contextmenu-master/dist/leaflet.contextmenu.css' 
			}
        , 'MarkerCluster.Default.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet.markercluster-master/dist/MarkerCluster.Default.css'
           }
        , 'MarkerCluster.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet.markercluster-master/dist/MarkerCluster.css'
           }
        , 'leaflet.draw.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet.draw-master/dist/leaflet.draw.css'
           }
        , 'Control.MiniMap.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet-MiniMap-master/src/Control.MiniMap.css'
           }
        , 'L.Control.Locate.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.css'
           }
        , 'Control.FullScreen.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/brunob-leaflet.fullscreen-342abea/Control.FullScreen.css'
           }
        , 'Control.Loading.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet.loading-master/src/Control.Loading.css'
           }
        , 'leaflet.measurecontrol.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet.MeasureControl-gh-pages/leaflet.measurecontrol.css'
           }
        , 'control.layers.minimap.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/Leaflet.layerscontrol-minimap-gh-pages/control.layers.minimap.css'
           }
        , 'L.Control.Sidebar.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/leaflet-sidebar-master/src/L.Control.Sidebar.css'
           }
        , 'leaflet.fusesearch.css': {
                'type': 'css'
              , 'href': '/client/apri-client-sys/ext/leaflet-fusesearch-master/src/leaflet.fusesearch.css'
           }
        , 'font-awesome-4.5.0.css': {
                'type': 'css'
              //, 'href': '/client/apri-client-sys/ext/font-awesome-4.2.0/css/font-awesome.css'
			  , 'href': 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'
           }
        , 'leaflet.awesome-markers.css': {
                'type': 'css'
              //, 'href': '/client/apri-client-sys/ext/font-awesome-4.2.0/css/font-awesome.css'
			  , 'href': '/client/apri-client-sys/ext/Leaflet.awesome-markers-2.0-develop/dist/leaflet.awesome-markers.css'
           }
        , 'leaflet.awesome-markers': {
                'require' : []
              , 'waitFor' : ['Leaflet']
			  , 'src': '/client/apri-client-sys/ext/Leaflet.awesome-markers-2.0-develop/dist/leaflet.awesome-markers.min.js'
           }
//        , 'fontawesome-webfont.woff': {
//                'type': 'css'
//              , 'href': '/client/apri-client-sys/ext/font-awesome-4.2.0/fonts/fontawesome-webfont.woff'
//           }

//<link rel="stylesheet" type="text/css" href="/js/Leaflet.markercluster-master/dist/MarkerCluster.Default.css" />
//<link rel="stylesheet" type="text/css" href="/js/Leaflet.markercluster-master/dist/MarkerCluster.css" />
//<link rel="stylesheet" type="text/css" href="/js/Leaflet.draw-master/dist/leaflet.draw.css" />
//<link rel="stylesheet" type="text/css" href="/js/Leaflet-MiniMap-master/src/Control.MiniMap.css" />
//<link rel="stylesheet" type="text/css" href="/js/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.css" />
//<link rel="stylesheet" type="text/css" href="/js/brunob-leaflet.fullscreen-342abea/Control.FullScreen.css" />
//<link rel="stylesheet" type="text/css" href="/js/Leaflet.loading-master/src/Control.Loading.css" />
//<link rel="stylesheet" type="text/css" href="/js/Leaflet.MeasureControl-gh-pages/leaflet.measurecontrol.css" />
//<link rel="stylesheet" type="text/css" href="/js/Leaflet.layerscontrol-minimap-gh-pages/control.layers.minimap.css" />
//<link rel="stylesheet" type="text/css" href="/js/leaflet-sidebar-master/src/L.Control.Sidebar.css" />
//<link rel="stylesheet" type="text/css" href="/js/leaflet-fusesearch-master/src/leaflet.fusesearch.css" />





        , 'topojson.v1':                { 'require' : [], 'src': '/client/apri-client-sys/ext/d3js.org/topojson.v1.min.js' }  // topojson in D3js
        , 'heatmap-dev':     				{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/heatmap.js-develop/build/heatmap.min.js' }
        , 'heatmapLeaflet-dev':     		{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/heatmap.js-develop/plugins/leaflet-heatmap.js' }
        , 'heatmap':     				{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/heatmap.js-master/src/heatmap.js' }
        , 'heatmapLeaflet':     		{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/heatmap.js-master/src/heatmap-leaflet.js' }
        , 'QuadTree':     				{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/heatmap.js-master/src/QuadTree.js' }
        , 'leaflet-GPX':     				{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/leaflet-gpx-master/gpx.js' }
        , 'Leaflet.heat':     				{ 'require' : []
											, 'waitFor' : ['Leaflet']
											, 'src': '/client/apri-client-sys/ext/Leaflet.heat-gh-pages/dist/leaflet-heat.js' }
//        , 'Leaflet.heat':     				{ 'require' : []
//											, 'waitFor' : ['Leaflet']
//											, 'src': '/client/apri-client-sys/ext/Leaflet.heat-gh-pages/src/HeatLayer.js' }
//        , 'simpleheat':     				{ 'require' : []  //for Leaflet.heat
//											, 'waitFor' : ['Leaflet']
//											, 'src': '/client/apri-client-sys/ext/Leaflet.heat-gh-pages/src/simpleheat.js' }
        , 'YUI':                    	{ 'require' : []
											, 'depend' : ['YUI']
 											, 'src': '/client/apri-client-sys/ext/yui3/yui/build/yui/yui.js' }
		, 'three':                    		{ 'require' : []
											, 'depend' : []
 											, 'src': '/client/apri-client-sys/ext/mrdoob-three.js-ca14c79/build/three.min.js' }
		, 'tween':                    		{ 'require' : []
											, 'waitFor' : ['three']
											, 'depend' : []
 											, 'src': '/client/apri-client-sys/ext/mrdoob-three.js-ca14c79/examples/js/libs/tween.min.js' }
		, 'CSS3DRenderer':        		{ 'require' : []
											, 'waitFor' : ['three']
											, 'depend' : []
 											, 'src': '/client/apri-client-sys/ext/mrdoob-three.js-ca14c79/examples/js/renderers/CSS3DRenderer.js' }
		, 'TrackballControls':        		{ 'require' : []
											, 'waitFor' : ['three']
											, 'depend' : []
 											, 'src': '/client/apri-client-sys/ext/mrdoob-three.js-ca14c79/examples/js/controls/TrackballControls.js' }
		, 'd3':                    		{ 'require' : []
											, 'depend' : ['d3']
 											, 'src': '/client/apri-client-sys/ext/d3/d3.min.js' }
        , 'angular':                    	{ 'require' : []
											, 'depend' : ['angular']
 											, 'src': '/client/apri-client-sys/ext/angular-1.2.16/angular.js' }
        , 'angular-route':              { 'require' : []
											, 'waitFor' : ['angular']
 											, 'src': '/client/apri-client-sys/ext/angular-1.2.16/angular-route.js' }
        , 'jQuery':                    	{ 'require' : [], 'src': 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js' }  // alleen voor 3x $ in apri-leaflet ??
        , 'jquery-ui':              	{ 'require' : []
											, 'waitFor' : ['jQuery']
 											, 'src': '/client/apri-client-sys/ext/jquery-ui-1.11.1.custom/jquery-ui.js' }
        , 'jquery.mousewheel':              { 'require' : []
											, 'waitFor' : ['jQuery']
 											, 'src': '/client/apri-client-sys/ext/jquery-mousewheel-master/jquery.mousewheel.min.js' }
    };



//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// todo ?

/*
/js/fuse/fuse.min.js
/js/leaflet-fusesearch-master/src/leaflet.fusesearch.js
*/


    var defaultSleep = 10; // 10ms

    



    apri.loader = function(id, options, callbackInitiator ) {  // eg. id="start-apri-leaflet"; src="/js/tool/tool.js"
		// param 2 and 3 was src, require
		var tmpRequireArray =[];
		var waitForArrayIndex = 0;
		var waitForArrayDoneIndex = 0;
		
		if (options && apriApps[id] && apriApps[id].className) {
			options.className = apriApps[id].className;
			options.classGroup = apriApps[id].classGroup;
		}
		
//		if (options && options.require == undefined) options.require = null;
		
		
		var initWaitForArray = function(requireArray) {
    	    for (waitForArrayIndex=0;waitForArrayIndex<requireArray.length;waitForArrayIndex++) {
        	    var _appId = requireArray[waitForArrayIndex].id;
				if (apriApps[_appId]) {
					if (apriApps[_appId].loaded == true) {
						console.log('APRI.loader:', _appId, 'already loaded, using cached version.');
						scriptAlreadyLoaded(_appId);
					} else {
       		     		var waitForArray = apriApps[_appId].waitFor || [];
       	   		  		requireArray[waitForArrayIndex].waitFor = waitForArray;
           		 		loadRequire(requireArray[waitForArrayIndex]);
					}
				} else {
					console.warn( 'Configuration problem for depency ' + _appId + ' check APRI-loader config'); 
				}
   	    	}
    	};

		var _loaderSleep = function (millis, callback, require) {
			setTimeout(function() { callback(require); }, millis );
    	}


    	var loadRequire = function (require) {
        	var sleepTime;
        	if (require.waitFor.length > 0) {
            	var appId=require.waitFor[0];
            	if (apriApps[appId].loaded == true) {
                	require.waitFor.shift();
            	};
            	if (require.waitFor.length > 0) {
                	//console.log('Module: ' + require.id + ' is waiting for module: ' +  require.waitFor[0]) ;
                	sleepTime = apriApps[appId].sleep || defaultSleep;
                	apriApps[appId].waitTime = (apriApps[appId].waitTime || 0) + sleepTime;
                	if (apriApps[appId].waitTime >= 30000) {
                    	alert ('Waittime for module ' + appId + ' is ' + apriApps[appId].waitTime + ' ms. Request aborted.' );
                	} else _loaderSleep(sleepTime, loadRequire, require );
            	} else loadScript(require.id, scriptLoaded);
        	} else loadScript(require.id, scriptLoaded);
		}
    
/*
    var loadRequired = function (require) {
        if (require.length > 0) {
            var appId=require[0].id;
            if (apriApps[appId].activated != true) {
                loadScript(appId, callback);
            };
            require.shift();
            if (apriApps[appId].sleep) {
                _loaderSleep(apriApps[appId].sleep, loadRequired, require );
            } else {
                _loaderSleep(defaultSleep, loadRequired, require );  // default 10ms wait before load next script
            }
        }
    }
*/

    function loadScript(appId, callback) {
        var scriptNode;
		var tmpUrl;
        var head = document.getElementsByTagName('head')[0];
        if (apriApps[appId].type == 'group') {
	        apriApps[appId].activated = true;
			console.log('Group ' + appId + ' loading groupmodules activated.')
			//callback();
			callbackInitiator(id, options);
			return;
//            scriptNode 			= document.createElement('link');
//            scriptNode.rel 		= 'stylesheet';
//            scriptNode.type 	= 'text/css';
//			tmpUrl				= apriApps[appId].href;
//			if (tmpUrl.substr(0,4) == 'http') {
//            	scriptNode.href 	= apriApps[appId].href;
//			} else {
//            	scriptNode.href 	= APRI.getConfig().urlSystemRoot + apriApps[appId].href;
//			}
            //console.log('Insert css-link tag in DOM for css: ' + appId);
		}	
        if (apriApps[appId].type == 'css') {
            scriptNode 			= document.createElement('link');
            scriptNode.rel 		= 'stylesheet';
            scriptNode.type 	= 'text/css';
			tmpUrl				= apriApps[appId].href;
			if (tmpUrl.substr(0,4) == 'http') {
            	scriptNode.href 	= apriApps[appId].href;
			} else {
            	scriptNode.href 	= APRI.getConfig().urlSystemRoot + apriApps[appId].href;
			}
            //console.log('Insert css-link tag in DOM for css: ' + appId);
		}
        if (apriApps[appId].type != 'group' && apriApps[appId].type != 'css') {
            scriptNode 			= document.createElement('script');
            scriptNode.type 	= 'text/javascript';
            scriptNode.async 	= true;
			tmpUrl				= apriApps[appId].src?apriApps[appId].src:"/"+appId;
			if (tmpUrl.substr(0,4) == 'http') {
	            scriptNode.src 		= tmpUrl;
			} else {
	            scriptNode.src 		= APRI.getConfig().urlSystemRoot + tmpUrl;
			}
            //console.log('Insert script tag in DOM for module: ' + appId);
        }
		
        scriptNode.appId = appId;

        apriApps[appId].activated = true;
        // bind events for callback;  several for cross browser compatibility
        scriptNode.onreadystatechange = callback;
        scriptNode.onload = callback;
        
        head.appendChild(scriptNode);
    }

    function scriptLoaded(scriptNode, callback ) {
        var appId = scriptNode.currentTarget.appId;
        apriApps[appId].loaded = true;
        console.log('Module: ' + appId + ' is ready to use');
		waitForArrayDoneIndex++;

		if (waitForArrayDoneIndex == tmpRequireArray.length && callbackInitiator && typeof(callbackInitiator) === "function") {
			callbackInitiator(id, options);
			
			// show apps body after loading all modules
			var apriStartScreen = document.getElementById('apri-startup-screen');
			if (apriStartScreen && apriStartScreen.className != "hide") {
				apriStartScreen.className = "hide";
				apriStartScreen.style.visibility = 'hidden';
				apriStartScreen.style.display = 'none';
				var apriAppsContainer = document.getElementById('apri-apps-container');
				apriAppsContainer.style.visibility = 'visible';
				apriAppsContainer.style.display = ''; //'inline-block';
				var apriAppsBody = document.getElementById('apri-apps-body');
				apriAppsBody.className = "show";
				apriAppsBody.style.opacity = null;
			}
		}
	}
    function scriptAlreadyLoaded(appId) {
        //var appId = scriptNode.currentTarget.appId;
        //apriApps[appId].loaded = true;
        console.log('Module: ' + appId + ' is ready to use');
		waitForArrayDoneIndex++;
		if (waitForArrayDoneIndex == tmpRequireArray.length && callbackInitiator && typeof(callbackInitiator) === "function") {
			callbackInitiator(id, options);
		}
    }



		if (!apriApps[id]) {
			alert ('Error! Module ' + id + ' not found in Apri-loader configuration for this application.\nThis function is aborted.' );
			return -1;
		}
        tmpRequireArray 		= apriApps[id].require || [];
        tmpRequireArray        	= tmpRequireArray.concat(options?options.require || []:[]);
        tmpRequireArray        	= tmpRequireArray.concat([{'id':id}]); // load requested module as last
        initWaitForArray(tmpRequireArray);
//        loadRequired(tmpRequireArray);





    };  // end of apri loader function



/*
    apri.waitFor = function (depends) {
		var _depend = depends[0].depend;
		var i=0;
		console.log('Start waiting for module: ' + _depend);
		while (_waitFor(_depend)) {
			console.log('Waiting for module: ' + _depend);
			i++;
			if (i>50) {
                alert ('No response for loading module: ' + _depend);
				console.log('Waiting for module: ' + _depend + 'too long, giving up!') ;
				break;
			}
		};
	}
    _waitFor = function (depend) {
		var _depend = depend;
		var _dependDom =  ;
		var isDependDom=eval(_dependDom);
		if (apriApps[_depend].loaded==false) {
            alert('Waiting for module: ' + _depend);
			console.log('Waiting for module: ' + _depend);
			apri.sleep(10, apri.waitFor, depends );
            return false;
		}
        return true;
	}
*/
/*
    apri.waitFor = function (depends) {
		var _depend = depends[0].depend;
		var i=0;
		console.log('Start waiting for module: ' + _depend);
		while (_waitFor(_depend)) {
			console.log('Waiting for module: ' + _depend);
			i++;
			if (i>10) {
				console.log('Waiting for module: ' + _depend) + 'too long, giving up!' ;
				break;
			}
		};
	}

    _waitFor = function (depend) {
		var _depend = depend;
		var _dependDom = apriApps[_depend].depend[0] ;
		var isDependDom=eval(_dependDom);
		if (_depend && _dependDom!=undefined && !isDependDom ) {
            alert('Waiting for module: ' + _depend);
			console.log('Waiting for module: ' + _depend);
			apri.sleep(10, apri.waitFor, depends );
            return true;
		} return false;
	}
*/
    apri.isApriApp = function (apriApp) {
        var _apriAppInd;
        if (apriApps[apriApp]) _apriAppInd = true;
        else _apriAppInd = false;
        return _apriAppInd;
    }


	var _trueRandom = (function () {
    	if ( !document.documentMode && crypto && crypto.getRandomValues) {
        	// if we have a crypto library, use it
        	return function () {
            	var array = new Uint32Array(1);
            	crypto.getRandomValues(array);
            	var intVal = array[0];
				//var t1 = (intVal + '').length;
            	return intVal / (Math.pow(10, (intVal + '').length));
        	};
    	} else {
        	// From http://baagoe.com/en/RandomMusings/javascript/
        	// Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
        	var Mash = function() {
        	    var n = 0xefc8249d;

     	       var mash = function (data) {
					data = data.toString();
                	for (var i = 0; i < data.length; i++) {
                    	n += data.charCodeAt(i);
                    	var h = 0.02519603282416938 * n;
                    	n = h >>> 0;
                    	h -= n;
                    	h *= n;
                    	n = h >>> 0;
                    	h -= n;
                    	n += h * 0x100000000; // 2^32
                	}
                	return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
            	};

            	mash.version = 'Mash 0.9';
            	return mash;
        	}

        	// From http://baagoe.com/en/RandomMusings/javascript/
        	var Alea = function() {
            	return (function (args) {
                	// Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
                	var s0 = 0;
                	var s1 = 0;
                	var s2 = 0;
                	var c = 1;

                	if (args.length == 0) {
                    	args = [+new Date()];
                	}
                	var mash = Mash();
                	s0 = mash(' ');
                	s1 = mash(' ');
                	s2 = mash(' ');

                	for (var i = 0; i < args.length; i++) {
                    	s0 -= mash(args[i]);
                    	if (s0 < 0) {
                        	s0 += 1;
                    	}
                    	s1 -= mash(args[i]);
                    	if (s1 < 0) {
                        	s1 += 1;
                    	}
                    	s2 -= mash(args[i]);
                    	if (s2 < 0) {
                        	s2 += 1;
                    	}
                	}
                	mash = null;

                	var random = function () {
                    	var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
                    	s0 = s1;
                    	s1 = s2;
                    	return s2 = t - (c = t | 0);
                	};
                	random.uint32 = function () {
                    	return random() * 0x100000000; // 2^32
                	};
                	random.fract53 = function () {
                    	return random() +
                        	(random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
                	};
                	random.version = 'Alea 0.9';
                	random.args = args;
                	return random;

            	}(Array.prototype.slice.call(arguments)));
        	};
        	return Alea();
    	}
	}());

	apri.apriGuid = function (id) {
		if (id==undefined || id==null || id=="") {
			var _id =  'apri-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        		var r = _trueRandom() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        		return v.toString(16);
    		});
			return _id;
		} 
		return id;
	};

	// Get width and height from nearest offset values(up into the dom)
	apri.getElementSize = function(element) {
		var _attributeHeight = element.getAttribute('height');
		var _height = _attributeHeight==null?0:parseInt(_attributeHeight);
		if ( (_height==0) && element.nodeName!='BODY' && element.parentElement!=null ) {
			return apri.getElementSize(element.parentElement);
		}
		//var _width = parseInt(element.getAttribute('width'));
		var _attributeWidth = element.getAttribute('width');
		var _width = _attributeWidth==null?0:parseInt(_attributeWidth);

		//if (element.offsetHeight!=0) return {height: element.offsetHeight, width: width.element.offsetWidth}
		return {height: _height, width: _width };
	};


	return;

}); // end of ApriCore.ApriController class def
