// split a string to get text between before & after characters
var i = 0;

function between(input, before, after) {
  var i = input.indexOf(before);
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

function nth_ocurrence(str, thing, nth) {
  for (var i=0;i<str.length;i++) {
    if (str.charAt(i) == thing) {
        if (!--nth) {
           return i;
        }
    }
  }
  return false;
}

// Thank you @drinks!
var scaffoldPath = function (path, initial) {
  var blankObject = {
    files: null,
    subDirs: null
  };

  initial || (initial = JSON.parse(JSON.stringify(blankObject)));

  var finish = function (val, ref) {
    ref.files && ref.files.push(val) || (ref.files = [val]);
  };

  var parts = path.split('/');
  var val = parts.pop().replace(/\.scss$/, '');

  if (parts.length === 0) {
    finish(val, initial);
  }
  else {
    var ref = parts.reduce(function(accum, part, i) {
      accum.subDirs || (accum.subDirs = {});
      if (typeof accum.subDirs[part] === 'undefined') {
        accum.subDirs[part] = JSON.parse(JSON.stringify(blankObject));
      }
      return accum.subDirs[part];
    }, initial);
    finish(val, ref);
  }
  return initial;
};

// rest is mine:

function dir(file, subDir) {
  this.files = file;
  this.subDirs = subDir;
}

var extension = '.scss', //default
    finalObj = {},
    quotationStyle = '"',
    underscore = '_', //default
    currentDir,
    subdirs = 0,
    out;

var sample='@import "layout/navigation";\n@import "layout/meow/grid";\n@import "layout/meow/header";\n@import "layout/meow/2/footer";\n@import "layout/meow/2/sidebar";\n@import "layout/meow/2/forms";\n\n@import "components/buttons";\n@import "components/carousel";\n@import "components/cover";\n@import "components/dropdown";\n\n@import "pages/home";\n@import "pages/contact";\n\n@import "themes/theme";\n@import "themes/admin";';

function doTheThing() {
  // Get the input & options here
  // var inputText = sample;
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
  if (!document.querySelector('input[name="underscore"]').checked) { underscore = ''; }

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array

  for(i = 0; i < lines.length; i++) {
    subDirCount = ((lines[i]).match(/\//g) || []).length; //get # of subdirectories in the line

    if (lines[i].charAt(0) === '@') { //skip blank lines & comments
      var cutOut = lines[i].substr(9, lines[i].length-11); //.split('/'); //cleaning up @import statement to just inside the ""'s  and splitting it up by /

      out = scaffoldPath(cutOut, out);

          // if (n === cutOut.length-1) {
          //   console.log('i am the last file: _', cutOut[n], '.scss')
          // }
      }
    }
    console.log(out);
    readFiles(out);
    console.log(finalOutput);
    //document.getElementById('output-text').value = readFiles(out);
}

doTheThing();


// WOOHOO THIS SHIT WORKS:

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
var finalOutput = '';
var extension = '.scss'; //default
var underscore = '_'; //default
// var outputPlatter = document.getElementById('output-text');

function readFiles(obj) {
  for( var item in obj ) {
    if( typeof obj[item] === 'object' ) { //its a subDir, keep going
      if ( item !== 'subDirs' && item !== 'files') {
        //if its the last prop, cd back again
        lastDir = Object.keys(obj)[Object.keys(obj).length - 1]; //this is the last directory in the cluster
        thisItem = item;
        finalOutput += 'mkdir ' +  item + ';cd ' + item +';';
        depthCount++;
      }
      if( Array.isArray(obj[item]) ) { //if its an array, its the files
        for (var i = 0; i < obj[item].length; i++) {
          finalOutput += 'touch ' + underscore + obj[item][i] + extension + ';';
        }
        if( obj.subDirs == null ) { //you hit the end of the tree
          depthCount--;
          finalOutput += 'cd ../;';
          if(lastDir === thisItem) { //if its the last dir in the dir we're looping
            depthCount--;
            finalOutput += 'cd ../;';

            for(i=0; i<depthCount; i++) {
              depthCount--;
              finalOutput += 'cd ../;';
            }
          }
        }
      }
      readFiles(obj[item]); // recurse!
    }
  }
  // outputPlatter.value = finalOutput;
}



// readFiles(folderStructure);
// console.log(finalOutput);











