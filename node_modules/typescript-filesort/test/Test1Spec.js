var filesort = require('../.');
var glob = require('glob');
var path = require('path');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe(
  'sorting typescript file on first set',
  function() {
    it(
      "should give an array of file in correct order",
      function(done) {
        glob('test/dataset1/**/*.ts', function(err, files) {
          var sortedFiles = filesort({files:files});
          sortedFiles.indexOf(path.normalize('test/dataset1/module2/Module2.ts'))
          .should.be.above(sortedFiles.indexOf(path.normalize('test/dataset1/util/Math.ts')));
          done();
        });

      }
    );
    it(
      "should give an array of file in correct order using turbo mode",
      function(done) {
        glob('test/dataset1/**/*.ts', function(err, files) {
          var sortedFiles = filesort({files:files,normalize:false});
          sortedFiles.indexOf(path.normalize('test/dataset1/module2/Module2.ts'))
          .should.be.above(sortedFiles.indexOf(path.normalize('test/dataset1/util/Math.ts')));
          
          done();
        });

      }
    );
  }

);