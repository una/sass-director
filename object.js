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
        subdirs: null
      }
    }
  }
};

function printFolders(sassFiles) {
  for (var baseDir in sassFiles) { //for all of the baseDirs
    console.log('mkdir ', baseDir);
    var obj = sassFiles[baseDir];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (prop == 'files') {
          console.log('touch' + obj[prop]);
        }
        if (prop == 'subDirs') {
          console.log('mkdir' + printFolders(obj[prop]));
          if (obj[prop] == null) {
            console.log('cd outta here');
          }
        }
        //console.log(prop + " = " + obj[prop])
      }
    }

    // if (prop.files != null) {
    //   for (file in prop.files) {
    //     console.log(file);
    //   }
    // }
  }
}

printFolders(folderStructure);
//between('hello', 'h','o');