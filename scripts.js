/*
* Pseudo Code:
*
* Input form action will provide an inputString
* .scss or .sass option will give a variable for file endings (hardcoded .scss for v1)
*
* var finalOutput = ""
* For each line of the inputString {
* Parse each line of string for the first '/'
* Read the word before that starting from '"' or "'"
* Store as var workingDir
* finalOutput += 'mkdir ' + workingDir + 'cd ' + workingDir +';'
* continue reading after '/'  until '"' or "'"
* save var as workingFile
* finalOutput += 'touch ' + 'workingFile' + ';'
* read next line
* if new word before '/' === workingDir
* continue reading after '/'  until ';'
* workingFile = new word
* finalOutput += 'touch ' + 'workingFile' + ';'
* if new word after / != workingDir
* Start again from line 5
*/

// mkdir vendors; cd vendors; touch bootstrap.scss; touch jquery-ui.scss; cd ../;
// mkdir utils; cd utils; touch variables.scss; touch functions.scss; touch mixins.scss

var inputString =
'@import "vendors/bootstrap";
@import "vendors/jquery-ui";

@import "utils/variables";
@import "utils/functions";
@import "utils/mixins";
@import "utils/placeholders";

@import "base/reset";
@import "base/typography";

@import "layout/navigation";
@import "layout/grid";
@import "layout/header";
@import "layout/footer";
@import "layout/sidebar";
@import "layout/forms";

@import "components/buttons";
@import "components/carousel";
@import "components/cover";
@import "components/dropdown";

@import "pages/home";
@import "pages/contact";

@import "themes/theme";
@import "themes/admin";';

console.log('hello');