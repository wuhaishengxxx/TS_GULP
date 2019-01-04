var typescript = require('typescript');
var path = require('path');
var cloneExtend = require('cloneextend');

//Will not bother to normalize file paths and filter out external references
var defaultOptions = {
  normalize:true, 
  files: [],
  compiler: {
    noLib:true
  }
};

var filesort = function(givenOptions) {

  var options =  cloneExtend.add(givenOptions,defaultOptions);


  var targetedFiles = [];

  if (!options.normalize) {
    targetedFiles = options.files;
  }
  else {
    options.files.forEach(function(file) {
      targetedFiles.push(path.normalize(file));
    });
  }

  //Gives files to the compiler
  var host = typescript.createCompilerHost(options.compiler);
  var program = typescript.createProgram(targetedFiles,options.compiler, host);

  /**
   * retrieve sorted files
   * which seems to not be normalized on windows (come back
   * with '/' and not '\')
   */
  var sortedFiles = program.getSourceFiles();


  var result = [];

  sortedFiles.forEach(function(sourceFile) {
    if(!options.normalize) {
      result.push(sourceFile.filename);
    }
    else {
      result.push(path.normalize(sourceFile.filename));
    }
  });

  return result;
}

module.exports = filesort;