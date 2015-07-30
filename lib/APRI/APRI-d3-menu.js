/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriD3Menu*/
/** 
 * ApriD3Menu is a for creating instances of the apri d3 menu.
 * @framework ApriD3Menu
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.

var container, controlElement;
var _options;

// ApriD3Legend class def ===============================================================================
// parent: class ApriD3Base
var ApriD3Menu = ApriCore.ApriD3Menu = ApriCore.ApriD3Menu || ApriCore.ApriD3Base.extend(function () {

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	var _options;
	var d3MenuElement;
	var w,h,oR,nTop;
	var svgContainer, svg, mainNote;
	
	this.constructor = function(options) {
		//Execute the constructor of the class we extended.
        this.super();
		
		_options = options;
		// Initialize our ApriApp-specific properties
		//this.options = options;
		
		console.log(' Constructor of ApriD3Menu');
		
		container = document.getElementById(options.containerId);
		d3MenuElement = document.createElement('div');
		d3MenuElement.className = 'd3menu';
		d3MenuElement.id = APRI.UTIL.apriGuid(d3MenuElement.id );
		container.appendChild(d3MenuElement);
						
	}


	this.createD3Menu = function(config){
		root = config.menuData;

		w = window.innerWidth*0.68*0.95;
		h = Math.ceil(w*0.7);
		oR = 0;
		nTop = 0;
    
		svgContainer = d3.select("#"+d3MenuElement.id)
			.attr("class", "mainBubble")
			.style("height", h+"px");
    
//		svg = d3.select("#mainBubble").append("svg")
		svg = svgContainer
			.append("svg")
			.attr("class", "mainBubbleSVG")
			.attr("width", w)
			.attr("height",h)
			.on("mouseleave", function() {return resetBubbles();});
         
		mainNote = svg.append("text")
			.attr("id", "bubbleItemNote")
			.attr("x", 10)
			.attr("y", w/2-15)
			.attr("font-size", 12)
			.attr("dominant-baseline", "middle")
			.attr("alignment-baseline", "middle")
			.style("fill", "#888888")
			.text(function(d) {return "D3.js bubble menu developed by Shipeng Sun (sunsp.gis@gmail.com), Institute of Environment, University of Minnesota, and University of Springfield, Illinois.";});

        var bubbleObj = svg.selectAll(".topBubble")
                .data(root.children)
            .enter().append("g")
                .attr("id", function(d,i) {return "topBubbleAndText_" + i});
             
        console.log(root);  
        nTop = root.children.length;
        oR = w/(1+3*nTop);  
 
    h = Math.ceil(w/nTop*2);
    svgContainer.style("height",h+"px");
         
        var colVals = d3.scale.category10();
         
        bubbleObj.append("circle")
            .attr("class", "topBubble")
            .attr("id", function(d,i) {return "topBubble" + i;})
            .attr("r", function(d) { return oR; })
            .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
            .attr("cy", (h+oR)/3)
            .style("fill", function(d,i) { return colVals(i); }) // #1f77b4
        .style("opacity",0.3)
            .on("mouseover", function(d,i) {return activateBubble(d,i);});
         
             
        bubbleObj.append("text")
            .attr("class", "topBubbleText")
            .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
            .attr("y", (h+oR)/3)
        .style("fill", function(d,i) { return colVals(i); }) // #1f77b4
            .attr("font-size", 30)
            .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
            .text(function(d) {return d.name})      
            .on("mouseover", function(d,i) {return activateBubble(d,i);});
         
         
        for(var iB = 0; iB < nTop; iB++)
        {
            var childBubbles = svg.selectAll(".childBubble" + iB)
                .data(root.children[iB].children)
                .enter().append("g");
                 
        //var nSubBubble = Math.floor(root.children[iB].children.length/2.0);   
             
            childBubbles.append("circle")
                .attr("class", "childBubble" + iB)
                .attr("id", function(d,i) {return "childBubble_" + iB + "sub_" + i;})
                .attr("r",  function(d) {return oR/3.0;})
                .attr("cx", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
                .attr("cursor","pointer")
                .style("opacity",0.5)
                .style("fill", "#eee")
                .on("click", function(d,i) {
                window.open(d.address);                 
              })
            .on("mouseover", function(d,i) {
              //window.alert("say something");
              var noteText = "";
              if (d.note == null || d.note == "") {
                noteText = d.address;
              } else {
                noteText = d.note;
              }
              d3.select("#bubbleItemNote").text(noteText);
              })
            .append("svg:title")
            .text(function(d) { return d.address; });   
 
            childBubbles.append("text")
                .attr("class", "childBubbleText" + iB)
                .attr("x", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
                .style("opacity",0.5)
                .attr("text-anchor", "middle")
            .style("fill", function(d,i) { return colVals(iB); }) // #1f77b4
                .attr("font-size", 6)
                .attr("cursor","pointer")
                .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
                .text(function(d) {return d.name})      
                .on("click", function(d,i) {
                window.open(d.address);
                }); 
 
        }
		
			
	};

	this.initControl = function(options) {
		d3MenuElement.className = d3MenuElement.className + " apri-leaflet-control-active ";
	}
	
	this.hide = function() {
		d3MenuElement.classList.remove("visible");
		d3MenuElement.classList.add("hide");
	}

	this.show = function() {
		d3MenuElement.classList.remove("hide");
		d3MenuElement.classList.add("visible");
	}



	var root = {"name":"bubble", "children": [
{"name":"Atlas","description":"Atlas of Global Agriculture",
"children":[
    {"name": "Geography","address":"http://gli.environment.umn.edu", "note":"Global crop geography, including precipitation, temperature, crop area, etc."},
    {"name": "Crop Land","address":"http://d3js.org"},
    {"name": "Crop Yields","address":"http://environment.umn.edu", "note":"Maize, wheat, rice, and soybean yields in 2000"}
]},
{"name": "AgLab", "description": "Virtual Lab of Global Agriculture",
"children":[
    {"name":"Excess Nutrient","address":"http://d3js.org","note":"Prototype Infographics on Excess Fertilizer Nutrients"},
    {"name":"Yield Gap","address":"http://d3js.org", "note":"The gap between attainable yields and actual yields, with modeled yields assuming the percentage of gap closed."},
    {"name":"Fertilizer","address":"http://sunsp.net"}
]},
{"name":"Nutshell", "description":"Profiles of Country",
"children":[
    {"name":"Efficiency","address":"http://d3js.org"},
    {"name":"Excess Nutrient","address":"http://d3js.org"},
    {"name":"Economy","address":"http://d3js.org"},
    {"name":"Agriculture","address":"http://uis.edu/ens"}
]},
{"name":"Data", "description":"Crop Data in 5 minutes grid",
"children":[
    {"name":"Geography","address":"http://www.earthstat.org/"},
    {"name":"Crop Land","address":"http://www.earthstat.org/"},
    {"name":"Crop Yields","address":"http://www.earthstat.org/"}
]}
]}
 
//    d3.json("main_bubble.json", function(error, root) {
//        console.log(error);
     
 
         
       // }); 
 
    var resetBubbles = function () {
      w = window.innerWidth*0.68*0.95;
      oR = w/(1+3*nTop);
       
      h = Math.ceil(w/nTop*2);
      svgContainer.style("height",h+"px");
 
      mainNote.attr("y",h-15);
           
      svg.attr("width", w);
      svg.attr("height",h);       
       
      d3.select("#bubbleItemNote").text("D3.js bubble menu developed by Shipeng Sun (sunsp.gis@gmail.com), Institute of Environment, University of Minnesota, and University of Springfield, Illinois.");
       
      var t = svg.transition()
          .duration(650);
         
        t.selectAll(".topBubble")
            .attr("r", function(d) { return oR; })
            .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
            .attr("cy", (h+oR)/3);
 
        t.selectAll(".topBubbleText")
        .attr("font-size", 30)
            .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
            .attr("y", (h+oR)/3);
     
      for(var k = 0; k < nTop; k++) 
      {
        t.selectAll(".childBubbleText" + k)
                .attr("x", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
            .attr("font-size", 6)
                .style("opacity",0.5);
 
        t.selectAll(".childBubble" + k)
                .attr("r",  function(d) {return oR/3.0;})
            .style("opacity",0.5)
                .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));});
                     
      }   
    }
         
         
    var activateBubble = function(d,i) {
            // increase this bubble and decrease others
            var t = svg.transition()
                .duration(d3.event.altKey ? 7500 : 350);
     
            t.selectAll(".topBubble")
                .attr("cx", function(d,ii){
                    if(i == ii) {
                        // Nothing to change
                        return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
                    } else {
                        // Push away a little bit
                        if(ii < i){
                            // left side
                            return oR*0.6*(3*(1+ii)-1);
                        } else {
                            // right side
                            return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                        }
                    }               
                })
                .attr("r", function(d, ii) { 
                    if(i == ii)
                        return oR*1.8;
                    else
                        return oR*0.8;
                    });
                     
            t.selectAll(".topBubbleText")
                .attr("x", function(d,ii){
                    if(i == ii) {
                        // Nothing to change
                        return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
                    } else {
                        // Push away a little bit
                        if(ii < i){
                            // left side
                            return oR*0.6*(3*(1+ii)-1);
                        } else {
                            // right side
                            return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                        }
                    }               
                })          
                .attr("font-size", function(d,ii){
                    if(i == ii)
                        return 30*1.5;
                    else
                        return 30*0.6;              
                });
     
            var signSide = -1;
            for(var k = 0; k < nTop; k++) 
            {
                signSide = 1;
                if(k < nTop/2) signSide = 1;
                t.selectAll(".childBubbleText" + k)
                    .attr("x", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*2.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("y", function(d,i) {return ((h+oR)/3 + signSide*oR*2.5*Math.sin((i-1)*45/180*3.1415926));})
                    .attr("font-size", function(){
                            return (k==i)?12:6;
                        })
                    .style("opacity",function(){
                            return (k==i)?1:0;
                        });
                     
                t.selectAll(".childBubble" + k)
                    .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*2.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("cy", function(d,i) {return ((h+oR)/3 + signSide*oR*2.5*Math.sin((i-1)*45/180*3.1415926));})
                    .attr("r", function(){
                            return (k==i)?(oR*0.55):(oR/3.0);               
                    })
                    .style("opacity", function(){
                            return (k==i)?1:0;                  
                        }); 
            }                   
        }
     
    //window.onresize = resetBubbles;





});


// ApriD3Menu Class end ===============================================================================



