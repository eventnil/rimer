
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

## Services
__1. Create Post__
```js
    var snippet = {
        body: JSON 
    }
    rimer.services.createPost(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.body valid keys
    
- title* : String 
- preview* : String (Short Decription of post)
- category* : String
- tags* : String (comma seperated values)
- images : String (comma sepearted value)
- thumbnail: String
- description: String (Body of post)

> response : JSON

- id*, title*, preview*, category*, thumbnail, description as string
- createdAt as integer (Timestamp in milliseconds)
- tags*, images as array

__2. Update Post__
```js
    var snippet = {
        query: JSON,
        body: JSON 
    }
    rimer.services.updatePost(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query valid keys
- id* : String (Post Id returned with post details)
- published : Boolean (default false indicating post is in unpublished state)

> snippet.body valid keys
- title, preview, category, thumbnail, description as string
- tags, images as string (comma seperated values)
- set optional valid keys in body as "" to remove that value from post

> response : JSON

- id* String (Post Id)
- raw JSON (updated values)

__3. Publish Post__
```js
    var snippet = {
        query: JSON 
    }
    rimer.services.publish(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* String (Post Id)
> response 
- String (Published Post Id)

__4. Unpublish Post__
```js
    var snippet = {
        query: JSON 
    }
    rimer.services.unpublish(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* String (Post Id)
> response 
- String ( unpublished post id)

__5. Get Post By Id__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.services.getPost(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- id* String (Post Id)
- published Boolean (default true determining state of post)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned
- any extra key not present in post will be null in response

__6. Get Posts__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Seperated Values)
    }
    rimer.services.getPosts(snippet, function(error, response) {
        if(error)
            console.log(error)
        else 
            console.log(response)
    })
```

> snippet.query
- published: Boolean (default true determining state of post)
- nextkey: String (Returned in previous response to return next set of post)

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned
- any extra key not present in post will be null in response

> response JSON
- results*: Array (Can be empty array if no post available)
- nextKey: String (Returned only if next set of data available)

__7. Delete Post__
```js
    var snippet = {
        query: JSON 
    }
    rimer.services.deletePost(snippet, function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```

> snippet.query
- id* String (Post Id)
- published Boolean (default set to true)

> response 
- String ( deleted post id)

__8. Get Published Categories__
```js
    rimer.services.getCategories(function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```
> response Array
- Each element in array is a json of name and count
- Can be empty if no published post availbale

__8. Get Published Posts By Category__
```js
    var snippet = {
        query*: JSON,
        fields: String(Comma Sepearted Values)
    }
    rimer.services.getPostsByCategory(function(error, response) {
        if(error)
            console.log(error)
        else
            console.log(response)
    })
```
> snippet.query
- category: String

> snippet.fields
- String (comma sepearted value of keys to be returned in each post)
- valid keys for post will only be returned
- any extra key not present in post will be null in response

> response JSON
- results*: Array