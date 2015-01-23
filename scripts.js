var i = 0,
    depthCount = 0,
    thisItem, lastDir,
    extension = '.scss', //default
    underscore = '_', //default
    out;

// Thank you @drinks for help with this function!
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

function readFiles(obj) {
  var finalOutput = '';
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
      finalOutput += readFiles(obj[item]); // recurse!
    }
  }
  return finalOutput;
}

function doTheThing() {
  out = '';
  // Get the input & options here
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
  if (!document.querySelector('input[name="underscore"]').checked) { underscore = ''; }

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array

  for(i = 0; i < lines.length; i++) {
    if (lines[i].charAt(0) === '@') { //skip blank lines & comments
      var cutOut = lines[i].substr(9, lines[i].length-11); //cleaning up @import statement
      out = scaffoldPath(cutOut, out);
    }
  }
  document.getElementById('output-text').value = readFiles(out);
}
