'use strict';

var service = {};
service._findOne 				= _findOne;
service._find 					= _find;
service._findByCategory	= _findByCategory
service._findByAuthor 	= _findByAuthor
service._create 				= _create;
service._publish 				= _publish;
service._unpublish 			= _unpublish;
service._update 				= _update;
service._delete 				= _delete;
service._assignAuthor 	= _assignAuthor;
service._unassignAuthor = _unassignAuthor;

module.exports = service;

var helperService   	= require('./helper.service');
var firebaseService   = require('./firebase.service');
var authorService   	= require('./author.service');

function _findOne(info, callback) {
	var queryParam = info.query || {};
	if(!queryParam.id)
		return callback({code: 400, value: 'idMissing'}, null)

	var data = {refrence : "posts/published", queryParam: queryParam}
	if(queryParam.published == false)
		data.refrence = "posts/unpublished"

	data.refrence = data.refrence+'/'+queryParam.id.toString();
	data.fields = helperService.generateFieldsArr(info.fields);
	data.ref = info.ref
	firebaseService.findPost(data, function(error, success) {
		return callback(error, success)
	})
}

function _find(info, callback) {
	var queryParam = info.query || {};
	queryParam.limit = +(info.limit) || 10
	var data = {refrence : "posts/published", queryParam: queryParam}
	data.fields = helperService.generateFieldsArr(info.fields);

	if(queryParam.published == false)
		data.refrence = "posts/unpublished"
	data.ref = info.ref
	firebaseService.findPosts(data, function(error, success) {
		return callback(error, success)
	})
}

function _findByCategory(info, callback) {
	var queryParam = info.query || {};
	if(!queryParam.category)
		return callback({code: 400, value: 'nameMissing'}, null)
	var data = {refrence : "posts/published", queryParam: queryParam}
	data.fields = helperService.generateFieldsArr(info.fields);
	data.ref = info.ref
	firebaseService.findPostsByCategory(data, function(error, success) {
		return callback(error, success)
	})
}

function _findByAuthor(info, callback) {
	var queryParam = info.query || {};
	if(!queryParam.authorId)
		return callback({code: 400, value: 'authorIdMissing'}, null)
	var data = {refrence : "posts/published", queryParam: queryParam}
	data.fields = helperService.generateFieldsArr(info.fields);
	data.ref = info.ref
	firebaseService.findPostsByAuthor(data, function(error, success) {
		return callback(error, success)
	})
}

function _create(info, callback) {
	var body = info.body;
	var current = Date.now();
	if(!body.title || helperService.trim(body.title) == "")
		return callback({code: 400, value: "invalidTitle"}, null)
	if(!body.preview || helperService.trim(body.preview) == "") 
		return callback({code: 400, value: "invalidPreview"}, null)
	if(!body.category || helperService.trim(body.category) == "") 
		return callback({code: 400, value: "invalidCategory"}, null)
	if(!body.tags || helperService.trim(body.tags) == "")
		return callback({code: 400, value: "invalidTags"}, null)
	if(!body.postType) 
		body.postType = "text"
	for(var key in body) {
		body[key] = helperService.trim(body[key])
	}
	var data = {
		refrence: "posts/unpublished"
	};
	data.ref = info.ref;
	body.tags = body.tags.toLowerCase();
	body.tags = body.tags.split(',');
	body.createdAt = current
	body.modifiedAt = current
	for(var i=0; i<body.tags.length; i++) {
		body.tags[i] = helperService.trim(body.tags[i])
	}
	body.category = helperService.trim(body.category.toLowerCase());
	body.images = body.images ? body.images.split(',') : []
	delete body.published;

	var authorQuery = {query: {id: body.authorId}, fields: "name,about,thumbnail"}
	authorQuery.ref = info.ref;
	authorService._findOne(authorQuery, function(error, response) {
		if(!error && response)
			body.author = response.value
		delete body.authorId
		data.ref = info.ref
		data.value = body;
		firebaseService.createPost(data, function(error, success) {
			return callback(error, success)
		})
	})
}

function _publish(info, callback) {
	var queryParam = info.query || {}
	if(!queryParam.id)
		return callback({code: 400, value: "idMissing"}, null)
	queryParam.published = false;
	info.query = queryParam
	_findOne(info, function(error, response) {
		if(error) {
			return callback(error, null)
		}
		else {
			var data = {id: info.query.id, value: response.value, queryParam: queryParam}
			data.ref = info.ref
			firebaseService.publishPost(data, function(error, success) {
				return callback(error, success)
			})
		}
	})
}

function _unpublish(info, callback) {
	var queryParam = info.query || {}
	if(!queryParam.id)
		return callback({code: 400, value: "idMissing"}, null)

	info.query.published = true
	_findOne(info, function(error, response) {
		if(error) {
			return callback(error, null)
		}
		else {
			var data = {id: info.query.id, value: response.value, queryParam: queryParam}
			data.ref = info.ref
			firebaseService.unPublishPost(data, function(error, success) {
				return callback(error, success)
			})
		}
	})
}

function _update(info, callback) {
	var body = info.body;
	var queryParam = info.query || {};
	if(!queryParam.id) 
		return callback({code: 400, value: "idMissing"}, null);
	if(helperService.trim(body.title) == "")
		return callback({code: 400, value: "invalidTitle"}, null)
	if(helperService.trim(body.preview) == "")
		return callback({code: 400, value: "invalidPreview"}, null)
	if(helperService.trim(body.category) == "")
		return callback({code: 400, value: "invalidCategory"}, null)
	if(helperService.trim(body.tags) == "")
		return callback({code: 400, value: "invalidTags"}, null)

	var data = {refrence: "posts/published/"+queryParam.id};
	if(queryParam.published == "false" || queryParam.published == false)
		data.refrence = "posts/unpublished/"+queryParam.id;
	var updateInfo = {};

	if(body.title)
		updateInfo.title = body.title.toString();

	if(body.description == "")
		updateInfo.description = null
	else if(body.description)
		updateInfo.description = body.description.toString();

	if(body.preview && body.preview != "")
		updateInfo.preview = body.preview;
	
	if(body.images == "")
		updateInfo.images = null
	else if(body.images && body.images != "")
		updateInfo.images = body.images.split(",");
	
	if(body.thumbnail == "")
		updateInfo.thumbnail = null
	else if(body.thumbnail && body.thumbnail != "")
		updateInfo.thumbnail = body.thumbnail;

	if(body.tags) {
		body.tags = body.tags.toLowerCase();
		updateInfo.tags = body.tags.split(",");
		for(var i=0; i<updateInfo.tags.length; i++) {
			updateInfo.tags[i] = helperService.trim(updateInfo.tags[i]);
		}
	}
	if(body.postType && body.postType != "") 
		updateInfo.postType = body.postType;
	if(body.category)
		updateInfo.category = helperService.trim(body.category.toLowerCase())
	data.updateInfo = updateInfo;
	data.id = queryParam.id;
	data.ref = info.ref;
	firebaseService.updatePost(data, function(error, success) {
		return callback(error, success)
	})
}

function _delete(info, callback) {
	var queryParam = info.query || {}
	if(!queryParam.id)
		return callback({code: 400, value: 'idMissing'}, null)
	var data = {queryParam : queryParam, refrence: "posts/published/"+queryParam.id}
	if(queryParam.published == false)
		data.refrence = "posts/unpublished/"+queryParam.id
	
	data.ref = info.ref
	firebaseService.deletePost(data, function(error, success) {
		return callback(error, success)
	})
}

function _unassignAuthor(info, callback) {
	var queryParam = info.query || {}
	_findOne(info, function(error, response) {
		if(error) {
			return callback(error, null)
		}
		else {
			if(response.value && response.value.author) {
				queryParam.authorId = response.value.author.id;
				var data = {ref: info.ref, refrence: "posts/published", queryParam: queryParam};
				if(queryParam.published == false)
					data.refrence = "posts/unpublished"
				firebaseService.unassignAuthorFromPost(data, function(error, success) {
					return callback(error, success)
				})
			}	
			else {
				return callback({code: 400, value: 'noAuthorAssigned'}, null)
			}
		}
	})
}

function _assignAuthor(info, callback) {
	var queryParam = info.query || {}
	if(!queryParam.authorId)
		return callback({code: 400, value: "authorIdMissing"}, null)
	var authorQuery = {ref: info.ref, query: {id: queryParam.authorId}, fields: "name,about,thumbnail"}
	authorService._findOne(authorQuery, function(error, author) {
		if(error){
			return callback(error, null)
		}
		else {
			_findOne(info, function(error, response) {
				if(error) {
					return callback(error, null)
				}
				else {
					queryParam.state = "published"
					var data = {ref: info.ref, refrence: "posts/published", authorDetail: author.value};
					if(queryParam.published == false) {
						data.refrence = "posts/unpublished"
						queryParam.state = "unpublished"
					}
					if(response.value.author && response.value.author.id != queryParam.authorId)
						queryParam.previousAuthorId = response.value.author.id;
					data.queryParam = queryParam
					firebaseService.assignAuthorToPost(data, function(error, success) {
						return callback(error, success)
					})
				}
			})
		}
	})
}
