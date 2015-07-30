/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */ 
/*global ApriTreeBase*/
/** 
 * ApriTreeBase is a base class for creating a hierarchical datastructure.
 */ 

 "use strict"; // This is for your code to comply with the ECMAScript 5 standard.

// ApriPanel class def ===============================================================================
// parent: class ApriApp
var ApriTreeBase = ApriCore.ApriTreeBase = ApriCore.ApriTreeBase || Class.extend(function () {
	

	//initializer is executed before the constructor.
    this.initializer = function(){
        //...
    };
	
	this.constructor = function(root) {
		//Execute the constructor of the class we extended.
        this.super();
		
  		// Initialize our ApriApp-specific properties
		//this.options = options;

		console.log(' Constructor of ApriTreeBase');
        if (!root) {
            this.root = new ApriTreeBase.TreeNode("root");
        }
        else {
            this.root = root;
        }

        // assign the tree as the parent of the root node
        this.root.parent = this;


	}

	var DataStructures = DataStructures || {};
	var root = null;
	
	this.findNode = function(value, matchFunction_node_value){
        var matchFunction = matchFunction_node_value,
            match =  null;

        if (!matchFunction){
            if (typeof(value) != "string") {
                // match objects JSON values
                matchFunction = function(nodeToMatch, valueToMatchOn) {
                    return (nodeToMatch.name == value.name);
                };
            }
            else {
                // default string match is a function that matches by name;
                matchFunction = function(nodeToMatch, valueToMatchOn) {
                    return (nodeToMatch.name == valueToMatchOn);
                };
            }
        }

        this.nodes().each(function(node, cancel){
            if (matchFunction(node, value)) {
                match = node;
                cancel = true;
            }
        });

        return match;
    };

    this.nodes = function() {
        // nodes function provides a full suite of methods for traversing the nodes of a tree

        var current = null, // keeps a reference to the current node
            parentTree = this, // maintains a reference to the tree
            traversing = false, // a flag to indicate whether we have started traversing or not
            traversalQueue = [];

        return {
            reset : function() {
                current = null;
                traversalQueue = [];
                traversing = false;
            },
            initTraversal : function() {
                // begin traversing :
                // - set the current node
                current = parentTree.root;
                // - start off the traversal Queue
                traversalQueue.push(current);
                // - set the traversal flag to true
                traversing = true;
            },
            next : function() {

                if (!traversing) {
                    this.initTraversal();
                }

                current = traversalQueue.shift();
                if (current) {
                    // enqueue the children (bread-first-traversal)
                    current.children.each(function(childToEnqueue){
                        traversalQueue.push(childToEnqueue);
                    });
                }

                return current;
            },
            each : function(callback) {
                var cancel = false,
                    node = this.next();

                while (node && !cancel){
                    callback(node, cancel);
                    node = this.next();
                }
            }
        }
    };

    this.toSimpleObject = function(decorateNodeFunction) {
        var decorateNode = decorateNodeFunction || function(objectToDecorate, originalNode) {
                return objectToDecorate;
            },
            writeChildNodes = function(nodeCollection){
                var simpleChildRepresentation = [];
                if (nodeCollection) {
                    nodeCollection.each(function(node){
                        var children = writeChildNodes(node.children);
                        simpleChildRepresentation.push(decorateNode({
                            "name" :  node.name,
                            "children" : children,
							"properties" : node.properties
                        }, node));
                    })
                }

                return simpleChildRepresentation;
            };

        return decorateNode({
                "name" :  this.root.name,
                "children" : writeChildNodes(this.root.children)
            }, this.root);
    }
	
});


ApriTreeBase.createFromFlatTable = function(flatTable, parentId) {
    // factory method to create a tree given a flat table
    var tree,
        isNull = function(value){
            // a forgiving null check to cater for null values that are string representations of null
            return (value == null || value == "null" || value == "NULL")
        };

    if (flatTable) {
        if (flatTable instanceof Array) {
            tree = new ApriTreeBase();
			var _parentId = parentId?parentId:'parentId';

            for (var i=0; i < flatTable.length; i++) {
                var rowToConvertToNode = flatTable[i];

               if (isNull(rowToConvertToNode[_parentId])) {
                   // this is the root node
                   var root = tree.root;

                   for (var keyToCopy in rowToConvertToNode) {
                       root[keyToCopy] = rowToConvertToNode[keyToCopy];
                   }
               }
               else {
                    // this is a child node, find the parent...
					var matchById = function(nodeToMatch, valueToMatchOn) {
                            return (nodeToMatch.id == valueToMatchOn);
                    };
					var parentNode = tree.findNode(rowToConvertToNode[_parentId], matchById);

                    // if we managed to find the parentNode for this rowToConvert, add it as a child
                    if (parentNode) {
                        var convertedNode = parentNode.addChild(new ApriTreeBase.TreeNode());

                        for (var keyToCopy in rowToConvertToNode) {
                            convertedNode[keyToCopy] = rowToConvertToNode[keyToCopy];
                        }

                    }
                    else {
						var message = "unable to find a parent node for row " + rowToConvertToNode.name;
                        throw message; //{ 
    //                        var name = "NodeNotFound";
      //                      var message = "unable to find a parent node for row " + rowToConvertToNode.name;
		//					console.log(name+message);
	                 //       name : "NodeNotFound",
                     //       message : "unable to find a parent node for row " + rowToConvertToNode.name
                        //}
                    }
               }
            }
        }
    }
    else {
        tree = undefined;
    }

    return tree;
};


ApriTreeBase.TreeNode = Class.extend(function () {

    this.constructor = function(name) {
        if(name) { this.name = name };
        this.children = new ApriTreeBase.TreeNodeCollection();
        this.siblings = new ApriTreeBase.TreeNodeCollection();
    };

    var name = null,
    	parent = null,
    	siblings = null,
    	children = null,
    	previousSibling = null,
    	nextSibling = null;
		
    this.addChild = function(childNode) {
        childNode.parent = this;
        this.children.addNode(childNode);

        return childNode;
    };
	
});

ApriTreeBase.TreeNodeCollection = Class.extend(function () {

    this.constructor = function() {
        this.internalArray = [];
    };
	
    var internalArray = [],
    	length = 0;

    this.firstNode = function() {
        var nodeCount = this.internalArray.length;

        if (nodeCount > 0) {
            return this.internalArray[0];
        }
        else {
            return undefined;
        }
    };

    this.lastNode = function() {
        var nodeCount = this.internalArray.length;

        if (nodeCount > 0) {
            return this.internalArray[nodeCount - 1];
        }
        else {
            return undefined;
        }
    };

    this.addNode = function(nodeToAdd) {
        nodeToAdd.siblings = this;
        nodeToAdd.previousSibling = this.lastNode();
        if (nodeToAdd.previousSibling) { nodeToAdd.previousSibling.nextSibling = nodeToAdd; }
        nodeToAdd.nextSibling = undefined;
        this.internalArray.push(nodeToAdd);
        this.length++;
    },

    this.removeNode = function(nodeToRemove) {
        nodeToAdd.siblings = this;
        nodeToAdd.previousSibling = this.lastNode();
        if (nodeToAdd.previousSibling) { nodeToAdd.previousSibling.nextSibling = nodeToAdd; }
        nodeToAdd.nextSibling = undefined;
        this.internalArray.push(nodeToAdd);
        this.length++;
    },

    this.find = function(value, matchFunction_node_value) {

        var matchFunction = matchFunction_node_value,
            internalArray = this.internalArray;

        if (!matchFunction){
            if (typeof(value) != "string") {
                // match objects JSON values
                matchFunction = function(nodeToMatch, valueToMatchOn) {
                    return (nodeToMatch.name == value.name);
                };
            }
            else {
                // default string match is a function that matches by name;
                matchFunction = function(nodeToMatch, valueToMatchOn) {
                    return (nodeToMatch.name == valueToMatchOn);
                };
            }
        }

        for(var i=0; i<internalArray.length; i++){
            if (matchFunction(internalArray[i], value)){
                return internalArray[i];
            }
        }

        return null;
    };

    this.nodeAt = function(index) {
        return this.internalArray[index];
    };

    this.each = function(callback) {
        for (var i = 0; i < this.internalArray.length; i++) {
            callback(this.internalArray[i]);
        }
    };
});


// ApriTreeBase Class end ===============================================================================



