var extension = '.scss', //default
    underscore = '_'; //default

function getDirectoryNames(cleanNames) {
  //returns a string of sorted directory names seperated by spaces

  var repeatedDirNames = cleanNames.map(function(name) {
    //maps a name with the filename part removed (part after last slash)
    //or '' if the name is a filename (no slashes in the name)
    return name.substr(0, name.lastIndexOf('/')+1)
  });

  var dirNames = [];

  repeatedDirNames.sort().forEach(function(name, i, sortedDirNames) {
    //pushes unique directory names to dirNames array
    if (name != sortedDirNames[i-1] || sortedDirNames[i-1] == null)
      dirNames.push(name);
  });

  return dirNames.sort().join(' ').trim();
}

function getFileNames(cleanNames){
  //returns a string of sorted filenames seperated by spaces

  var fileNames = cleanNames.map(function(name){
    var file = name.substr(name.lastIndexOf('/')+1) || name;
    var path = name.substr(0, name.lastIndexOf('/')+1) || '';
    file = underscore + file + extension;
    return path + file;
  });

  return fileNames.sort().join(' ').trim();
}

function getCommand(cleanNames){
  //add commands to the directory/file names and don't forget a semicolon
  var dirCommand = 'mkdir ' + getDirectoryNames(cleanNames) + ';';
  var fileCommand = 'touch ' + getFileNames(cleanNames) + ';';

  return dirCommand + ' ' + fileCommand;
}

function doTheThing(inputText) {
  // Get the input & options here
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
  (!document.querySelector('input[name="underscore"]').checked) ? underscore = '' : underscore = '_';

  var lines = inputText.split('\n'); //split up the lines in the string into a lines array

  var cleanNames = [];

  for(i = 0; i < lines.length; i++) {
    if (lines[i].charAt(0) === '@') { //skip blank lines & comments
      var cutOut = lines[i].substr(9, lines[i].length-11); //cleaning up @import statement
      cleanNames.push(cutOut);
    }
  }
  document.getElementById('output-text').value = getCommand(cleanNames);
}
