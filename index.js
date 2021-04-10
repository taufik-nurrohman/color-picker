/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2021 Taufik Nurrohman
 *
 * <https://github.com/taufik-nurrohman/color-picker>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CP = factory());
})(this, function() {
    'use strict';
    var isArray = function isArray(x) {
        return Array.isArray(x);
    };
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isInstance = function isInstance(x, of ) {
        return x && isSet( of ) && x instanceof of ;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isNumber = function isNumber(x) {
        return 'number' === typeof x;
    };
    var isNumeric = function isNumeric(x) {
        return /^-?(?:\d*.)?\d+$/.test(x + "");
    };
    var isObject = function isObject(x, isPlain) {
        if (isPlain === void 0) {
            isPlain = true;
        }
        if ('object' !== typeof x) {
            return false;
        }
        return isPlain ? isInstance(x, Object) : true;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var isString = function isString(x) {
        return 'string' === typeof x;
    };
    var fromJSON = function fromJSON(x) {
        var value = null;
        try {
            value = JSON.parse(x);
        } catch (e) {}
        return value;
    };
    var fromStates = function fromStates() {
        for (var _len = arguments.length, lot = new Array(_len), _key = 0; _key < _len; _key++) {
            lot[_key] = arguments[_key];
        }
        return Object.assign.apply(Object, [{}].concat(lot));
    };
    var fromValue = function fromValue(x) {
        if (isArray(x)) {
            return x.map(function(v) {
                return fromValue(x);
            });
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = fromValue(x[k]);
            }
            return x;
        }
        if (false === x) {
            return 'false';
        }
        if (null === x) {
            return 'null';
        }
        if (true === x) {
            return 'true';
        }
        return "" + x;
    };
    var toCaseCamel = function toCaseCamel(x) {
        return x.replace(/[-_.](\w)/g, function(m0, m1) {
            return toCaseUpper(m1);
        });
    };
    var toCaseUpper = function toCaseUpper(x) {
        return x.toUpperCase();
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var toEdge = function toEdge(x, edges) {
        if (isSet(edges[0]) && x < edges[0]) {
            return edges[0];
        }
        if (isSet(edges[1]) && x > edges[1]) {
            return edges[1];
        }
        return x;
    };
    var toJSON = function toJSON(x) {
        return JSON.stringify(x);
    };
    var toNumber = function toNumber(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return base ? parseInt(x, base) : parseFloat(x);
    };
    var toObjectCount = function toObjectCount(x) {
        return toCount(toObjectKeys(x));
    };
    var toObjectKeys = function toObjectKeys(x) {
        return Object.keys(x);
    };
    var toRound = function toRound(x) {
        return isNumber(x) ? Math.round(x) : null;
    };
    var toString = function toString(x, base) {
        if (base === void 0) {
            base = 10;
        }
        return isNumber(x) ? x.toString(base) : "" + x;
    };
    var toValue = function toValue(x) {
        if (isArray(x)) {
            return x.map(function(v) {
                return toValue(v);
            });
        }
        if (isNumeric(x)) {
            return toNumber(x);
        }
        if (isObject(x)) {
            for (var k in x) {
                x[k] = toValue(x[k]);
            }
            return x;
        }
        if ('false' === x) {
            return false;
        }
        if ('null' === x) {
            return null;
        }
        if ('true' === x) {
            return true;
        }
        return x;
    };
    var D = document;
    var W = window;
    var B = D.body;
    var R = D.documentElement;
    var getAttribute = function getAttribute(node, attribute, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        if (!hasAttribute(node, attribute)) {
            return null;
        }
        var value = node.getAttribute(attribute);
        return parseValue ? toValue(value) : value;
    };
    var getDatum = function getDatum(node, datum, parseValue) {
        if (parseValue === void 0) {
            parseValue = true;
        }
        var value = getAttribute(node, 'data-' + datum, parseValue),
            v = (value + "").trim();
        if (parseValue && v && ('[' === v[0] && ']' === v.slice(-1) || '{' === v[0] && '}' === v.slice(-1)) && null !== (v = fromJSON(value))) {
            return v;
        }
        return value;
    };
    var getParent = function getParent(node) {
        return node.parentNode || null;
    };
    var getState = function getState(node, state) {
        return hasState(node, state) && node[state] || null;
    };
    var getText = function getText(node, trim) {
        if (trim === void 0) {
            trim = true;
        }
        var state = 'textContent';
        if (!hasState(node, state)) {
            return false;
        }
        var content = node[state];
        content = trim ? content.trim() : content;
        return "" !== content ? content : null;
    };
    var hasAttribute = function hasAttribute(node, attribute) {
        return node.hasAttribute(attribute);
    };
    var hasState = function hasState(node, state) {
        return state in node;
    };
    var isWindow = function isWindow(node) {
        return node === W;
    };
    var letAttribute = function letAttribute(node, attribute) {
        return node.removeAttribute(attribute), node;
    };
    var letElement = function letElement(node) {
        var parent = getParent(node);
        return node.remove(), parent;
    };
    var setAttribute = function setAttribute(node, attribute, value) {
        if (true === value) {
            value = attribute;
        }
        return node.setAttribute(attribute, fromValue(value)), node;
    };
    var setAttributes = function setAttributes(node, attributes) {
        var value;
        for (var attribute in attributes) {
            value = attributes[attribute];
            if (value || "" === value || 0 === value) {
                setAttribute(node, attribute, value);
            } else {
                letAttribute(node, attribute);
            }
        }
        return node;
    };
    var setChildLast = function setChildLast(parent, node) {
        return parent.append(node), node;
    };
    var setDatum = function setDatum(node, datum, value) {
        if (isArray(value) || isObject(value)) {
            value = toJSON(value);
        }
        return setAttribute(node, 'data-' + datum, value);
    };
    var setElement = function setElement(node, content, attributes) {
        node = isString(node) ? D.createElement(node) : node;
        if (isObject(content)) {
            attributes = content;
            content = false;
        }
        if (isString(content)) {
            setHTML(node, content);
        }
        if (isObject(attributes)) {
            setAttributes(node, attributes);
        }
        return node;
    };
    var setHTML = function setHTML(node, content, trim) {
        if (trim === void 0) {
            trim = true;
        }
        if (null === content) {
            return node;
        }
        var state = 'innerHTML';
        return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
    };
    var setState = function setState(node, key, value) {
        return node[key] = value, node;
    };
    var setStyle = function setStyle(node, style, value) {
        if (isNumber(value)) {
            value += 'px';
        }
        return node.style[toCaseCamel(style)] = fromValue(value), node;
    };
    var setText = function setText(node, content, trim) {
        if (trim === void 0) {
            trim = true;
        }
        if (null === content) {
            return node;
        }
        var state = 'textContent';
        return hasState(node, state) && (node[state] = trim ? content.trim() : content), node;
    };
    var offEvent = function offEvent(name, node, then) {
        node.removeEventListener(name, then);
    };
    var offEventDefault = function offEventDefault(e) {
        return e && e.preventDefault();
    };
    var offEvents = function offEvents(names, node, then) {
        names.forEach(function(name) {
            return offEvent(name, node, then);
        });
    };
    var onEvent = function onEvent(name, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        node.addEventListener(name, then, options);
    };
    var onEvents = function onEvents(names, node, then, options) {
        if (options === void 0) {
            options = false;
        }
        names.forEach(function(name) {
            return onEvent(name, node, then, options);
        });
    };

    function hook($) {
        var hooks = {};

        function fire(name, data) {
            if (!isSet(hooks[name])) {
                return $;
            }
            hooks[name].forEach(function(then) {
                return then.apply($, data);
            });
            return $;
        }

        function off(name, then) {
            if (!isSet(name)) {
                return hooks = {}, $;
            }
            if (isSet(hooks[name])) {
                if (isSet(then)) {
                    for (var i = 0, _j = hooks[name].length; i < _j; ++i) {
                        if (then === hooks[name][i]) {
                            hooks[name].splice(i, 1);
                            break;
                        }
                    } // Clean-up empty hook(s)
                    if (0 === j) {
                        delete hooks[name];
                    }
                } else {
                    delete hooks[name];
                }
            }
            return $;
        }

        function on(name, then) {
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }
            if (isSet(then)) {
                hooks[name].push(then);
            }
            return $;
        }
        $.hooks = hooks;
        $.fire = fire;
        $.off = off;
        $.on = on;
        return $;
    }
    var getAxis = function getAxis(event, node) {
        var touches = event.touches,
            x = touches ? touches[0].clientX : event.clientX,
            y = touches ? touches[0].clientY : event.clientY;
        if (node) {
            var rect = getRect(node);
            return [x - rect[0], y - rect[1], rect[0], rect[1]];
        }
        return [x, y];
    };
    var getRect = function getRect(node) {
        var h, rect, w, x, y, X, Y;
        if (isWindow(node)) {
            x = node.pageXOffset || R.scrollLeft || B.scrollLeft;
            y = node.pageYOffset || R.scrollTop || B.scrollTop;
            w = node.innerWidth;
            h = node.innerHeight;
        } else {
            rect = node.getBoundingClientRect();
            x = rect.left;
            y = rect.top;
            w = rect.width;
            h = rect.height;
            X = rect.right;
            Y = rect.bottom;
        }
        return [x, y, w, h, X, Y];
    };
    let name = 'CP',
        delay = W.setTimeout,
        hex = 'HEX';

    function getClosest(a, b) {
        if (a === b) {
            return a;
        }
        while ((a = a.parentElement) && a !== b);
        return a;
    } // Convert cursor position to RGBA
    function P2RGB(a) {
        let h = +a[0],
            s = +a[1],
            v = +a[2],
            r,
            g,
            b,
            i,
            f,
            p,
            q,
            t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        i = i || 0;
        q = q || 0;
        t = t || 0;
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return [toRound(r * 255), toRound(g * 255), toRound(b * 255), isSet(a[3]) ? +a[3] : 1];
    } // Convert RGBA to HSVA
    function RGB2HSV(a) {
        let r = +a[0] / 255,
            g = +a[1] / 255,
            b = +a[2] / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h,
            s,
            v = max,
            d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0; // Achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, v, isSet(a[3]) ? +a[3] : 1];
    }
    const EVENTS_DOWN = ['touchstart', 'mousedown'];
    const EVENTS_MOVE = ['touchmove', 'mousemove'];
    const EVENTS_RESIZE = ['orientationchange', 'resize'];
    const EVENTS_UP = ['touchend', 'mouseup'];

    function CP(source, state = {}) {
        if (!source) return;
        const $ = this; // Return new instance if `CP` was called without the `new` operator
        if (!isInstance($, CP)) {
            return new CP(source, state);
        } // Already instantiated, skip!
        if (source[name]) {
            return;
        }
        let {
            fire,
            hooks
        } = hook($);
        $.state = state = fromStates(CP.state, isString(state) ? {
            color: state
        } : state || {});
        $.source = source;
        $.visible = false; // Store current instance to `CP.instances`
        CP.instances[source.id || source.name || toObjectCount(CP.instances)] = $; // Mark current DOM as active color picker to prevent duplicate instance
        source[name] = 1;

        function theValue(from) {
            let to = CP[isFunction(CP[state.color]) ? state.color : hex],
                theColor; // Get value from `data-color` attribute
            if (theColor = getDatum(source, 'color')) {
                if (isSet(from)) {
                    return setDatum(source, 'color', to(from));
                }
                return to(theColor);
            } // Get value from `value` attribute
            if (theColor = getState(source, 'value')) {
                if (isSet(from)) {
                    return setState(source, 'value', to(from));
                }
                return to(theColor);
            } // Get value from content
            if (theColor = getText(source)) {
                if (isSet(from)) {
                    return setText(source, to(from));
                }
                return to(theColor);
            }
            if (isSet(from)) {
                return; // Do nothing
            }
            return [0, 0, 0, 1]; // Default to black
        }
        let className = state['class'],
            doEnter,
            doExit,
            doFit,
            doResize,
            theColor = theValue(),
            theData = RGB2HSV(theColor),
            self = setElement('div', {
                'class': className
            }),
            C = setElement('div'),
            SV = setElement('div', {
                'class': className + ':sv'
            }),
            H = setElement('div', {
                'class': className + ':h'
            }),
            A = setElement('div', {
                'class': className + ':a'
            }),
            SVColor = setElement('div'),
            SVSaturation = setElement('div'),
            SVValue = setElement('div'),
            SVCursor = setElement('i'),
            HColor = setElement('div'),
            HCursor = setElement('i'),
            AColor = setElement('div'),
            APattern = setElement('div'),
            ACursor = setElement('i'),
            SVStarting = 0,
            HStarting = 0,
            AStarting = 0,
            SVDragging = 0,
            HDragging = 0,
            ADragging = 0;
        setChildLast(self, C);
        setChildLast(C, SV);
        setChildLast(C, H);
        setChildLast(C, A);
        setChildLast(SV, SVColor);
        setChildLast(SV, SVSaturation);
        setChildLast(SV, SVValue);
        setChildLast(SV, SVCursor);
        setChildLast(H, HColor);
        setChildLast(H, HCursor);
        setChildLast(A, AColor);
        setChildLast(A, APattern);
        setChildLast(A, ACursor);

        function doApply(isFirst, toParent) {
            // Refresh data
            theData = RGB2HSV(theColor = theValue());
            if (!isFirst) {
                setChildLast(toParent || state.parent || B, self);
                $.visible = true;
            }
            doEnter = toParent => {
                return doApply(0, toParent), fire('enter', theColor), $;
            };
            doExit = () => {
                if (getParent(self)) {
                    letElement(self);
                    $.current = null;
                    $.visible = false;
                }
                offEvents(EVENTS_DOWN, SV, doDownSV);
                offEvents(EVENTS_DOWN, H, doDownH);
                offEvents(EVENTS_DOWN, A, doDownA);
                offEvents(EVENTS_MOVE, D, doMove);
                offEvents(EVENTS_UP, D, doStop);
                offEvents(EVENTS_RESIZE, W, doResize);
                return fire('exit', theColor);
            };
            doFit = to => {
                let rootRect = getRect(R),
                    sourceRect = getRect(source),
                    winRect = getRect(W),
                    scrollBarHeight = winRect[3] - R.clientHeight,
                    // Horizontal scroll bar
                    scrollBarWidth = winRect[2] - rootRect[2],
                    // Vertical scroll bar
                    selfRect = getRect(self),
                    selfHeight = selfRect[3],
                    selfWidth = selfRect[2],
                    selfLeft = sourceRect[0] + winRect[0],
                    selfTop = sourceRect[1] + winRect[1] + sourceRect[3]; // Drop!
                if (isObject(to)) {
                    isSet(to[0]) && (selfLeft = to[0]);
                    isSet(to[1]) && (selfTop = to[1]);
                } else {
                    let minX = winRect[0],
                        minY = winRect[1],
                        maxX = winRect[0] + winRect[2] - selfWidth - scrollBarWidth,
                        maxY = winRect[1] + winRect[3] - selfHeight - scrollBarHeight;
                    selfLeft = toEdge(selfLeft, [minX, maxX]) >> 0;
                    selfTop = toEdge(selfTop, [minY, maxY]) >> 0;
                }
                setStyle(self, 'left', selfLeft);
                setStyle(self, 'top', selfTop);
                return fire('fit', theColor);
            };
            doResize = () => doFit();

            function doDownA(e) {
                $.current = A;
                AStarting = ADragging = 1;
                doMove(e);
                offEventDefault(e);
            }

            function doDownH(e) {
                $.current = H;
                HStarting = HDragging = 1;
                doMove(e);
                offEventDefault(e);
            }

            function doDownSV(e) {
                $.current = SV;
                SVStarting = SVDragging = 1;
                doMove(e);
                offEventDefault(e);
            }

            function doMove(e) {
                SVDragging && doSetSVCursor(e);
                HDragging && doSetHCursor(e);
                ADragging && doSetACursor(e);
                theColor = P2RGB(theData);
                if (SVDragging || HDragging || ADragging) {
                    fire(SVStarting || HStarting || AStarting ? 'start' : 'drag', theColor);
                    fire('change', theColor);
                }
                SVStarting = HStarting = AStarting = 0;
            }

            function doSetColor() {
                doSetCursor(theData);
                let a = P2RGB(theData),
                    b = P2RGB([theData[0], 1, 1]);
                setStyle(SVColor, 'background-color', 'rgb(' + b[0] + ',' + b[1] + ',' + b[2] + ')');
                setStyle(AColor, 'background-image', 'linear-gradient(rgb(' + a[0] + ',' + a[1] + ',' + a[2] + '),transparent)');
            }

            function doSetCursor(x) {
                isSet(x[1]) && setStyle(SVCursor, 'right', SVWidth - SVWidthCursor / 2 - SVWidth * +x[1]);
                isSet(x[2]) && setStyle(SVCursor, 'top', SVHeight - SVHeightCursor / 2 - SVHeight * +x[2]);
                isSet(x[0]) && setStyle(HCursor, 'top', HHeight - HHeightCursor / 2 - HHeight * +x[0]);
                isSet(x[3]) && setStyle(ACursor, 'top', AHeight - AHeightCursor / 2 - AHeight * +x[3]);
            }

            function doSetACursor(e) {
                theData[3] = (AHeight - toEdge(getAxis(e, A)[1], [0, AHeight])) / AHeight;
                doSetColor();
            }

            function doSetHCursor(e) {
                theData[0] = (HHeight - toEdge(getAxis(e, H)[1], [0, HHeight])) / HHeight;
                doSetColor();
            }

            function doSetSVCursor(e) {
                let SVPoint = getAxis(e, SV),
                    x = toEdge(SVPoint[0], [0, SVWidth]),
                    y = toEdge(SVPoint[1], [0, SVHeight]);
                theData[1] = 1 - (SVWidth - x) / SVWidth;
                theData[2] = (SVHeight - y) / SVHeight;
                doSetColor();
            }

            function doStop(e) {
                theColor = P2RGB(theData);
                let t = e.target,
                    isSource = source === getClosest(t, source),
                    isSelf = self === getClosest(t, self);
                $.current = null;
                if (!isSource && !isSelf) {
                    if (hooks.blur) {
                        fire('blur', theColor);
                    } else {
                        // Click outside the source or picker element to exit
                        if (SVDragging || HDragging || ADragging);
                        else {
                            getParent(self) && doExit();
                        }
                    }
                } else {
                    if (isSelf) {
                        if (SVDragging || HDragging || ADragging) {
                            fire('stop', theColor);
                        }
                    }
                }
                SVDragging = HDragging = ADragging = 0;
            }
            let SVRect = getRect(SV),
                SVRectCursor = getRect(SVCursor),
                HRect = getRect(H),
                HRectCursor = getRect(HCursor),
                ARect = getRect(A),
                ARectCursor = getRect(ACursor),
                SVHeight = SVRect[3],
                SVHeightCursor = SVRectCursor[3],
                SVWidth = SVRect[2],
                SVWidthCursor = SVRectCursor[2],
                HHeight = HRect[3],
                HHeightCursor = HRectCursor[3],
                AHeight = ARect[3],
                AHeightCursor = ARectCursor[3];
            if (isFirst) {
                onEvents(EVENTS_DOWN, source, doClick);
                delay(() => {
                    fire('change', theColor);
                }, 1);
            } else {
                onEvents(EVENTS_DOWN, SV, doDownSV);
                onEvents(EVENTS_DOWN, H, doDownH);
                onEvents(EVENTS_DOWN, A, doDownA);
                onEvents(EVENTS_MOVE, D, doMove);
                onEvents(EVENTS_UP, D, doStop);
                onEvents(EVENTS_RESIZE, W, doResize);
                doFit();
            }
            doSetColor();
            $.color = (r, g, b, a) => CP[isFunction(CP[state.color]) ? state.color : hex]([r, g, b, a]);
            $.current = null;
            $.enter = doEnter;
            $.exit = doExit;
            $.fit = doFit;
            $.get = () => theValue();
            $.pop = () => {
                if (!source[name]) {
                    return $; // Already ejected
                }
                delete source[name];
                offEvents(EVENTS_DOWN, source, doClick);
                return doExit(), fire('pop', theColor);
            };
            $.set = (r, g, b, a) => {
                theData = RGB2HSV([r, g, b, a]);
                return doSetColor(), $;
            };
            $.self = self;
            $.value = (r, g, b, a) => ($.set(r, g, b, a), fire('change', [r, g, b, a]));
        }
        doApply(1);

        function doClick(e) {
            if (hooks.focus) {
                fire('focus', theColor);
            } else {
                let t = e.target,
                    isSource = source === getClosest(t, source);
                if (isSource) {
                    !getParent(self) && doEnter(state.parent);
                } else {
                    doExit();
                }
            }
        }
        return $;
    }
    CP[hex] = x => {
        if (isString(x)) {
            let count = (x = x.trim()).length;
            if ((4 === count || 7 === count) && '#' === x[0]) {
                if (/^#([a-f\d]{3}){1,2}$/i.test(x)) {
                    if (4 === count) {
                        return [toNumber(x[1] + x[1], 16), toNumber(x[2] + x[2], 16), toNumber(x[3] + x[3], 16), 1];
                    }
                    return [toNumber(x[1] + x[2], 16), toNumber(x[3] + x[4], 16), toNumber(x[5] + x[6], 16), 1];
                }
            } else if ((5 === count || 9 === count) && '#' === x[0]) {
                if (/^#([a-f\d]{3,4}){1,2}$/i.test(x)) {
                    if (5 === count) {
                        return [toNumber(x[1] + x[1], 16), toNumber(x[2] + x[2], 16), toNumber(x[3] + x[3], 16), toNumber(x[4] + x[4], 16) / 255];
                    }
                    return [toNumber(x[1] + x[2], 16), toNumber(x[3] + x[4], 16), toNumber(x[5] + x[6], 16), toNumber(x[7] + x[8], 16) / 255];
                }
            }
            return [0, 0, 0, 1]; // Default to black
        }
        return '#' + ('000000' + toString(+x[2] | +x[1] << 8 | +x[0] << 16, 16)).slice(-6) + (isSet(x[3]) && x[3] < 1 ? toString(toRound(x[3] * 255) + 0x10000, 16).substr(-2) : "");
    };
    CP.instances = {};
    CP.state = {
        'class': 'color-picker',
        'color': hex,
        'parent': null
    };
    CP.version = '2.2.1';
    return CP;
});
