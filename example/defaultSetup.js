var express = require('express')
	, app = express()
  , firebase = require('firebase')
	, path = require('path');

var firebaseApp = firebase.initializeApp({
  serviceAccount: path.join(__dirname, '..', 'keys.json'),
  databaseURL: "https://rimer-43120.firebaseio.com/"
});

var ref = firebase.database(firebaseApp).ref()

var Rimer = require('../lib/rimer')
var rimer = Rimer({ref: ref, postLimit:2})
rimer.init()

/*
	*****************
		POST SERVICES 
	*****************
*/

/* 
	Service : create
	Description : Add Post To Unpublish section
	- You must specify a value for these properties in snippet.body:
		title: String
		preview: String
		category: String
		tags: String (Comma seperated values)
	- You may specify a value for these properties in snippet.body:
		postType: String
		images: String (Comma seperated values)
		thumbnail: String
	Success : JSON
		{code: Number, post:JSON}
*/

function createPost() {
	var body = {
		title: '03',
    description: '03 Description',
    images: 'https://s-media-cache-ak0.pinimg.com/736x/00/1e/3c/001e3ca5a2e822f450395b9270d2a1e2.jpg,https://lh4.ggpht.com/psXc8z13fQEJhHfNknerJpxAkTrmgdCDPkFcQRUxRXMCh3vVjKgN-McL3FO-hHYoOAg=h900',
    thumbnail: 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAAAAAA/OixOH_h84Po/photo.jpg',
    category: 'testodd',
    authorId: "-K_W_cxqkjGVo8zEfLUc",
    postType: 'text',
    tags: 'test,oddprefix,03',
    preview: 'Its 03 Post Preview'
  }
  var snippet = {
  	body: body
  }
  rimer.post.create(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// createPost()

/*
	Service : update
	Description : Update Post Detail.
	- snippet.query:
		id: String (required)
		published: Boolean (default: true)
	- You may specify a value for these properties in snippet.body:
		title: String (should be non empty)
		preview: String (should be non empty)
		category: String (should be non empty)
		postType: String (should be non empty)
		tags: String (Comma seperated values should be non empty)
		description: String (to delete existing value set "")
		images: String (Comma seperated values, to delete existing values set "")
		thumbnail: String (to delete existing values set "")
	Success : JSON
		{code: Number, value:JSON}
*/

function updatePost() {
	var body = {
		title : "02 title",
		preview: '02 Testing preview',
		images: "",
    thumbnail: 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAAAAAA/OixOH_h84Po/photo.jpg'
  }
  var snippet = {
  	query: {id: "-K_WQGtSVWGvojZurWDJ", published: false},
  	body: body
  }
  rimer.post.update(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// updatePost()

/*
	Service : publish
	Description : Change state of post to publish.
	- snippet.query:
		id: String (required)
*/

function publishPost() {
	var snippet = {
		query: {id: "-K_WiVsBM0y1ioFwP-uX"}
	}
	rimer.post.publish(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// publishPost()

/*
	Service : unpublish
	Description : Change state of post to unpublish.
	- snippet.query:
		id: String (required)
*/

function unpublishPost() {
	var snippet = {
		query: {id: "-K_WhBCPpnVJPnyYD-Cf"}
	}
	rimer.post.unpublish(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// unpublishPost()
/*
	Service : findOne
	Description : Get Post By Id
	- snippet.query:
		id: String (required)
		published: Boolean (default: true)
	- snippet.fields : Comma seperated value of valid keys of a post or all data if not added in snippet
	-Success: JSON of post detail
*/

function getPostById() {
	var snippet = {
		query: {"id": "-K_W8zLX65ktmaKwf1Yx", published: false},
		fields: "title,category,thumbnail"
	}
	rimer.post.findOne(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getPostById()

/*
	Service : find
	Description : Get Posts
	- snippet.query:
		published: Boolean (default: true)
		cursor: JSON (For pagination)
	- snippet.fields : Comma seperated value of valid keys to return in each post or all data if not added in snippet
	Success: JSON
		results : Array result of post
		cursor : JSON to be added to get next set of data
*/

function getPosts() {
	var snippet = {
		query : {},
		fields: "title,category,thumbnail"
	}
	// for unpublished
	// snippet.query = {published: false, nextKey: '-K_W8zLX65ktmaKwf1Yx'}

	rimer.post.find(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getPosts()

/*
	Service : findByCategory
	Description : Get Published Post By Category Name
	- snippet.query:
		category: String
	- snippet.fields : Comma seperated value of valid keys to return in each post or all data if not added in snippet
	Success: 
		results : Array result of post
*/

function getPostsByCategory() {
	var snippet = {
		query: {category: "testodd"}
	}
	rimer.post.findByCategory(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getPostsByCategory()

/*
	Service : findByAuthor
	Description : Get Published Post By Author id
	- snippet.query:
		authorId: String
	- snippet.fields : Comma seperated value of valid keys to return in each post or all data if not added in snippet
	Success: 
		results : Array result of post
*/

function getPostsByAuthor() {
	var snippet = {
		query: {authorId: "-K_W_cxqkjGVo8zEfLUc"}
	}
	rimer.post.findByAuthor(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getPostsByAuthor()

/*
	Service : assignAuthor
	Description : Add author refrence to a post
	- snippet.query:
		id: String (Post Id)
		authorId: String (Author Id to assign)
		published: Boolean (default true)
	Success: value is String
*/

function assignAuthor() {
	var snippet = {
		query: {id: "-K_WonIe_j7iSm-WeyC8", authorId: "-K_W_cxqkjGVo8zEfLUc"}
	}
	rimer.post.assignAuthor(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// assignAuthor();

/*
	Service : unassignAuthor
	Description : Remove author refrence from post
	- snippet.query:
		id: String (Post Id)
		published: Boolean (default true)
	Success: value is String
*/

function unassignAuthor() {
	var snippet = {
		query: {id: "-K_WQGtSVWGvojZurWDJ", published: false}
	}
	rimer.post.unassignAuthor(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// unassignAuthor()

/*
	Service : delete
	Description : Delete Post By Id
	- snippet.query:
		id: Post Id
		published: Boolean (default: true)
	Success: String (Post Id)
*/

function deletePost() {
	var snippet = {
		query : {
			// published: false,
			id: "-K_WonIe_j7iSm-WeyC8"
		}
	}

	rimer.post.delete(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// deletePost()


/*
	*********************
		CATEGORY SERVICES 
	*********************
*/

/*
	Service : find
	Description : Get all categories in published section
	- snippet JSON
	Success: Array of categories with number of posts in each category
*/

function getCategories() {
	rimer.category.find(function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getCategories()

/*
	*******************
		AUTHOR SERVICES 
	*******************
*/

/*
	Service : createAuthor
	Description : Add author details to associate with a post
	- You must specify a value for these properties in snippet.body:
		name: String
		about: String
	- You may specify a value for these properties in snippet.body:
		thumbnail: String
		image: String
		facebook: String
		twitter: String
		snapchat: String
		instagram: String
		other: String
	Success Return : JSON with created author data
*/

function createAuthor() {
	var body = {
		name: 'Testing-new',
    about: 'Working',
    thumbnail: 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAAAAAA/OixOH_h84Po/photo.jpg',
    image: 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAAAAAA/OixOH_h84Po/photo.jpg',
    facebook: '       ',
    twitter: "twitter1.com",
    instagram: 'instagram1.com',
    snapchat: 'snapchat_handle1',
    other: 'mywebsite1.com'
  }
  var snippet = {
  	body: body
  }
  rimer.author.create(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// createAuthor();

/*
	Service : update
	Description : Update Post Detail.
	- snippet.query:
		id: String (required)
	- You may specify a value for these properties in snippet.body:
		name: String (should be non empty)
		about: String (should be non empty)
		thumbnail: String (to delete existing value set "")
		image: String (to delete existing value set "")
		facebook: String (to delete existing value set "")
		twitter: String (to delete existing value set "")
		snapchat: String (to delete existing value set "")
		instagram: String (to delete existing value set "")
		other: String (to delete existing value set "")
	Success Return : JSON with updated author fields
*/
function updateAuthor() {
	var snippet = {
		query: {"id": "-K_W_cxqkjGVo8zEfLUc"},
		body: {
    	thumbnail: 'abcd',
			// twitter: "twiiter.com/test"
		}
	}

	rimer.author.update(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// updateAuthor()

/*
	Service : delete
	Description : Delete Author By Id. This will delte all the existing refrence of author in post also.
	- snippet.query:
		id: Post Id
		published: Boolean (default: true)
	Success: String
*/

function deleteAuthor() {
	var snippet = {
		query: {"id": "-K_W_cxqkjGVo8zEfLUc"}
	}
	rimer.author.delete(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// deleteAuthor()

/*
	Service : findOne
	Description : Get Author By Id
	- snippet.query:
		id: String (required)
	- snippet.fields : Comma seperated value of valid keys of a author or all data if not added in snippet
	-Success: JSON of author detail
*/

function getAuthorById() {
	var snippet = {
		query: {"id": "-K_W_cxqkjGVo8zEfLUc"},
		fields: "name,about,thumbnail,facebook"
	}
	rimer.author.findOne(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getAuthorById()

/*
	Service : find
	Description : Get All Authors
	- snippet.fields : Comma seperated value of valid keys to return in each author detail or all data if not added in snippet
	Success: JSON
		results : Array result of author
*/

function getAuthors() {
	var snippet = {
		fields: "name,about,thumbnail"
	}
	rimer.author.find(snippet, function(error, value) {
		if(error) {
			console.log(error)
		}
		else {
			console.log(value)
		}
	})
}
// getAuthors()


app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) { res.render('index'); });
app.listen(3000);