
var services = {};
services.post = createPostServices;
services.author = createAuthorService;
services.category = createCategoryService;

module.exports = services;

var postService     = require('../services/post.service.js')
	, authorService   = require('../services/author.service.js')
	, categoryService = require('../services/category.service.js');

function createPostServices(rimer) {
	var post = {
		findOne: function(info, callback) {
			info = info || {};
			info.ref = rimer.options.ref;
			postService._findOne(info, function(error, response) {return callback(error, response)});
		},
		find: function(info, callback) {
			info = info || {}
			info.ref = rimer.options.ref;
			info.limit = +(rimer.options.postLimit);
			postService._find(info, function(error, response) {return callback(error, response)});
		},
		findByCategory: function(info, callback) {
			info = info || {}
			info.ref = rimer.options.ref;
			postService._findByCategory(info, function(error, response) {return callback(error, response)});
		},
		findByAuthor: function(info, callback) {
			info = info || {}
			info.ref = rimer.options.ref;
			postService._findByAuthor(info, function(error, response) {return callback(error, response)});
		},
		create: function(info, callback) {
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
		update: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._update(info, function(error, response) {return callback(error, response)});
		},
		delete: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._delete(info, function(error, response) {return callback(error, response)});
		},
		assignAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._assignAuthor(info, function(error, response) {return callback(error, response)})
		},
		unassignAuthor: function(info, callback) {
			info.ref = rimer.options.ref;
			postService._unassignAuthor(info, function(error, response) {return callback(error, response)})
		}
	}
	return post
}

function createAuthorService(rimer) {
	var author = {
		findOne: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._findOne(info, function(error, response) {return callback(error, response)});
		},
		find: function(info, callback) {
			info.ref = rimer.options.ref;
			info.limit = rimer.options.authorLimit;
			authorService._find(info, function(error, response) {return callback(error, response)});
		},
		create: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._create(info, function(error, response) {return callback(error, response)});
		},
		update: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._update(info, function(error, response) {return callback(error, response)});
		},
		delete: function(info, callback) {
			info.ref = rimer.options.ref;
			authorService._delete(info, function(error, response) {return callback(error, response)});
		}
	}
	return author;
}

function createCategoryService(rimer) {
	var category = {
		find: function(callback) {
			var info = {ref : rimer.options.ref}
			categoryService._findPublished(info, function(error, response) {return callback(error, response)})
		}
	}
	return category
}