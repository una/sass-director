// split a string to get text between before & after characters
var i = 0;

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

var n = 0;

function printFolders(obj) {
  // for (var baseDir in sassFiles) { //for all of the baseDirs
  //   console.log('mkdir', baseDir, 'cd ', baseDir);
  //   var obj = sassFiles[baseDir];
    for (var prop in obj) {
      // console.log('mkdir ' + prop, 'cd ', prop ); //these are the base props
      // var obj = obj[prop];
      console.log('obj: ' + obj, 'prop: ' + prop, 'obj[prop]: ', obj[prop]); //obj[prop] is each subfolder
      // if (obj.hasOwnProperty(prop)) {
        if (prop === 'files' && obj.files != null) {
          for (i; i < obj.files.length; i++) {
            console.log('touch ' + obj.files[i]);
          }
        }
        else if (prop === 'subDirs') {
          n++;
          console.log('recurse', n);
          for (i; i < obj.subDirs.length; i++) {
            console.log('touch ' + obj.subDirs[i]);
            // printFolders(obj);
          }
        }


        // console.log(prop + " = " + obj[prop])
      }
    // }

    // if (prop.files != null) {
    //   for (file in prop.files) {
    //     console.log(file);
    //   }
    // }
  // }
  //end of one full iteration -- CD to base & recurse
}

//printFolders(folderStructure);

// http://stackoverflow.com/questions/4632264/jquery-and-iterating-on-json-objects
var depthCount = 0;

function dig(obj, depth) {
  depth = depth || 0; // start at level zero
  for( var item in obj ) {
    if( typeof obj[item] === 'object' ) { //its a subDir, keep going
      if ( item !== 'subDirs' && item !== 'files') {
        console.log('mkdir & cd into', item);
        depthCount++;
      }
      if( Array.isArray(obj[item]) ) { //if its an array, its the folders
        for (i = 0; i < obj[item].length; i++) {
          console.log('touch ', obj[item][i]);
        }
        console.log('cd ../');
        depthCount--;
      }

      dig( obj[item], ++depth); // descending here (recursion)
    }
    else {
      for (i=0; i<depthCount; i++) {
        console.log('cd ../');
      }
    }
  }
}

//console.log( dig( folderStructure ) );

dig(folderStructure);











