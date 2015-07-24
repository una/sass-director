Sass Director
=============

An app that generates a shell script to build a directory structure based on your Sass manifest file.

## Using the [Website](http://sassdirector.com)

Input:

```scss
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
@import "themes/admin";
```

Default Output:

```sh
mkdir base/ components/ layout/ pages/ themes/ utils/; touch base/_reset.scss base/_typography.scss components/_buttons.scss components/_carousel.scss components/_cover.scss components/_dropdown.scss layout/_footer.scss layout/_forms.scss layout/_grid.scss layout/_header.scss layout/_navigation.scss layout/_sidebar.scss pages/_contact.scss pages/_home.scss themes/_admin.scss themes/_theme.scss utils/_functions.scss utils/_mixins.scss utils/_placeholders.scss utils/_variables.scss;
```

It works for files in the same directory and multiple subdirectories:

Input:

```scss
@import 'file1';

@import 'dir1/file2';
@import 'dir1/dir2/file3';

@import 'dir3/dir4/file5';
```

Output:

```sh
mkdir dir1/ dir1/dir2/ dir3/dir4/; touch _file1.scss dir1/_file2.scss dir1/dir2/_file3.scss dir3/dir4/_file5.scss;
```

## Options

|               | Options       | Default  |
| ------------- | ------------- | -------- |
| Sass syntax   | .scss, .sass  | .scss    |
| File prefix   | _, no _       | use _    |

## Node Module

There is now a node module! To install, either simply type `npm install -g sass-director` or clone this repo and use the command `npm install -g`. Then you can use the following format to build your directories and files:

`sass-director <filename> <directory>`

For instance, if you are in the home directory and have created a `sass` folder, you can type `sass-director sass/main.scss sass`, or you can simply leave off the directory command when inside of the sass folder: `sass-director my-manifest.scss`.

TO-DO
---
- [x] quotation style ' or "
- [x] choose .sass or .scss
- [x] make interface pretty
- [x] Option to add '_'
- [x] ignore comments
- [x] allow for subdirectories
- [x] create cli so we can go `sass-director file-name.scss`
- [ ] Options for sass and underscore in node module
- [ ] Add shellscript docs
