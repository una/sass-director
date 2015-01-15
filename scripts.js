// split a string to get text between before & after characters
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

function doTheThing() {
  var inputText = '',
      extension = '.scss', //default
      lastDir = '',
      currentDir = '',
      currentFile = '',
      currentPath = [],
      finalOutput = '',
      quotationStyle = '"',
      underscore = '_', //default
      outputPlatter = document.getElementById('output-text'),
      i;

  // Get the input & options here
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
  if (!document.querySelector('input[name="underscore"]').checked) {
    underscore = '';
  }

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array

  for(var i = 0; i < lines.length; i++) {
    if (lines[i].charAt(0) === '@') { //skip blank lines & comments

      quotationStyle = lines[i].charAt(8); //the first character after '@import ' is the quotation style
      currentPath = between(lines[i], quotationStyle, quotationStyle).split('/'); // get the full path to the file
      currentDir = currentPath.slice(0, -1).join('/'); //get the directory this line refers to
      currentFile = currentPath.pop(); //get file created in this line

      if (currentDir !== lastDir) {
        finalOutput += 'mkdir -p ' + currentDir + ';';
      }
      //if the current lines dir is the same as the last one
      finalOutput += 'touch ' + currentDir + '/' + underscore + currentFile + extension + ';';
    lastDir = currentDir;
    }
  }
  outputPlatter.value = finalOutput;
}
