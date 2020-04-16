/*!
 * ==============================================================
 *  COLOR PICKER 2.0.3
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, name) {

    var html = doc.documentElement,
        HEX = 'HEX',
        children = 'children',
        top = 'top',
        right = 'right',
        left = 'left',
        px = 'px',
        delay = win.setTimeout,
        instances = 'instances',

        downEvents = ['touchstart', 'mousedown'],
        moveEvents = ['touchmove', 'mousemove'],
        resizeEvents = ['orientationchange', 'resize'],
        upEvents = ['touchend', 'mouseup'];

    // Convert cursor position to RGBA
    function P2RGB(a) {
        var h = +a[0],
            s = +a[1],
            v = +a[2],
            r, g, b, i, f, p, q, t;
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
        return [toRound(r * 255), toRound(g * 255), toRound(b * 255), toFixed(isSet(a[3]) ? +a[3] : 1, 2)];
    }

    // Convert RGBA to HSVA
    function RGB2HSV(a) {
        var r = +a[0] / 255,
            g = +a[1] / 255,
            b = +a[2] / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s, v = max,
            d = max - min,
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

    function axixGet(el, e) {
        var touches = 'touches',
            clientX = 'clientX',
            clientY = 'clientY',
            x = !!e[touches] ? e[touches][0][clientX] : e[clientX],
            y = !!e[touches] ? e[touches][0][clientY] : e[clientY],
            offset = offsetGet(el);
        return [x - offset[0], y - offset[1]];
    }

    function closestGet(a, b) {
        if (a === b) {
            return a;
        }
        while ((a = a.parentElement) && a !== b);
        return a;
    }

    function offsetGet(el) {
        var x, y, rect;
        if (el === win) {
            x = win.pageXOffset || html.scrollLeft;
            y = win.pageYOffset || html.scrollTop;
        } else {
            rect = el.getBoundingClientRect();
            x = rect.left;
            y = rect.top;
        }
        return [x, y];
    }

    function sizeGet(el) {
        return el === win ? [win.innerWidth, win.innerHeight] : [el.offsetWidth, el.offsetHeight];
    }

    function doPreventDefault(e) {
        e && e.preventDefault();
    }

    function isFunction(x) {
        return 'function' === typeof x;
    }

    function isObject(x) {
        return 'object' === typeof x;
    }

    function isSet(x) {
        return 'undefined' !== typeof x || null === x;
    }

    function isString(x) {
        return 'string' === typeof x;
    }

    function toEdge(a, b) {
        if (a < b[0]) return b[0];
        if (a > b[1]) return b[1];
        return a;
    }

    function toFixed(a, b) {
        return +(a.toFixed(b));
    }

    function toInt(a, b) {
        return parseInt(a, b || 10);
    }

    function toRound(a) {
        return Math.round(a);
    }

    function toString(a, b) {
        return a.toString(b);
    }

    function eventsLet(to, events, fn) {
        for (var i = 0, j = events.length; i < j; ++i) {
            to.removeEventListener(events[i], fn, false);
        }
    }

    function eventsSet(to, events, fn) {
        for (var i = 0, j = events.length; i < j; ++i) {
            to.addEventListener(events[i], fn, false);
        }
    }

    function styleSet(to, prop, value) {
        to.style[prop] = value;
    }

    (function($$) {

        $$.version = '2.0.3';

        $$.state = {
            'class': 'color-picker',
            'color': HEX,
            'e': downEvents,
            'parent': null
        };

        // Collect all instance(s)
        $$[instances] = {};

        $$[HEX] = function(x) {
            if (isString(x)) {
                var count = (x = x.trim()).length;
                if ((4 === count || 7 === count) && '#' === x[0]) {
                    if (/^#([a-z\d]{1,2}){3}$/i.test(x)) {
                        if (4 === count) {
                            return [toInt(x[1] + x[1], 16), toInt(x[2] + x[2], 16), toInt(x[3] + x[3], 16), 1];
                        }
                        return [toInt(x[1] + x[2], 16), toInt(x[3] + x[4], 16), toInt(x[5] + x[6], 16), 1];
                    }
                } else if ((5 === count || 9 === count) && '#' === x[0]) {
                    if (/^#([a-z\d]{1,2}){4}$/i.test(x)) {
                        if (5 === count) {
                            return [toInt(x[1] + x[1], 16), toInt(x[2] + x[2], 16), toInt(x[3] + x[3], 16), toFixed(toInt(x[4] + x[4], 16) / 255, 2)];
                        }
                        return [toInt(x[1] + x[2], 16), toInt(x[3] + x[4], 16), toInt(x[5] + x[6], 16), toFixed(toInt(x[7] + x[8], 16) / 255, 2)];
                    }
                }
                return [0, 0, 0, 1]; // Default to black
            }
            return '#' + ('000000' + toString(+x[2] | (+x[1] << 8) | (+x[0] << 16), 16)).slice(-6) + (isSet(x[3]) && x[3] < 1 ? toString(toRound(x[3] * 255) + 0x10000, 16).substr(-2) : "");
        };

        $$._ = $$.prototype;

    })(win[name] = function(source, o) {

        if (!source) return;

        var $ = this,
            $$ = win[name],
            hooks = {},
            self = doc.createElement('div'),
            state = Object.assign({}, $$.state, false === o || o instanceof Array ? {
                'e': o
            } : (o || {})),
            cn = state['class'];

        // Already instantiated, skip!
        if (source[name]) {
            return $;
        }

        // Return new instance if `CP` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, o);
        }

        // Store color picker instance to `CP.instances`
        $$[instances][source.id || source.name || Object.keys($$[instances]).length] = $;

        // Mark current DOM as active color picker to prevent duplicate instance
        source[name] = 1;

        $.visible = false;

        function value(a) {
            var to = $$[isFunction($$[state.color]) ? state.color : HEX],
                color;
            if (color = source.dataset.color) {
                if (isSet(a)) {
                    return (source.dataset.color = to(color));
                }
                return to(color);
            }
            if (color = source.value) {
                if (isSet(a)) {
                    return (source.value = to(color));
                }
                return to(color);
            }
            if (color = source.textContent) {
                if (isSet(a)) {
                    return (source.textContent = to(color));
                }
                return to(color);
            }
            if (isSet(a)) {
                return; // Do nothing
            }
            return [0, 0, 0, 1]; // Default to black
        }

        function hookLet(name, fn) {
            if (!isSet(name)) {
                return (hooks = {}), $;
            }
            if (isSet(hooks[name])) {
                if (isSet(fn)) {
                    for (var i = 0, j = hooks[name].length; i < j; ++i) {
                        if (fn === hooks[name][i]) {
                            hooks[name].splice(i, 1);
                        }
                    }
                } else {
                    delete hooks[name];
                }
            }
            return $;
        }

        function hookSet(name, fn) {
            if (!isSet(hooks[name])) {
                hooks[name] = [];
            }
            if (isSet(fn)) {
                hooks[name].push(fn);
            }
            return $;
        }

        function hookFire(name, lot) {
            if (!isSet(hooks[name])) {
                return $;
            }
            for (var i = 0, j = hooks[name].length; i < j; ++i) {
                hooks[name][i].apply($, lot);
            }
            return $;
        }

        self.className = cn;
        self.innerHTML = '<div><div class="' + cn + ':sv"><div></div><div></div><div></div><i></i></div><div class="' + cn + ':h"><div></div><i></i></div><div class="' + cn + ':a"><div></div><div></div><i></i></div></div>';

        var doEnter,
            doExit,
            doFit,
            doFitTo,
            body = doc.body,
            color = value(),
            data = RGB2HSV(color),
            events = state.e,
            C = self.firstChild,
            SV = C[children][0],
            H = C[children][1],
            A = C[children][2],

            SVColor = SV[children][0],
            // SVSaturation = SV[children][1],
            // SVValue = SV[children][2],
            SVCursor = SV[children][3],

            HColor = H[children][0],
            HCursor = H[children][1],

            AColor = A[children][0],
            // APattern = A[children][1],
            ACursor = A[children][2],

            SVStarting = 0,
            HStarting = 0,
            AStarting = 0,

            SVDragging = 0,
            HDragging = 0,
            ADragging = 0;

        function isVisible() {
            return self.parentNode;
        }

        function doClick(e) {
            var t = e.target,
                isSource = source === closestGet(t, source);
            if (isSource) {
                !isVisible() && doEnter(state.parent);
            } else {
                doExit();
            }
        }

        function doApply(isFirst, to) {

            // Refresh value
            data = RGB2HSV(color = value());
            events = state.e;

            if (!isFirst) {
                (to || state.parent || body).appendChild(self), ($.visible = true);
            }

            doEnter = function(to) {
                return doApply(0, to), hookFire('enter', color), $;
            };

            doExit = function() {
                var exist = isVisible();
                if (exist) {
                    exist.removeChild(self);
                    $.current = null;
                    $.visible = false;
                }
                eventsLet(SV, downEvents, doDownSV);
                eventsLet(H, downEvents, doDownH);
                eventsLet(A, downEvents, doDownA);
                eventsLet(doc, moveEvents, doMove);
                eventsLet(doc, upEvents, doStop);
                eventsLet(win, resizeEvents, doFitTo);
                return hookFire('exit', color), $;
            };

            doFit = function(to) {
                var winSize = sizeGet(win),
                    htmlSize = sizeGet(html),
                    scrollBarSizeV = winSize[0] - htmlSize[0], // Vertical scroll bar
                    scrollBarSizeH = winSize[1] - html.clientHeight, // Horizontal scroll bar
                    winOffset = offsetGet(win),
                    sourceOffset = offsetGet(source),
                    selfSize = sizeGet(self),
                    selfSizeWidth = selfSize[0],
                    selfSizeHeight = selfSize[1],
                    selfOffsetLeft = sourceOffset[0] + winOffset[0],
                    selfOffsetTop = sourceOffset[1] + winOffset[1] + sizeGet(source)[1]; // Drop!
                if (isObject(to)) {
                    isSet(to[0]) && (selfOffsetLeft = to[0]);
                    isSet(to[1]) && (selfOffsetTop = to[1]);
                } else {
                    var minX = winOffset[0],
                        minY = winOffset[1],
                        maxX = winOffset[0] + winSize[0] - selfSizeWidth - scrollBarSizeV,
                        maxY = winOffset[1] + winSize[1] - selfSizeHeight - scrollBarSizeH;
                    selfOffsetLeft = toEdge(selfOffsetLeft, [minX, maxX]) >> 0;
                    selfOffsetTop = toEdge(selfOffsetTop, [minY, maxY]) >> 0;
                }
                styleSet(self, left, selfOffsetLeft + px);
                styleSet(self, top, selfOffsetTop + px);
                return hookFire('fit', color), $;
            };

            doFitTo = function() {
                return doFit();
            };

            var SVSize = sizeGet(SV),
                SVSizeWidth = SVSize[0],
                SVSizeHeight = SVSize[1],
                SVCursorSize = sizeGet(SVCursor),
                SVCursorSizeWidth = SVCursorSize[0],
                SVCursorSizeHeight = SVCursorSize[1],
                HSizeHeight = sizeGet(H)[1],
                HCursorSizeHeight = sizeGet(HCursor)[1],
                ASizeHeight = sizeGet(A)[1],
                ACursorSizeHeight = sizeGet(ACursor)[1];

            if (isFirst) {
                if (false !== events) {
                    eventsSet(source, events, doClick);
                }
                delay(function() {
                    hookFire('change', color);
                }, 1);
            } else {
                eventsSet(SV, downEvents, doDownSV);
                eventsSet(H, downEvents, doDownH);
                eventsSet(A, downEvents, doDownA);
                eventsSet(doc, moveEvents, doMove);
                eventsSet(doc, upEvents, doStop);
                eventsSet(win, resizeEvents, doFitTo);
                doFit();
            }

            function doMove(e) {
                SVDragging && cursorSVSet(e);
                HDragging && cursorHSet(e);
                ADragging && cursorASet(e);
                color = P2RGB(data);
                if (SVDragging || HDragging || ADragging) {
                    hookFire((SVStarting || HStarting || AStarting ? 'start' : 'drag'), color);
                    hookFire('change', color);
                }
                SVStarting = HStarting = AStarting = 0;
            }

            function doStop(e) {
                color = P2RGB(data);
                var t = e.target,
                    isSource = source === closestGet(t, source),
                    isSelf = self === closestGet(t, self);
                $.current = null;
                if (!isSource && !isSelf) {
                    // Click outside the source or picker element to exit
                    if (isVisible() && false !== events) {
                        doExit();
                    }
                } else {
                    if (isSelf) {
                        if (SVDragging || HDragging || ADragging) {
                            hookFire('stop', color);
                        }
                    }
                }
                SVDragging = HDragging = ADragging = 0;
            }

            function doDownSV(e) {
                $.current = SV;
                SVStarting = SVDragging = 1;
                doMove(e);
                doPreventDefault(e);
            }

            function doDownH(e) {
                $.current = H;
                HStarting = HDragging = 1;
                doMove(e);
                doPreventDefault(e);
            }

            function doDownA(e) {
                $.current = A;
                AStarting = ADragging = 1;
                doMove(e);
                doPreventDefault(e);
            }

            function cursorSet(x) {
                isSet(x[1]) && styleSet(SVCursor, right, (SVSizeWidth - (SVCursorSizeWidth / 2) - (SVSizeWidth * +x[1])) + px);
                isSet(x[2]) && styleSet(SVCursor, top, (SVSizeHeight - (SVCursorSizeHeight / 2) - (SVSizeHeight * +x[2])) + px);
                isSet(x[0]) && styleSet(HCursor, top, (HSizeHeight - (HCursorSizeHeight / 2) - (HSizeHeight * +x[0])) + px);
                isSet(x[3]) && styleSet(ACursor, top, (ASizeHeight - (ACursorSizeHeight / 2) - (ASizeHeight * +x[3])) + px);
            }

            $.get = function() {
                return value();
            };

            $.set = function(r, g, b, a) {
                data = RGB2HSV([r, g, b, a]);
                return colorSet(), $;
            };

            function cursorSVSet(e) {
                var SVPoint = axixGet(SV, e),
                    x = toEdge(SVPoint[0], [0, SVSizeWidth]),
                    y = toEdge(SVPoint[1], [0, SVSizeHeight]);
                data[1] = 1 - ((SVSizeWidth - x) / SVSizeWidth);
                data[2] = (SVSizeHeight - y) / SVSizeHeight;
                colorSet();
            }

            function cursorHSet(e) {
                data[0] = (HSizeHeight - toEdge(axixGet(H, e)[1], [0, HSizeHeight])) / HSizeHeight;
                colorSet();
            }

            function cursorASet(e) {
                data[3] = (ASizeHeight - toEdge(axixGet(A, e)[1], [0, ASizeHeight])) / ASizeHeight;
                colorSet();
            }

            function colorSet() {
                cursorSet(data);
                var a = P2RGB(data),
                    b = P2RGB([data[0], 1, 1]);
                styleSet(SVColor, 'backgroundColor', 'rgb(' + b[0] + ',' + b[1] + ',' + b[2] + ')');
                styleSet(AColor, 'backgroundImage', 'linear-gradient(rgb(' + a[0] + ',' + a[1] + ',' + a[2] + '),transparent)');
            } colorSet();

        } doApply(1);

        $.color = function(r, g, b, a) {
            return $$[isFunction($$[state.color]) ? state.color : HEX]([r, g, b, a]);
        };

        $.current = null;
        $.enter = doEnter;
        $.exit = doExit;
        $.fire = hookFire;
        $.fit = doFit;
        $.hooks = hooks;
        $.off = hookLet;
        $.on = hookSet;

        $.pop = function() {
            if (!source[name]) {
                return $; // Already ejected
            }
            delete source[name];
            if (false !== events) {
                eventsLet(source, events, doClick);
            }
            return doExit(), hookFire('pop', color);
        };

        $.value = function(r, g, b, a) {
            return $.set(r, g, b, a), hookFire('change', [r, g, b, a]);
        };

        $.self = self;
        $.source = source;
        $.state = state;

    });

})(this, this.document, 'CP');
