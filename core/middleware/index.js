var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var glob = require("glob-promise");
var path = require('path');

var fileToAST = require('./fileToAST');
var extractImports = require('./extractImports');

var ejs = require('ejs');

var specUtils = require(path.join(global.pathToApp,'core/lib/specUtils'));
var sourceJSUtils = require(path.join(global.pathToApp, 'core/lib/utils'));

var currentDir = path.dirname(__filename);

// Module configuration
var globalConfig = global.opts.plugins && global.opts.plugins.reactDependencies ? global.opts.plugins.reactDependencies : {};
var config = {
	enabled: true,
	componentPath: '*.jsx',
	parser: undefined,

	// Public object is exposed to Front-end via options API.
	public: {}
};
sourceJSUtils.extendOptions(config, globalConfig);

/*
* @param {object} req - Request object
* @param {object} res - Response object
* @param {function} next - The callback function
* */
var processRequest = function (req, res, next) {

	// Check if request is targeting Spec
	if (config.enabled && req.specData && (req.specData.info.role || 'spec') === 'spec') {
		var specPath = specUtils.getFullPathToSpec(req.path);
		var componentPath = req.specData.info.main || config.componentPath;
		var templatePath = path.join(currentDir, '../templates/dependencies.ejs');

		var dependencyList = Promise.try(function() {
			return glob(componentPath, {
				cwd: specPath,
				realpath: true
			});
		}).then(function(filePaths) {
			return filePaths[0];
		}).then(function(filePath) {
			return fileToAST(filePath, config.parser);
		}).then(function(ast) {
			return extractImports.extract(ast);
		}).catch(function(error) {
			console.warn('sourcejs-react-dependencies: error generating component dependencies', error);
		});

		var template = fs.readFileAsync(templatePath, 'utf-8').catch(function(error) {
			console.warn('sourcejs-react-dependencies: error loading template', error);
		});

		Promise.join(dependencyList, template, function(dependencies, template) {
			var dependenciesList = dependencies
				.map(function (item) {
					return {
						type: extractImports.detectImportType(item),
						name: item
					}
				})
				.sort(function(a, b) {
					return a.type < b.type;
				});

			req.specData.info.__dependenciesRAW = dependenciesList;
			req.specData.info.__dependenciesGROUPED = extractImports.groupSimilarTypes(dependencies);

			try {
				req.specData.info.__dependenciesHTML = ejs.render(template, {data: dependenciesList});
			} catch (error) {
				console.warn('sourcejs-react-dependencies: error rendering dependencies', error);
			}

		}).catch(function (error) {
			req.specData.info.__dependenciesRAW = [];
			req.specData.info.__dependenciesGROUPED = {};
			req.specData.info.__dependenciesHTML = 'Error preparing sourcejs-react-dependencies.'
		}).finally(function () {
			next();
		});
	} else {
		next();
	}
};

exports.process = processRequest;
