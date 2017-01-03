"use strict";

var _       = require('underscore');

var utilities = {};
utilities.createOptions = createOptions;
utilities.init = init;
utilities.method = method;

module.exports = utilities;

var postService     = require('../services/post.service.js')
	, authorService   = require('../services/author.service.js')
	, categoryService = require('../services/category.service.js')
	
var createDefaults = require('./default');

function method (lambda) {
	return function () {
		return lambda.apply(null, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
}

function createOptions (options) {
	options = _.extend({}, createDefaults(), options || {});
	if(!options.ref) {
		options.ref = ""
	}
	return options;
}

function init(rimer) {
	var options = rimer.options;
	var ref = options.ref;
	if(ref && ref != "") {
		rimer.options.ref = ref.child(options.node);
		(function(){
			ref.child(options.node).update({initiatedAt: Date.now()}, function(error) {})
		})()
		return rimer;
	}
	else 
		return null
}