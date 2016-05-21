var detective = require('detective-es6');

var detectImportType = function(definition) {
	switch(true) {
		case /\.css$/.test(definition):
			return 'css';
		case /^[a-z@0-9]/.test(definition):
			return 'npm';
		default:
			return 'module';
	}
};

var groupSimilarTypes = function(list) {
	return list.reduce(function(result, item) {
		var type = detectImportType(item);
		result[type].push(item);
		return result;
	}, {
		css: [],
		npm: [],
		module: []
	})
};

var extract = function(ast) {
	return detective(ast);
};

module.exports = {
	extract,
	detectImportType,
	groupSimilarTypes
};
