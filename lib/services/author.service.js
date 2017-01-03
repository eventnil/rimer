'use strict';

var service = {};

service._findOne 			= _findOne;
service._find 				= _find;
service._create 			= _create;
service._update 			= _update;
service._delete 			= _delete;

module.exports = service;

var helperService   	= require('./helper.service');
var firebaseService   = require('./firebase.service');


function _findOne(info, callback) {
	var queryParam = info.query || {};
	var data = {
		ref: info.ref,
		refrence : "authors",
		queryParam: queryParam
	}
	if(!queryParam.id)
		return callback({code: 400, value: 'idMissing'}, null)
	
	data.refrence = data.refrence+'/'+queryParam.id.toString();
	data.fields = helperService.generateFieldsArr(info.fields);
	data.ref = info.ref;

	firebaseService.findAuthor(data, function(error, success) {
		return callback(error, success)
	})
}

function _find(info, callback) {
	var queryParam = info.query || {};
	queryParam.limit = info.limit;
	var data = {
		refrence : "authors",
		queryParam: queryParam
	}
	data.fields = helperService.generateFieldsArr(info.fields);
	data.ref = info.ref;

	firebaseService.findAuthors(data, function(error, success) {
		return callback(error, success)
	})
}

function _create(info, callback) {
	var body = info.body || {};
	var current = Date.now();
	if(!body.name)
		return callback({code: 400, value: 'nameMissing'}, null)
	if(!body.about) 
		return callback({code: 400, value: 'aboutMissing'}, null)
	if(helperService.trim(body.name) == "")
		return callback({code: 400, value: 'invalidName'}, null)
	if(helperService.trim(body.about) == "")
		return callback({code: 400, value: 'invalidAbout'}, null)

	for(var key in body) {
		body[key] = helperService.trim(body[key])
	}
	var data = {
		refrence: "authors"
	};
	data.ref = info.ref;
	var createInfo = {
		name : body.name,
		about: body.about,
		createdAt: current,
		modified: current
	}
	if(body.facebook)
		createInfo.facebook = body.facebook
	if(body.twitter)
		createInfo.twitter = body.twitter
	if(body.instagram)
		createInfo.instagram = body.instagram
	if(body.snapchat)
		createInfo.snapchat = body.snapchat
	if(body.other)
		createInfo.other = body.other
	if(body.thumbnail)
		createInfo.thumbnail = body.thumbnail
	if(body.image)
		createInfo.image = body.image
	data.value = createInfo;

	firebaseService.createAuthor(data, function(error, success) {
		return callback(error, success)
	})
}

function _update(info, callback) {
	var body = info.body;
	var queryParam = info.query || {};
	var current = Date.now()
	if(!queryParam.id)
		return callback('idMissing', null)
	if(helperService.trim(body.name) == "")
		return callback({code: 400, value: 'invalidName'}, null)
	if(helperService.trim(body.about) == "")
		return callback({code: 400, value: 'invalidAbout'}, null)
	var data = {
		refrence: "authors/"+queryParam.id,
		id: queryParam.id
	}
	data.ref = info.ref;
	var updateInfo = {}
	if(body.name)
		updateInfo.name = body.name
	if(body.about)
		updateInfo.about = body.about;
	if(body.thumbnail || body.thumbnail == "")
		updateInfo.thumbnail = body.thumbnail;
	if(body.image || body.image == "")
		updateInfo.image = body.image
	if(body.facebook || body.facebook == "")
		updateInfo.facebook = body.facebook
	if(body.twitter || body.twitter == "")
		updateInfo.twitter = body.twitter
	if(body.instagram || body.instagram == "")
		updateInfo.instagram = body.snapchat
	if(body.snapchat || body.snapchat == "")
		updateInfo.snapchat = body.snapchat
	if(body.other || body.other == "")
		updateInfo.other = body.other
	updateInfo.modifiedAt = current;
	data.value = updateInfo;
	firebaseService.updateAuthor(data, function(error, success) {
		return callback(error, success)
	})
}

function _delete(info, callback) {
	var queryParam = info.query || {}
	if(!queryParam.id) 
		return callback({code: 400, value: 'idMissing'}, null)
	var data = {
		queryParam : queryParam
	}
	data.ref = info.ref;
	firebaseService.deleteAuthor(data, function(error, success) {
		return callback(error, success)
	})
}