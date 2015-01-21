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
mkdir utils;cd utils;touch _variables.scss;touch _functions.scss;touch _mixins.scss;touch _placeholders.scss;cd ../;mkdir base;cd base;touch _reset.scss;touch _typography.scss;cd ../;mkdir layout;cd layout;touch _navigation.scss;touch _grid.scss;touch _header.scss;touch _footer.scss;touch _sidebar.scss;touch _forms.scss;cd ../;mkdir components;cd components;touch _buttons.scss;touch _carousel.scss;touch _cover.scss;touch _dropdown.scss;cd ../;mkdir pages;cd pages;touch _home.scss;touch _contact.scss;cd ../;mkdir themes;cd themes;touch _theme.scss;touch _admin.scss;
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
touch _file1.scss;mkdir dir1;cd dir1;touch _file2.scss;mkdir dir2;cd dir2;touch _file3.scss;cd ../;cd ../;mkdir dir3;cd dir3;mkdir dir4;cd dir4;touch _file5.scss;cd ../;cd ../;
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

