Sass Director
=============

An app that generates a shell script to build a directory structure based on your Sass manifest file.

Test file is from sass-guidlin.es

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

```
mkdir utils;cd utils;touch _variables.scss;touch _functions.scss;touch _mixins.scss;touch _placeholders.scss;cd ../;mkdir base;cd base;touch _reset.scss;touch _typography.scss;cd ../;mkdir layout;cd layout;touch _navigation.scss;touch _grid.scss;touch _header.scss;touch _footer.scss;touch _sidebar.scss;touch _forms.scss;cd ../;mkdir components;cd components;touch _buttons.scss;touch _carousel.scss;touch _cover.scss;touch _dropdown.scss;cd ../;mkdir pages;cd pages;touch _home.scss;touch _contact.scss;cd ../;mkdir themes;cd themes;touch _theme.scss;touch _admin.scss;
```

Options
---

| Tables        | Options       | Default  |
| ------------- |:-------------:| --------:|
| Sass syntax   | .scss, .sass  | .scss    |
| File prefix   | _, no _       | use _    |

- .scss or .sass syntax (default is .scss)
- prefix files with "_" or not (default is prefix with "_")

TO-DO
---
- [x] quotation style ' or "
- [x] choose .sass or .scss
- [ ] make interface pretty
- [x] Option to add '_'
- [x] ignore comments