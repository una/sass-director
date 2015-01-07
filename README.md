sass-director
=============

An app that generates a shell script to build a directory structure based on your Sass manifest file.

Test file is from sass-guidlin.es

```scss
@import "vendors/bootstrap";
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
@import "themes/admin";
```

after basics are working
---
- [ ] ' or "
- [ ] choose .sass or .scss
- [ ] make interface pretty
- [ ] Option to add '_'