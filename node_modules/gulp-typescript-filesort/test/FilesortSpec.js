var gulp = require('gulp');
var gutil = require('gulp-util');
var should = require('chai').should();

var tsFilesort = require('../.');

describe("typescript filesort", function() {
	it("should output files in correct order", function(done) {

		var resultArray = [];

		gulp.src('test/dataset1/**/*.ts')
		.pipe(tsFilesort())
		.on('data', function(file) {

			resultArray.push(file.relative);

		})
		.on('end', function() {
			resultArray.length.should.equal(6);

			resultArray.indexOf('core/Core.ts').should.be.above(resultArray.indexOf('core/ICore.ts'));
			resultArray.indexOf('module1/Module1.ts').should.be.above(resultArray.indexOf('core/Core.ts'));
			resultArray.indexOf('module1/Module1Element.ts').should.be.above(resultArray.indexOf('module1/Module1.ts'));
			resultArray.indexOf('module2/Module2.ts').should.be.above(resultArray.indexOf('module1/Module1.ts'));
			resultArray.indexOf('module2/Module2.ts').should.be.above(resultArray.indexOf('util/Math.ts'));
			
			done();
		});

	});

	it(
		"should work even with a reference file which will introduce a cyclec dependency",
		function(done) {

			var resultArray = [];

			gulp.src('test/dataset2/**/*.ts')
			.pipe(tsFilesort({}))
			.on('data', function(file) {
				resultArray.push(file.relative);
			})
			.on('end', function() {
				resultArray.indexOf('core/Core.ts').should.be.above(resultArray.indexOf('core/ICore.ts'));
				resultArray.indexOf('module1/Module1.ts').should.be.above(resultArray.indexOf('core/Core.ts'));
				resultArray.indexOf('module2/Module2.ts').should.be.above(resultArray.indexOf('module1/Module1.ts'));
				resultArray.indexOf('module2/Module2.ts').should.be.above(resultArray.indexOf('util/Math.ts'));
				resultArray.indexOf('module2/Module2.ts').should.be.below(resultArray.indexOf('amodule/amodule.ts'));
				done();
			});
		}
	);
})