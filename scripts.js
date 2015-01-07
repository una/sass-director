var inputText = '',
    extension = '.scss', //temp
    workingDir = '';

function getInput() {
  inputText = document.getElementById('input-text').value;
}

function doTheThing() {
  getInput();

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array
    for(var i = 0; i < lines.length; i++) {
      workingDir = lines[i].between('"', '/');
      console.log(lines[i], workingDir)
    }
}

/**
 * Usage  var you = 'hello you guys'.between('hello ',' guys');
 * you = 'you';
 * via http://snipplr.com/view/14074/
 */
String.prototype.between = function(prefix, suffix) {
  s = this;
  var i = s.indexOf(prefix);
  if (i >= 0) {
    s = s.substring(i + prefix.length);
  }
  else {
    return '';
  }
  if (suffix) {
    i = s.indexOf(suffix);
    if (i >= 0) {
      s = s.substring(0, i);
    }
    else {
      return '';
    }
  }
  return s;
}