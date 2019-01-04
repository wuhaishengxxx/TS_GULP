TypeScript Filesort
===================

A node module which aims to provide a sorted array of TS source file.

# Installing 

npm install typescript-filesort

# Options

- options.files an array of file path.
- options.normalize : it will normalize all file path using the `path` node module
- options.compiler : let you pass options to the TS compiler. The default one is noLib

# Usage

```
var tsFilesort = require('typescript-filesort);
var glob = require('glob');


glob('src/**/*.ts', function(err, inputFiles) {
  var sortedFiles = tsFilesort({files:inputFiles});

  sortedFiles.forEach(function(sortedFile) {
    console.log("=>" + sortedFile);
  });
});
```
