// split a string to get text between before & after characters
//var i = 0;

function between(input, before, after) {
  i = input.indexOf(before);
  if (i >= 0) {
    input = input.substring(i + before.length);
  }
  else {
    return '';
  }
  if (after) {
    i = input.indexOf(after);
    if (i >= 0) {
      input = input.substring(0, i);
    }
    else {
      return '';
    }
  }
  return input;
}

//folderStructure object we want to get
var folderStructure = {
    files: null,
    subDirs: {
      dir1: {
        files: ['file1', 'file2'],
        subDirs: {
          'subDirA': {
            files: ['file3', 'file4'],
            subDirs: null
          },
          'subDirB': {
            files: ['file5'],
            subDirs: null
          }
        }
      },
      dir2: {
        files: ['hello'],
        subDirs: {
          'subdirC': {
            files: ['file6'],
            subDirs: {
              'moreA': {
                files: ['file3', 'file4'],
                subDirs: null
              },
              'moreB': {
                files: ['file5'],
                subDirs: null
              }
            }
          }
        }
      },
    dir3: {
      files: null,
      subDirs: {
        'subDirD': {
          files: ['file7'],
          subDirs: null
        }
      }
    }
  }
};

var depthCount = 0;
var thisItem, lastDir;
var finalText = '';
var extension = '.scss'; //default
var underscore = '_'; //default

function readFiles(obj) {
  for( var item in obj ) {
    if( typeof obj[item] === 'object' ) { //its a subDir, keep going
      if ( item !== 'subDirs' && item !== 'files') {
        //if its the last prop, cd back again
        lastDir = Object.keys(obj)[Object.keys(obj).length - 1]; //this is the last directory in the cluster
        thisItem = item;
        finalText += 'mkdir ' +  item + ';cd ' + item +';';
        depthCount++;
      }
      if( Array.isArray(obj[item]) ) { //if its an array, its the files
        for (var i = 0; i < obj[item].length; i++) {
          finalText += 'touch ' + underscore + obj[item][i] + extension + ';';
        }
        if( obj.subDirs == null ) { //you hit the end of the tree
          depthCount--;
          finalText += 'cd ../;';
          if(lastDir === thisItem) { //if its the last dir in the dir we're looping
            depthCount--;
            finalText += 'cd ../;';

            for(i=0; i<depthCount; i++) {
              depthCount--;
              finalText += 'cd ../;';
            }
          }
        }
      }
      readFiles(obj[item]); // recurse!
    }
  }
}

readFiles(folderStructure);
console.log(finalText);











