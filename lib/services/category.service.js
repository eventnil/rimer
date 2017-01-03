'use strict';

var service = {};

service._findPublished 	= _findPublished;

module.exports = service;

var helperService   	= require('./helper.service');
var firebaseService   = require('./firebase.service');

function _findPublished(info, callback) {
	var data = {
		ref : info.ref,
		state: "published"
	}
	firebaseService.getCategories(data, function(error, value) {
		if(error) {
			return callback({error: 500, value: error}, null)
		}
		else {
			var keys = Object.keys(value);
			var categories = []
			if(keys.length) {
				var published = {};
				for(var i=0; i<keys.length; i++) {
					var category = value[keys[i]];
					if(published[category.name])
						published[category.name] += 1
					else
						published[category.name] = 1
				}
				for(var key in published) {
					categories.push({name: key, count: published[key]})
				}
				return callback(null, {code:200, value: categories})
			}
			else {
				return callback(null, {code:200, value: []})
			}
		}
	})
}
