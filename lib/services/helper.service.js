'use strict';

var service = {};

service.generateFieldsArr = generateFieldsArr;
service.generateFieldsDict = generateFieldsDict;
service.excludeKeys = excludeKeys;
service.trim = trim;
service.includeKeys = includeKeys;

module.exports = service;

Array.prototype.common = function(arr) {
  return this.filter(function(i) {return arr.indexOf(i) > -1});
}

Array.prototype.diff = function(arr) {
  return this.filter(function(i) {return arr.indexOf(i) < 0});
}

function excludeKeys(obj, arr) {
	for(var i=0; i<arr.length; i++) {
		if(obj.hasOwnProperty(arr[i])) {
			delete obj[arr[i]]
		}
	}
	return obj
}

function includeKeys(obj, arr) {
	for(var key in obj) {
		if(arr.indexOf(key) < 0) {
			delete obj[key]
		}
	}
	return obj
}

function generateFieldsArr(str) {
	if(str) {
		str = str.split(',');
		for(var i=0; i<str.length; i++) {
			str[i] = trim(str[i])
		}
		return str
	}
	else {
		return []
	}
}

function generateFieldsDict(str) {
	if(str) {
		str = str.replace(',');
		var info = {}
		for(var i=0; i<str.length; i++) {
			info[trim(str[i])] = 1	
		}
		return info
	}
	else {
		return null
	}
}

function trim(str) {
	if(str) { 
		str = str.replace(/\s+/g,' ').trim();
	}
	return str;
}