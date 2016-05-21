var assert = require('chai').assert;
var path = require('path');

var fileToAST = require('../core/middleware/fileToAST');
var extractImports = require('../core/middleware/extractImports');


var currentDir = path.dirname(__filename);
var examples = [
	'examples/example1.js',
	'examples/example2.js',
	'examples/example3.js',
	'examples/example4.js',
].map(function (item) {
	return path.join(currentDir, item);
});

describe('fileToAST', function() {
	examples.forEach(function (path, index) {
		it('should convert example' + (index + 1), function() {
			return fileToAST(path);
		});
	});
});

describe('extractImports', function() {
	var ast = fileToAST(examples[0]);

	describe('extract', function() {
    it('should detect imports and return them', function(done) {
      return ast.then(function (ast) {
				return extractImports.extract(ast);
			}).then(function (result) {
				assert.isArray(result, 'should be an Array');
				assert.equal(result.length, 3, 'should have a length of 3');
				done();
			});
    });
  });
	describe('detectImportType', function() {
    it('should return the type of a import', function(done) {
			var detect = extractImports.detectImportType;
			assert.equal(detect('should-be-npm'), 'npm', 'should be detected as npm');
			assert.equal(detect('@random/should-be-npm'), 'npm', 'should be detected as npm');
			assert.equal(detect('1should-be-npm'), 'npm', 'should be detected as npm');
			assert.equal(detect('./should-be-module'), 'module', 'should be detected as module');
			assert.equal(detect('../../../should-be-module'), 'module', 'should be detected as module');
			assert.equal(detect('/should-be-module'), 'module', 'should be detected as module');
			assert.equal(detect('./should-be-module.js'), 'module', 'should be detected as module');
			assert.equal(detect('./should-be-module.jsx'), 'module', 'should be detected as module');
			assert.equal(detect('./should-be-css.css'), 'css', 'should be detected as css');
			done();
    });
  });
	describe('groupSimilarTypes', function() {
    it('should transform flat array into multiple arrays', function(done) {
			return ast.then(function (ast) {
				return extractImports.extract(ast);
			}).then(function (result) {
				return extractImports.groupSimilarTypes(result);
			}).then(function (result) {

				assert.isObject(result, 'should be an Object');
				assert.property(result, 'css', 'should have a "css"-property');
				assert.property(result, 'npm', 'should have a "npm"-property');
				assert.property(result, 'module', 'should have a "module"-property');
				Object.keys(result).forEach(function (item) {
					assert.isArray(result[item], 'all property values should be arrays');
				});
				done();
			})
    });
  });
});
