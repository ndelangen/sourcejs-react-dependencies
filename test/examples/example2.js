var bluebird = require('bluebird');
var localModule = require('./module');
var localStyle = require('./module.css');

var example = 1;
var message = "An example loading a npm module, a local module and a css file";

module.exports = {
	npm: bluebird,
	module: localModule,
	css: localStyle
};
