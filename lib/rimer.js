var utils 	= require('./rimer/util.js')
	, service = require('./rimer/service')

function Rimer (options) {
	this.options = utils.createOptions(options);
	this.post = service.post(this);
	this.author = service.author(this);
	this.category = service.category(this);
}

module.exports = function (options) {
	return new Rimer(options);
};

Rimer.prototype.init = utils.method(utils.init)