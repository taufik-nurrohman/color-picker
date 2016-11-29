Color Picker
============

> A simple color picker plugin written in pure JavaScript, for modern browsers.

Has support for touch events. Touchy… touchy…

[Demo and Documentation](https://tovic.github.io/color-picker)

~~~ .html
<!DOCTYPE html>
<html dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Test</title>
    <link href="color-picker.min.css" rel="stylesheet">
  </head>
  <body>
    <input type="text">
    <script src="color-picker.min.js"></script>
    <script>
    var picker = new CP(document.querySelector('input[type="text"]'));
    picker.on("change", function(color) {
        this.target.value = '#' + color;
    });
    </script>
  </body>
</html>
~~~