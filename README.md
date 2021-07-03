Color Picker
============

> A simple color picker application written in pure JavaScript, for modern browsers.

Has support for touch events. Touchy… touchy…

![Color Picker](https://user-images.githubusercontent.com/1669261/77280787-e2710100-6cf7-11ea-912d-d7d89c67bf83.png)

[Demo and Documentation](https://taufik-nurrohman.github.io/color-picker "View Demo")

Contribute
----------

 - **Please do not make pull requests by editing the files that are in the root of the project. They are generated automatically by the build tool.**
 - Install [Git](https://en.wikipedia.org/wiki/Git) and [Node.js](https://en.wikipedia.org/wiki/Node.js)
 - Run `git clone https://github.com/taufik-nurrohman/color-picker.git`
 - Run `cd color-picker && npm install --save-dev`
 - Edit the files in the `.github/source` folder.
 - Run `npm run pack` to generate the production ready files.

Contributors
------------

### Code Contributors

This project exists thanks to all the people who contribute.

[![Contributors](https://opencollective.com/color-picker/contributors.svg?width=890&button=false)](https://github.com/taufik-nurrohman/color-picker/graphs/contributors)

### Financial Contributors

[Become a financial contributor](https://opencollective.com/color-picker/contribute) and help us sustain our community.

#### Individuals

[![Contribute](https://opencollective.com/color-picker/individuals.svg?width=890)](https://opencollective.com/color-picker)

#### Organizations

[Support this project with your organization](https://opencollective.com/color-picker/contribute). Your logo will show up here with a link to your website.

<a href="https://opencollective.com/color-picker/organization/0/website"><img src="https://opencollective.com/color-picker/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/1/website"><img src="https://opencollective.com/color-picker/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/2/website"><img src="https://opencollective.com/color-picker/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/3/website"><img src="https://opencollective.com/color-picker/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/4/website"><img src="https://opencollective.com/color-picker/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/5/website"><img src="https://opencollective.com/color-picker/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/6/website"><img src="https://opencollective.com/color-picker/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/7/website"><img src="https://opencollective.com/color-picker/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/8/website"><img src="https://opencollective.com/color-picker/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/color-picker/organization/9/website"><img src="https://opencollective.com/color-picker/organization/9/avatar.svg"></a>

---

Release Notes
-------------

### 2.3.0

Starting from this version, you need to have a form element to store the color data. It doesn&rsquo;t have to be visible. You can use `<input type="hidden">` if you want. We no longer support storing color data via `data-color` attribute and element content.

 - Added `picker._set()` method.
 - Added `picker.value` property to store the initial color data.
 - Removed `picker.value()` method. Use the `picker.set()` method instead.

### 2.2.6

 - Maintenance.
 - Prioritized maintainability over file size. Say hello to Node.js and ES6! :wave:
 - Removed custom element example.
 - Restructured the test files.

### 2.1.6

 - Make color picker tweaks reusable by wrapping them in a function.
 - Modernized syntax.

### 2.1.5

 - Fixed minified code does not yet updated after release.

### 2.1.4

 - Removed `CP._` method.
 - Small bug fixes.

### 2.1.3

 - Added transition effect example.
 - Removed opacity value rounding internally.
 - Updated to pass the Firefox extension validator (#57)

### 2.1.2

 - Updated the donation target.

### 2.1.1

 - Fixed common issue with ES6 module which does not reference the `this` scope to `window` object by default.

### 2.1.0

 - Added `blur` and `focus` hook that removed `state.e` option.
 - Added ability to clear the hook storage object if it’s empty.

### 2.0.3

 - Added `CP.state` property to set initial state globally.

### 2.0.2

 - Renamed `state.events` to `state.e`.

### 2.0.1

 - Removed `CP.each()` method.
 - Renamed `CP.__instance__` to `CP.instances`.

### 2.0.0

 - Hooks function arguments is now contains red, green, blue and alpha color value instead of static hex color string value.
 - Reduced file size by removing all color supports other than hex.
 - Removed `change:sv`, `change:h`, `start:sv`, `start:h`, `drag:sv`, `drag:h`, `stop:sv`, `stop:h` hooks.

### 1.4.2

 - Changed to CSS flexbox for layout.
 - Fixed #48

### 1.4.1

 - Removed the instance parameter in the first function argument of the hook and move the `this` scope in the function body to the current color picker instance.
 - Trigger `enter` and `exit` hooks on `enter` and `exit` method call.

### 1.4.0

 - Renamed `target` property to `source` and `picker` property to `self`.

### 1.3.10

 - Automatic color picker size based on container’s font size.

### 1.3.9

 - Renamed `trigger` method to `fire`.

### 1.3.8

 - Fixed color picker panel position using `HTMLElement.prototype.getBoundingClientRect()` by @flamestream and @alex3683 #29

### 1.3.5

 - Allow users to change the plugin name from `CP` to another.

### 1.3.2

 - Allow users to override the `fit` method.

### 1.3.0

 - Converted all color converters into static function.

### 1.2.0

 - Added static `__instance__` property to collect all of the color picker instance.

### 1.1.0

 - Fixed Chrome bug with desktop events #9

### 1.0.3

 - Fixed `event.stopPropagation()` issue #8

### 1.0.2

 - Added `change` hook.

### 1.0.0

 - Initial release.
