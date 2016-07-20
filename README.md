Color Picker
============

> A simple color picker plugin in pure JavaScript, for modern browsers.

[![View Demo](https://cloud.githubusercontent.com/assets/1669261/16919759/246196ec-4d35-11e6-8d12-153aa969384e.png)](https://rawgit.com/tovic/color-picker/master/color-picker.html "View Demo")

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
    picker.on("drag", function(color) {
        this.target.value = '#' + color;
    });
    </script>
  </body>
</html>
~~~

Has support for touch events. Touchy… touchy…

Hooks
-----

The available hooks:

 - `create`
 - `destroy`
 - `enter`
 - `exit`
 - `fit`
 - `start`
 - `start:h`
 - `start:sv`
 - `drag`
 - `drag:h`
 - `drag:sv`
 - `stop`
 - `stop:h`
 - `stop:sv`

### Add a Hook

Add a `drag` hook.

~~~ .javascript
picker.on("drag", function(color) {
    console.log(color);
});
~~~

### Add a Hook with ID

Add a `drag` hook with ID of `test-id`.

~~~ .javascript
picker.on("drag", function(color) {
    console.log(color);
}, 'test-id');
~~~

### Remove a Hook

Remove all `drag` hooks.

~~~ .javascript
picker.off("drag");
~~~

### Remove a Hook by ID

Remove a `drag` hook with ID of `test-id`.

~~~ .javascript
picker.off("drag", 'test-id');
~~~

### Trigger a Hook with Custom Value

Trigger all `drag` hooks with pre–defined color value as `ffa500`.

~~~ .javascript
picker.trigger("drag", ['ffa500']);
~~~

Trigger a `drag` hook with ID of `test-id` and with pre–defined color value as `ffa500`.

~~~ .javascript
picker.trigger("drag", ['ffa500'], 'test-id');
~~~

Data
----

### Get the Target Element

~~~ .javascript
var target = picker.target;
~~~

### Get the Picker Element

~~~ .javascript
var picker = picker.picker;
~~~

### Get Hidden Color Data on the Target Element

~~~ .javascript
console.log(picker.set());
~~~

### Set Hidden Color Data on the Target Element

~~~ .javascript
picker.set([0, 1, 1]); // HSV color value, range from `0` to `1` for each
~~~

~~~ .javascript
picker.set('rgb(255, 0, 0)'); // as color string
~~~

Color Converter
---------------

### HSV to RGB

~~~ .javascript
console.log(picker.HSV2RGB([360, 100, 100]));
~~~

### HSV to HEX

~~~ .javascript
console.log(picker.HSV2HEX([360, 100, 100]));
~~~

### RGB to HSV

~~~ .javascript
console.log(picker.RGB2HSV([255, 255, 255]));
~~~

### RGB to HEX

~~~ .javascript
console.log(picker.RGB2HEX([255, 255, 255]));
~~~

### HEX to HSV

~~~ .javascript
console.log(picker.HEX2HSV('ffffff'));
~~~

### HEX to RGB

~~~ .javascript
console.log(picker.HEX2RGB('ffffff'));
~~~

### Parse to Raw HSV Color Data

All valid color string input will be converted into array of hue, saturation and value, with a range from `0` to `1`.

~~~ .javascript
console.log(picker.parse('#ffffff'));
console.log(picker.parse('rgb(255, 255, 255)'));
console.log(picker.parse('hsv(140, 20%, 60%)'));
console.log(picker.parse([0, 1, 1])); // no changes
~~~

Events
------

### Show

~~~ .javascript
picker.enter(); // show the color picker
~~~

### Hide

~~~ .javascript
picker.exit(); // hide the color picker
~~~

Want to Add More Features?
--------------------------

My purpose in making this plugin is to provide a JavaScript color picker solution as simple as possible with the most minimal features without requiring any dependency on JavaScript library such as jQuery or Prototype.

If you want to add new features, you can use the available hooks to make your own improvements without having to touch the plugin core. Here are some examples:

 - [No Idea?](https://rawgit.com/tovic/color-picker/master/color-picker.noob.html)
 - [Multiple Instances](https://rawgit.com/tovic/color-picker/master/color-picker.picker.html)
 - [Pre–Defined Value](https://rawgit.com/tovic/color-picker/master/color-picker.value-set.html)
 - [Pre–Defined Color](https://rawgit.com/tovic/color-picker/master/color-picker.picker-set.html)
 - [Convert HEX Color Value](https://rawgit.com/tovic/color-picker/master/color-picker.value-convert.html)
 - [Add Support for HSL Color Value](https://rawgit.com/tovic/color-picker/master/color-picker.color-hsl.html)
 - [Transparency](https://rawgit.com/tovic/color-picker/master/color-picker.color-rgba.html)
 - [Show and Hide with Buttons](https://rawgit.com/tovic/color-picker/master/color-picker.state.html)
 - [Add Close Button](https://rawgit.com/tovic/color-picker/master/color-picker.close.html)
 - [Replace Text Input with Hidden Input](https://rawgit.com/tovic/color-picker/master/color-picker.replace.html)
 - [HTML5 Color Input](https://rawgit.com/tovic/color-picker/master/color-picker.input-color.html)
 - [Create and Destroy Method](https://rawgit.com/tovic/color-picker/master/color-picker.create-destroy.html)
 - [Auto–Positioned to the Reachable Area in the Document](https://rawgit.com/tovic/color-picker/master/color-picker.fit.html)
 - [Color Preview in Color Picker](https://rawgit.com/tovic/color-picker/master/color-picker.picker-preview.html)
 - etc… (coming soon!)