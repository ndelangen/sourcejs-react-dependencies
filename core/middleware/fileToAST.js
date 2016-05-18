var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"))

var recast = require('recast');
var babylonParser = require('./babylonParser');


var parse = function(filePath, parser) {
	parser = parser || babylonParser;

	return Promise.try(function() {
    return fs.readFileAsync(filePath, 'utf-8');
  }).then(function(fileContents) {
    return recast.parse(fileContents, {esprima: parser});
  });
};

module.exports = parse;
