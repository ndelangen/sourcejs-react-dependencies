var SourceWalker = require('node-source-walk');

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
	var walker = new SourceWalker();
	var results = [];

	walker.walk(ast, function (node) {
		if (
			node.type !== 'ImportDeclaration' ||
			!node.source ||
			!node.source.value
		) {
			return;
		}

		results.push(node.source.value);
	});

	return results;
};

module.exports = {
	extract: extract,
	detectImportType: detectImportType,
	groupSimilarTypes: groupSimilarTypes
};
