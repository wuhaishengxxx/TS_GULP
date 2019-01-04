var eventStream = require('event-stream');
var gutil = require('gulp-util');
var path = require('path');
var tsFilesort = require('typescript-filesort');

var PLUGIN_NAME = "gulp-typescript-filesort"

var defaultOptions = {
  verbose:false,
  compiler: {
    noLib:true
  }
};


var gulpTypescriptFilesort = function (givenOptions) {


  var options =  givenOptions || defaultOptions;


  /**
   * Will store each file you given using the glob using 
   * filesToHandle[<file path>] = <file>
   * in case of  huge number of files, it will eat a lot of RAM
   */
  var filesToHandle = {};


  //Store each file into the filesToHandle map.
  var onFile = function (file) {
      var filePath = path.normalize(file.path);
      if (options.verbose) {
          gutil.log('pushing  ' + filePath + ' into the map');
      }
      filesToHandle[filePath] = file;

  };


  var onEnd = function () {
    options.files = Object.keys(filesToHandle);

    //retrieve sorted files
    var result = tsFilesort(options);
    
    if (options.verbose) {
        gutil.log("retrieved " + result.length + " files");
    }
    

    result.forEach(function (sourceFile) {
      
      if (filesToHandle[sourceFile]) {
        if (options.verbose) {
            gutil.log('emitting ' + sourceFile);
        }
        this.emit('data', filesToHandle[sourceFile]);
      }
      else if(options.verbose) {
        gutil.log("skipping, file not found in my file handler map");
      }

    }.bind(this));

    this.emit('end');
  };

  return eventStream.through(onFile, onEnd);
};


module.exports = gulpTypescriptFilesort;