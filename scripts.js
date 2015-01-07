// split a string to get text between before & after characters
// Usage  var word = 'the unicorns rule the world'.between('the ',' rule');
// --> word = 'unicorns';
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
      extension = '.scss', //temp
      lastDir = '',
      currentDir = '',
      currentFile = '',
      finalOutput = '',
      underscore = '_',
      outputPlatter = document.getElementById('output-text'),
      i; //blank if underscore is false

  // Get the input here
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array
  for(var i = 0; i < lines.length; i++) {
    currentDir = between(lines[i],'"', '/'); //get the directory this line refers to
    currentFile = between(lines[i],'/', '"'); //get file created in this line

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
  outputPlatter.value = finalOutput;
}

