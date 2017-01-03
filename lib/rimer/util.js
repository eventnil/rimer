"use strict";

var _       = require('underscore');

var utilities = {};
utilities.createOptions = createOptions;
utilities.init = init;
utilities.createServices = createServices;
utilities.method = method;

module.exports = utilities;

var postService     = require('../services/post.service.js')
	, authorService   = require('../services/author.service.js')
	, categoryService = require('../services/category.service.js')
	
var createDefaults = require('./default');

// curring (partial function application) is a functional programming use case for call and apply.
// Currying allows us to create functions that return functions requiring a subset of arguments with 
// predetermined conditions.

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

function createServices(rimer) {
	var services = {
		getPost: function(info, callback) {
			info = info || {};
			info.ref = rimer.options.ref;
			postService._findOne(info, function(error, response) {return callback(error, response)});
		},
		getPosts: function(info, callback) {
			info = info || {}
			info.ref = rimer.options.ref;
			info.limit = +(rimer.options.postLimit);
			postService._find(info, function(error, response) {return callback(error, response)});
		},
		getPostsByCategory: function(info, callback) {
			info = info || {}
			info.ref = rimer.options.ref;
			postService._findByCategory(info, function(error, response) {return callback(error, response)});
		},
		getPostsByAuthor: function(info, callback) {
			info = info || {}
			info.ref = rimer.options.ref;
			postService._findByAuthor(info, function(error, response) {return callback(error, response)});
		},
		createPost: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._create(info, function(error, response) {return callback(error, response)});
		},
		publish: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._publish(info, function(error, response) {return callback(error, response)});
		},
		unpublish: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._unpublish(info, function(error, response) {return callback(error, response)});
		},
		updatePost: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._update(info, function(error, response) {return callback(error, response)});
		},
		deletePost: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._delete(info, function(error, response) {return callback(error, response)});
		},
		assignPostAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._assignAuthor(info, function(error, response) {return callback(error, response)})
		},
		unassignPostAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._unassignAuthor(info, function(error, response) {return callback(error, response)})
		},
		getAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._findOne(info, function(error, response) {return callback(error, response)});
		},
		getAuthors: function(info, callback) {
			info.ref = rimer.options.ref;
			info.limit = rimer.options.authorLimit;
			authorService._find(info, function(error, response) {return callback(error, response)});
		},
		createAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._create(info, function(error, response) {return callback(error, response)});
		},
		updateAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._update(info, function(error, response) {return callback(error, response)});
		},
		deleteAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._delete(info, function(error, response) {return callback(error, response)});
		},
		getCategories: function(callback) {
			var info = {ref : rimer.options.ref}
			categoryService._findPublished(info, function(error, response) {return callback(error, response)})
		}
	};
	return services;
}