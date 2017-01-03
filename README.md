
Rimer is a blog engine heavily influenced by [Poet](http://jsantell.github.io/poet/) and implemented with JavaScript for [node](http://nodejs.org) and [firebase](http://firebase.com).

## Install

```
$ npm install --save rimer
```

Once you have the **rimer** module in your app, just instantiate an instance with your Express app and options, and call the `init` method:

## Setup 
```js
var
  express = require('express'),
  firebase = require('firebase')
  Rimer = require('rimer'),
  app = express();
  
var firebaseApp = firebase.initializeApp({
  serviceAccount: "path_to_firebase_json",
  databaseURL: "****************************"
});
var ref = firebase.database(firebaseApp).ref()

var rimerOptions = {
    ref : ref,
    postLimit: 2 // default value 10
}
var rimer = Rimer(rimerOptions)
rimer.init()
```

## Responses and Error Codes

#### error : JSON
- error.code* : Number
- error.value* : String

#### response : JSON
- response.code* : Number
- response.value : Can be JSON, Array, String or null depending upon service type

#### Valid Code : 
```js
    code                                title
    200                                 Ok
    400                                 Invalid Request
    500                                 Module Error
```

## Post Services
__1. Create Post__
```js
    var snippet = {
        body: JSON 
    }
    rimer.post.create(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.body 
    
- title* : String 
- preview* : String (Short Decription of post)
- category* : String
- tags* : String (comma seperated values)
- images : String (comma sepearted value)
- thumbnail: String
- description: String (Body of post)

> response.value : JSON
- Created post data and id

__2. Update Post__
```js
    var snippet = {
        query: JSON,
        body: JSON 
    }
    rimer.post.update(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* : String (Post Id returned with post details)
- published : Boolean (default true indicating post is in published state)

> snippet.body
- title, preview, category, thumbnail, description as string
- tags, images as string (comma seperated values)
- set optional valid keys in body as "" to remove that value from post

> response.value : JSON
- Updated post raw data

__3. Publish Post__
```js
    var snippet = {
        query: JSON 
    }
    rimer.post.publish(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* String (Post Id)

> response.value : String
- Published Post Id

__4. Unpublish Post__
```js
    var snippet = {
        query: JSON 
    }
    rimer.post.unpublish(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query

- id* : String (Post Id)

> response.value : String
- Unpubublished Post Id

__5. Delete Post__
```js
    var snippet = {
        query: JSON 
    }
    rimer.post.delete(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* : String (Post Id)
- published : Boolean (default true indicating post is in published state)

__6. Get Post By Id__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.post.findOne(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- id* : String (Post Id)
- published : (default true indicating post is in published state)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned
- any extra key not present in post will be not available in response

> response.value : JSON
- Post Detail

__7. Get Posts__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.post.find(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- published : Boolean (default true indicating post is in published state)
- nextkey : String (Returned in previous response to return next set of post)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned
- any extra key not present in post will be null in response

> response.value: Array
- Array of post json (Can be empty array if no post available)
> response.nextKey: String 
- Returned only if next set of data available

__8. Get Posts By Category__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.post.findByCategory(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- category*: String (Post Id)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned

> response.value: Array
- Array of published post for a category (Can be empty array if no post available)

__9. Get Posts By Author__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.post.findByAuthor(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- authorId*: String (Author Id)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned

> response.value: Array
- Array of published post by an author (Can be empty array if no post available)

__10. Add Post Author__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.post.assignAuthor(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- id* : String (Post Id)
- authorId* : String (Author Id)
- published : Boolean (default true indicating post is in published state)

__11. Remove Post Author__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.post.unassignAuthor(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- id* : String (Post Id)
- authorId : String (Author Id)
- published : Boolean (default true indicating post is in published state)

## Author Services

__1. Create Author__
```js
    var snippet = {
        body: JSON 
    }
    rimer.author.create(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.body
    
- name* : String 
- about* : String (Short Decription of post)
- image : String 
- thumbnail: String
- facebook : String
- twitter: String 
- instagram: String 
- snapchat: String 
- other: String

> response.value : JSON

- Created author data and id

__2. Update Author__
```js
    var snippet = {
        query: JSON,
        body: JSON 
    }
    rimer.author.update(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* : String (Author Id returned with author deleteP)

> snippet.body
- name, about, image, thumbnail, facebook, twitter, instagram, snapchat, other as string
- set optional valid keys in body as "" to remove that value from author

> response.value : JSON
- Updated author raw data

__3. Delete Author__
```js
    var snippet = {
        query: JSON 
    }
    rimer.author.delete(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id*: String (Author Id)

__4. Get Author By Id__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.author.findOne(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- id* : String (Post Id)
- published : Boolean (default true indicating post is in published state)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for author will only be returned
- any extra key in fields not present in author will be not available in response

> response.value : JSON

- Deleting an author will remove all its refrence from posts

__5. Get Authors__
```js
    var snippet = {
        query: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.author.find(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```
> snippet.query : {}
> snippet.fields
- String (comma sepearted value of keys to be returned in each author detail)
- valid keys for author will only be returned
- any extra key not present in author will be null in response

> response.value : Array
- Array of author json (Can be empty array if no author available)

## Category Services

__1. Get Published Categories__
```js
    rimer.category.find(function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```
> response.value : Array
- Array of category json (Can be empty array if no author available)
- Each category is a json of name and count(total post in a particular category)
