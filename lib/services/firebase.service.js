'use strict';

var firebase 					= require('firebase')
	, path 							= require('path');

var service = {};
service.findPost = findPost;
service.findPosts = findPosts;
service.findPostsByCategory = findPostsByCategory;
service.findPostsByAuthor = findPostsByAuthor;
service.createPost = createPost;
service.publishPost = publishPost;
service.unPublishPost = unPublishPost;
service.updatePost = updatePost;
service.deletePost = deletePost;
service.assignAuthorToPost = assignAuthorToPost;
service.unassignAuthorFromPost = unassignAuthorFromPost;

service.findAuthor = findAuthor;
service.findAuthors = findAuthors;
service.createAuthor = createAuthor;
service.updateAuthor = updateAuthor;
service.deleteAuthor = deleteAuthor;

service.getCategories = getCategories;

module.exports = service;

var helperService   	= require('./helper.service');

function findPost(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var fields = info.fields;
	ref.child(refrence).once('value', function(snap) {
		if(snap.val()) {
			var post = snap.val();
			if(fields.length) {
				var postkeys = Object.keys(post);
				var deletekeys = postkeys.diff(fields);
				post = helperService.excludeKeys(post, deletekeys)
			}
			post.id = snap.key
			callback(null, {code: 200, value: post})
		}
		else {
			callback({code: 400, value: 'invalidId'}, null)
		}
	})
}

function findPosts(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var queryParam = info.queryParam;
	var fields = info.fields;
	queryParam.limit = queryParam.limit+1;
	var postQuery = ref.child(refrence)
	if(queryParam.nextKey)
		postQuery = postQuery.endAt(null, queryParam.nextKey).limitToLast(queryParam.limit);
	else
		postQuery = postQuery.limitToLast(queryParam.limit);

	postQuery.once('value', function(snap) {
		var posts = snap.val();
		var response = {code:200, value: []}
		if(posts) {
			var keys = Object.keys(posts)
			keys.reverse()
			if(keys.length == queryParam.limit) {
				response.nextKey = keys[keys.length-1]
				keys.pop();
			}
			for(var i=0; i<keys.length;i++) {
				var post = posts[keys[i]];
				delete post.unpublishedKey
				if(fields.length) {
					var postkeys = Object.keys(post);
					var commonKeys = postkeys.common(fields);
					post = helperService.includeKeys(post, commonKeys);
				}
				post.id = keys[i];
				response.value.push(post)
			}
			callback(null, response)
		}
		else {
			callback(null, response)
		}
	})
}

function findPostsByCategory(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var queryParam = info.queryParam;
	var fields = info.fields;
	var postQuery = ref.child(refrence)
	queryParam.category = helperService.trim(queryParam.category.toLowerCase());
	postQuery = postQuery.orderByChild("category").equalTo(queryParam.category)

	postQuery.once('value', function(snap) {
		var posts = snap.val();
		var response = {code:200, value: []}
		if(posts) {
			var keys = Object.keys(posts)
			keys.reverse()
			for(var i=0; i<keys.length;i++) {
				var post = posts[keys[i]];
				delete post.unpublishedKey
				if(fields.length) {
					var postkeys = Object.keys(post);
					var commonKeys = postkeys.common(fields);
					post = helperService.includeKeys(commonKeys);
				}
				post.id = keys[i];
				response.value.push(post)
			}
			callback(null, response)
		}
		else {
			callback(null, response)
		}
	})
}

function findPostsByAuthor(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var queryParam = info.queryParam;
	var fields = info.fields;
	var postQuery = ref.child(refrence).orderByChild("author/id").equalTo(queryParam.authorId)

	postQuery.once('value', function(snap) {
		var posts = snap.val();
		var response = {code: 200, value: []}
		if(posts) {
			var keys = Object.keys(posts)
			keys.reverse()
			for(var i=0; i<keys.length;i++) {
				var post = posts[keys[i]];
				delete post.unpublishedKey
				if(fields.length) {
					var postkeys = Object.keys(post);
					var commonKeys = postkeys.common(fields);
					post = helperService.includeKeys(commonKeys);
				}
				post.id = keys[i];
				response.value.push(post)
			}
			callback(null, response)
		}
		else {
			callback(null, response)
		}
	})
}

function createPost(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var value = info.value;
	var key = info.key;
	if(!key)
		key = ref.child(refrence).push().key;
	var state = "unpublished"
	if(refrence == "posts/published")
		state = "published"
	var fanOut = info.fanOut || {};
	fanOut[refrence+'/'+key] = value;
	if(value.author) {
		fanOut['author_posts/'+value.author.id+'/'+key] = state
	}
	fanOut['categories/'+key] = {name: value.category, state: state};
	ref.update(fanOut, function(error) {
		if(error) {
			callback({code: 400, value: 'invalidId'}, null)
		}
		else {
			value.id = key;
			callback(null, {code: 200, value: value})
		}
	})
}

function publishPost(info, callback) {
	var ref = info.ref
	var id = info.id;
	var currentTime = Date.now();
	info.value.publishedAt = currentTime;
	info.value.modifiedAt = currentTime;
	info.value.unpublishedKey = info.id
	info.refrence = 'posts/published';
	info.fanOut = {};
	info.fanOut["posts/unpublished/"+id] = null;
	info.fanOut["categories/"+id] = null;
	if(info.value.author)
		info.fanOut['author_posts/'+info.value.author.id+'/'+id] = null
	createPost(info, function(error, response) {
		if(error) {
			callback(null, error)
		}
		else {
			response.value = response.value.id
			callback(null, response)
		}
	})
}

function unPublishPost(info, callback) {
	var ref = info.ref
	var id = info.id;
	var currentTime = Date.now();
	delete info.value.publishedAt
	info.value.modifiedAt = currentTime;
	info.refrence = 'posts/unpublished';
	if(info.value.unpublishedKey)
		info.key = info.value.unpublishedKey;
	info.fanOut = {}
	info.fanOut["posts/published/"+id] = null;
	info.fanOut["categories/"+id] = null;
	if(info.value.author)
		info.fanOut['author_posts/'+info.value.author.id+'/'+id] = null
	delete info.value.unpublishedKey

	createPost(info, function(error, response) {
		if(error) {
			callback(null, error)
		}
		else {
			response.value = response.value.id
			callback(null, response)
		}
	})
}

function updatePost(info, callback) {
	var ref = info.ref
	var value = info.updateInfo;
	value.modifiedAt = Date.now();
	var refrence = info.refrence;
	ref.child(refrence).once('value', function(snap) {
		if(snap.val()) {
			if(value.category) {
				var fanOut = {}
				for(var key in value) {
					fanOut[refrence+'/'+key] = value[key]
				}
				fanOut['categories/'+info.id+'/name'] = value.category
				ref.update(fanOut, function(error, response) {
					if(error) {
						callback({code: 500, value: error}, null)
					}
					else {
						callback(null, {code: 200, value: value})
					}
				})
			}
			else {
				ref.child(refrence).update(value, function(error, response) {
					if(error) {
						callback({code: 500, value: error}, null)
					}
					else {
						callback(null, {code: 200, value:value})
					}
				})
			}
		}
		else {
			callback({code: 400, value: "invalidId"}, null)
		}
	})
}

function deletePost(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var fanOut = {};
	fanOut[refrence] = null
	ref.child(refrence).once('value', function(snap) {
		var value = snap.val()
		if(value && value.author) {
			fanOut['author_posts/'+value.author.id+'/'+info.queryParam.id] = null
		}
		fanOut['categories/'+info.queryParam.id] = null;
		ref.update(fanOut, function(error) {
			if(error) 
				callback({code: 500, value: error},  null)
			else 
				callback(null, {code: 200})
		})
	})
}

function unassignAuthorFromPost(info, callback) {
	var ref = info.ref;
	var queryParam = info.queryParam;
	var refrence = info.refrence;
	var fanOut = {};
	fanOut[refrence+'/'+queryParam.id+'/author'] = null;
	fanOut["author_posts/"+queryParam.authorId+'/'+queryParam.id] = null;
	ref.update(fanOut, function(error, value) {
		if(error) {
			callback({code: 500, value: error}, null)
		}
		else {
			callback(null, {code: 200})
		}
	})
}

function assignAuthorToPost(info, callback) {
	var ref = info.ref;
	var queryParam = info.queryParam;
	var refrence = info.refrence;
	var fanOut = {};
	fanOut[refrence+'/'+queryParam.id+'/author'] = info.authorDetail;
	fanOut["author_posts/"+queryParam.authorId+'/'+queryParam.id] = queryParam.state;
	if(queryParam.previousAuthorId) {
		fanOut["author_posts/"+queryParam.previousAuthorId+'/'+queryParam.id] = null;
	}

	ref.update(fanOut, function(error, value) {
		if(error) {
			callback({code: 500, value: error}, null)
		}
		else {
			callback(null, {code: 200})
		}
	})
}

// Author

function findAuthor(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var fields = info.fields;
	ref.child(refrence).once('value', function(snap) {
		if(snap.val()) {
			var author = snap.val();
			if(fields.length) {
				var authorKeys = Object.keys(author);
				var deletekeys = authorKeys.diff(fields);
				author = helperService.excludeKeys(author, deletekeys)
			}
			author.id = snap.key
			callback(null, {code: 200, value: author})
		}
		else {
			callback({code: 400, value: "invalidId"}, null)
		}
	})
}

function findAuthors(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var queryParam = info.queryParam;
	var fields = info.fields;
	var authorQuery = ref.child(refrence)
	if(queryParam.nextKey)
		authorQuery = authorQuery.endAt(null, queryParam.nextKey)
	if(queryParam.limit) {
		queryParam.limit = queryParam.limit + 1;
		authorQuery.limitToLast(queryParam.limit);
	}
	authorQuery.once('value', function(snap) {
		var authors = snap.val();
		var response = {code:200, value: []}
		if(authors) {
			var keys = Object.keys(authors)
			keys.reverse()
			if(queryParam.limit && keys.length == queryParam.limit) {
				response.nextKey = keys[keys.length-1]
				keys.pop();
			}
			for(var i=0; i<keys.length;i++) {
				var author = authors[keys[i]];
				if(fields.length) {
					var authorKeys = Object.keys(author);
					var commonKeys = authorKeys.common(fields);
					author = helperService.includeKeys(author, commonKeys);
				}
				author.id = keys[i];
				response.value.push(author)
			}
			callback(null, response)
		}
		else {
			callback(null, response)
		}
	})
}

function createAuthor(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var value = info.value;
	var key = ref.child(refrence).push().key;
	ref.child(refrence+'/'+key).setWithPriority(value, value.createdAt, function(error) {
		if(error) {
			callback({code: 500, value: error}, null)
		}
		else {
			value.id = key;
			callback(null, {code: 200, value: value})
		}
	})
}

function updateAuthor(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var value = info.value;
	var fanOut = {};
	var response = {};
	for(var key in value) {
		var val = (value[key] == "" ? null : value[key])
		fanOut[refrence+'/'+key] = val
		response[key] = val
	}
	if(value.name || value.about || value.thumbnail || value.thumbnail == "") {
		ref.child('author_posts/'+info.id).once('value', function(snap) {
			var posts = snap.val();
			if(posts) {
				for(var key in posts) {
					if(value.name)
						fanOut['posts/'+posts[key]+'/'+key+'/author/name'] = value.name 
					if(value.about)
						fanOut['posts/'+posts[key]+'/'+key+'/author/about'] = value.about
					if(value.thumbnail || value.thumbnail == "")
						fanOut['posts/'+posts[key]+'/'+key+'/author/thumbnail'] = (value.thumbnail == "" ? null : value.thumbnail)
				}
			}
			ref.update(fanOut, function(error) {
				if(error) {
					callback({code: 500, value: error}, null)
				}
				else {
					callback(null, {code: 200, value: response})
				}
			})
		})
	}
	else {
		ref.update(fanOut, function(error) {
			if(error) {
				callback({code: 500, value: error}, null)
			}
			else {
				callback(null, {code: 200, value: response})
			}
		})
	}
}

function deleteAuthor(info, callback) {
	var ref = info.ref
	var refrence = info.refrence;
	var queryParam = info.queryParam;
	var fanOut = {};
	fanOut['authors/'+queryParam.id] = null
	ref.child('author_posts/'+queryParam.id).once('value', function(snap) {
		var value = snap.val()
		var keys = []
		if(value)
			keys = Object.keys(snap.val());
		fanOut['author_posts/'+queryParam.id] = null
		for(var i=0; i<keys.length; i++) {
			fanOut['posts/'+value[keys[i]]+'/'+keys[i]+'/author'] = null
		}
		ref.update(fanOut, function(error) {
			if(error) {
				callback({code: 500, value: error}, null)
			}
			else {
				callback(null, {code: 200})
			}
		})
	})
}

// Categories 
function getCategories(info, callback) {
	var ref = info.ref;
	ref.child('categories').orderByChild("state").equalTo(info.state).once('value', function(snap) {
		if(snap.val()) {
			callback(null, snap.val())
		}
		else {
			callback(null, {})
		}
	})
}
