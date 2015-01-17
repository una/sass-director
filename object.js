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
        files: null,
        subDirs: {
          'subdirC': {
            files: ['file6'],
            subDirs: null
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

function readFiles(obj) {
  for( var item in obj ) {
    if( typeof obj[item] === 'object' ) { //its a subDir, keep going
      if ( item !== 'subDirs' && item !== 'files') {
        console.log('mkdir & cd into', item);
        depthCount++;
      }
      if( Array.isArray(obj[item]) ) { //if its an array, its the folders
        for (var i = 0; i < obj[item].length; i++) {
          console.log('touch ', obj[item][i]);
        }
        if( obj.subDirs == null ) { //you hit the end of the tree
          console.log('cd ../');
        }
        depthCount--;
      }
      readFiles(obj[item]); // recurse!
    }
    else {
      for (i=0; i<depthCount; i++) {
        console.log('cd ../');
      }
    }
  }
}

//console.log( readFiles( folderStructure ) );

readFiles(folderStructure);











