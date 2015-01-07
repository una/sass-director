var inputText = '',
    extension = '.scss', //temp
    lastDir = '',
    currentDir = '',
    currentFile = '',
    finalOutput = '',
    underscore = '_'; //blank if underscore is false

// split a string to get text between before & after characters
// Usage  var you = 'hello you guys'.between('hello ',' guys');
// --> you = 'you';
// via http://snipplr.com/view/14074/
String.prototype.between = function(before, after) {
  s = this;
  var i = s.indexOf(before);
  if (i >= 0) {
    s = s.substring(i + before.length);
  }
  else {
    return '';
  }
  if (after) {
    i = s.indexOf(after);
    if (i >= 0) {
      s = s.substring(0, i);
    }
    else {
      return '';
    }
  }
  return s;
}

function getInput() {
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
}

function doTheThing() {
  getInput();
  //inputText = '@import "vendors/bootstrap";\n@import "vendors/jquery-ui";\n\n@import "utils/variables";\n@import "utils/functions";\n@import "utils/mixins";\n@import "utils/placeholders";';

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array
    for(var i = 0; i < lines.length; i++) {
      currentDir = lines[i].between('"', '/'); //get the directory this line refers to
      currentFile = lines[i].between('/', '"'); //get file created in this line

      if (lines[i].charAt(0) === '@') { //skip blank lines & comments
        if (currentDir === lastDir) { //if the current lines dir is the same as the last one
          finalOutput += 'touch ' + underscore + currentFile + extension + ';';
        }
        else { //if current dir != last one
          if (i > 0) { finalOutput += 'cd ../;' } //dont cd for the first line
           finalOutput += 'mkdir ' + currentDir + ';cd ' + currentDir +';' + 'touch ' + underscore + currentFile + extension + ';';
        }
      lastDir = currentDir;
      }
    }
    document.getElementById('output-text').value = finalOutput;
}

