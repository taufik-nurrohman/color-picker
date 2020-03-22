/*!
 * ==============================================================
 *  COLOR PICKER PLUGIN 2.0.0
 * ==============================================================
 * Author: Taufik Nurrohman <https://github.com/taufik-nurrohman>
 * License: MIT
 * --------------------------------------------------------------
 */

(function(win, doc, NS) {

    var body = doc.body,
        html = doc.documentElement,
        HEX = 'HEX',
        children = 'children',
        top = 'top',
        right = 'right',
        left = 'left',
        px = 'px',
        delay = win.setTimeout,

        downEvents = ['touchstart', 'mousedown'],
        moveEvents = ['touchmove', 'mousemove'],
        resizeEvents = ['orientationchange', 'resize'],
        upEvents = ['touchend', 'mouseup'],

        __instance__ = '__instance__';

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

    // Convert RGBA to HSVA
    function RGB2HSV(a) {
        var r = +a[0],
            g = +a[1],
            b = +a[2],
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            d = max - min,
            h, s = (max === 0 ? 0 : d / max),
            v = max / 255;
        switch (max) {
            case min:
                h = 0;
                break;
            case r:
                h = (g - b) + d * (g < b ? 6 : 0);
                h /= 6 * d;
                break;
            case g:
                h = (b - r) + d * 2;
                h /= 6 * d;
                break;
            case b:
                h = (r - g) + d * 4;
                h /= 6 * d;
                break;
        }
        return [h, s, v, isSet(a[3]) ? +a[3] : 1];
    }

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
        return [toRound(r * 255), toRound(g * 255), toRound(b * 255), (isSet(a[3]) ? +a[3] : 1).toFixed(3)];
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
        return 'undefined' !== typeof x;
    }

    function isString(x) {
        return 'string' === typeof x;
    }

    function toEdge(a, b) {
        if (a < b[0]) return b[0];
        if (a > b[1]) return b[1];
        return a;
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

        $$.version = '2.0.0';

        // Collect all instance(s)
        $$[__instance__] = {};

        // Apply to all instance(s)
        $$.each = function(fn, t) {
            var i, j;
            return delay(function() {
                j = $$[__instance__];
                for (i in j) {
                    fn.call(j[i], i);
                }
            }, 0 === t ? 0 : (t || 1)), $$;
        };

        $$[HEX] = function(x) {
            if (isString(x)) {
                var i = x.length;
                if ((4 === i || 7 === i) && '#' === x[0]) {
                    if (/^\s*#([a-z\d]{1,2}){3}\s*$/i.test(x)) {
                        if (4 === i) {
                            return [toInt(x[1] + x[1], 16), toInt(x[2] + x[2], 16), toInt(x[3] + x[3], 16), 1];
                        }
                        return [toInt(x[1] + x[2], 16), toInt(x[3] + x[4], 16), toInt(x[5] + x[6], 16), 1];
                    }
                } else if ((5 === i || 9 === i) && '#' === x[0]) {
                    if (/^\s*#([a-z\d]{1,2}){4}\s*$/i.test(x)) {
                        if (5 === i) {
                            return [toInt(x[1] + x[1], 16), toInt(x[2] + x[2], 16), toInt(x[3] + x[3], 16), (+(toInt(x[4] + x[4], 16) / 255)).toFixed(3)];
                        }
                        return [toInt(x[1] + x[2], 16), toInt(x[3] + x[4], 16), toInt(x[5] + x[6], 16), (+(toInt(x[7] + x[8], 16) / 255)).toFixed(3)];
                    }
                }
                return [255, 0, 0, 1]; // Default to red
            }
            return '#' + ('000000' + toString(+x[2] | (+x[1] << 8) | (+x[0] << 16), 16)).slice(-6) + (isSet(x[3]) && x[3] < 1 ? toString(toRound(x[3] * 255) + 0x10000, 16).substr(-2) : "");
        };

        $$._ = $$.prototype;

    })(win[NS] = function(source, o) {

        if (!source) return;

        var $ = this,
            $$ = win[NS],
            hooks = {},
            self = doc.createElement('div'),
            defaults = {
                color: HEX,
                e: downEvents,
                parent: false
            };

        // Already instantiated, skip!
        if (source[NS]) {
            return $;
        }

        // Return new instance if `CP` was called without the `new` operator
        if (!($ instanceof $$)) {
            return new $$(source, o);
        }

        // Store color picker instance to `CP.__instance__`
        $$[__instance__][source.id || source.name || Object.keys($$[__instance__]).length] = $;

        // Mark current DOM as active tag picker to prevent duplicate instance
        source[NS] = 1;

        $.visible = false;

        o = Object.assign(defaults, o || {});

        function value() {
            var color = source.getAttribute('data-color') || source.value || source.innerHTML;
            return color ? $$[isFunction($$[o.color]) ? o.color : HEX](color) : [255, 0, 0, 1]; // Default is red
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

        self.className = 'color-picker';
        self.innerHTML = '<div class="color-picker-content"><div class="color-picker-sv"><div></div><div></div><div></div><i></i></div><div class="color-picker-h"><div></div><i></i></div><div class="color-picker-a"><div></div><div></div><i></i></div></div>';

        var doEnter,
            doExit,
            doFit,
            color = value(),
            data = RGB2HSV(color),
            C = self.firstChild,
            SV = C[children][0],
            H = C[children][1],
            A = C[children][2],

            SV_Color = SV[children][0],
            SV_Saturation = SV[children][1],
            SV_Value = SV[children][2],
            SV_Cursor = SV[children][3],

            H_Color = H[children][0],
            H_Cursor = H[children][1],

            A_Color = A[children][0],
            A_Pattern = A[children][1],
            A_Cursor = A[children][2],

            SV_Starting = 0,
            H_Starting = 0,
            A_Starting = 0,

            SV_Dragging = 0,
            H_Dragging = 0,
            A_Dragging = 0,

            selfOffsetLeft = 0,
            selfOffsetTop = 0,

            selfSizeWidth = 0,
            selfSizeHeight = 0;

        function isVisible() {
            return self.parentNode;
        }

        function doApply(isFirst, to) {

            // Refresh value
            data = RGB2HSV(color = value());

            if (!isFirst) {
                (to || o.parent || body).appendChild(self), ($.visible = true);
            }

            doEnter = function(to) {
                return doApply(0, to), $;
            };

            doExit = function() {
                var exist = isVisible();
                if (exist) {
                    exist.removeChild(self);
                    $.visible = false;
                }
                eventsLet(SV, downEvents, doDownSV);
                eventsLet(H, downEvents, doDownH);
                eventsLet(A, downEvents, doDownA);
                eventsLet(doc, moveEvents, doMove);
                eventsLet(doc, upEvents, doStop);
                eventsLet(win, resizeEvents, doFit);
                return $;
            };

            doFit = function(to) {
                var winSize = sizeGet(win),
                    htmlSize = sizeGet(html),
                    scrollBarSizeWidth = win[0] - html[0], // Vertical scroll bar
                    scrollBarSizeHeight = win[1] - html.clientHeight, // Horizontal scroll bar
                    winOffset = offsetGet(win),
                    sourceOffset = offsetGet(source);
                selfOffsetLeft = sourceOffset[0] + winOffset[0];
                selfOffsetTop = sourceOffset[1] + winOffset[1] + sizeGet(source)[1]; // Drop!
                if (isObject(to)) {
                    isSet(to[0]) && (selfOffsetLeft = to[0]);
                    isSet(to[1]) && (selfOffsetTop = to[1]);
                } else {
                    var min_x = winOffset[0],
                        min_y = winOffset[1],
                        max_x = winOffset[0] + winSize[0] - selfSizeWidth - scrollBarSizeWidth,
                        max_y = winOffset[1] + winSize[1] - selfSizeHeight - scrollBarSizeHeight;
                    selfOffsetLeft = toEdge(selfOffsetLeft, [min_x, max_x]) >> 0;
                    selfOffsetTop = toEdge(selfOffsetTop, [min_y, max_y]) >> 0;
                }
                styleSet(self, left, selfOffsetLeft + px);
                styleSet(self, top, selfOffsetTop + px);
            };

            var selfSize = sizeGet(self),
                SV_Size = sizeGet(SV),
                SV_SizeWidth = SV_Size[0],
                SV_SizeHeight = SV_Size[1],
                SV_CursorSize = sizeGet(SV_Cursor),
                SV_CursorSizeWidth = SV_CursorSize[0],
                SV_CursorSizeHeight = SV_CursorSize[1],
                H_SizeHeight = sizeGet(H)[1],
                H_CursorSizeHeight = sizeGet(H_Cursor)[1],
                A_SizeHeight = sizeGet(A)[1],
                A_CursorSizeHeight = sizeGet(A_Cursor)[1];

            selfSizeWidth = selfSize[0];
            selfSizeHeight = selfSize[1];

            if (isFirst) {
                function onClick(e) {
                    var t = e.target,
                        isSource = source === closestGet(t, source);
                    if (isSource) {
                        !isVisible() && doEnter(to);
                    } else {
                        doExit();
                    }
                }
                if (false !== o.e) {
                    eventsSet(source, o.e, onClick);
                }
                delay(function() {
                    hookFire('change:sv', color);
                    hookFire('change:h', color);
                    hookFire('change:a', color);
                    hookFire('change', color);
                }, 1);
            } else {
                eventsSet(SV, downEvents, doDownSV);
                eventsSet(H, downEvents, doDownH);
                eventsSet(A, downEvents, doDownA);
                eventsSet(doc, moveEvents, doMove);
                eventsSet(doc, upEvents, doStop);
                eventsSet(win, resizeEvents, doFit);
                doFit();
            }

            function doMove(e) {
                color = P2RGB(data);
                if (SV_Dragging) {
                    cursorSVSet(e);
                    hookFire((SV_Starting ? 'start' : 'drag') + ':sv', color);
                    hookFire('change:sv', color);
                }
                if (H_Dragging) {
                    cursorHSet(e);
                    hookFire((H_Starting ? 'start' : 'drag') + ':h', color);
                    hookFire('change:h', color);
                }
                if (A_Dragging) {
                    cursorASet(e);
                    hookFire((A_Starting ? 'start' : 'drag') + ':a', color);
                    hookFire('change:a', color);
                }
                hookFire((SV_Starting || H_Starting || A_Starting ? 'start' : 'drag'), color);
                if (SV_Dragging || H_Dragging || A_Dragging) {
                    hookFire('change', color);
                }
                SV_Starting = H_Starting = A_Starting = 0;
            }

            function doStop(e) {
                color = P2RGB(data);
                var t = e.target,
                    isSource = source === closestGet(t, source),
                    isSelf = self === closestGet(t, self);
                if (!isSource && !isSelf) {
                    // Click outside the source or picker element to exit
                    if (isVisible() && false !== o.e) {
                        doExit();
                    }
                } else {
                    if (isSelf) {
                        SV_Dragging && hookFire('stop:sv', color);
                        H_Dragging && hookFire('stop:h', color);
                        A_Dragging && hookFire('stop:a', color);
                        if (SV_Dragging || H_Dragging || A_Dragging) {
                            hookFire('stop', color);
                        }
                    }
                }
                SV_Dragging = H_Dragging = A_Dragging = 0;
            }

            function doDownSV(e) {
                SV_Starting = SV_Dragging = 1;
                doMove(e);
                doPreventDefault(e);
            }

            function doDownH(e) {
                H_Starting = H_Dragging = 1;
                doMove(e);
                doPreventDefault(e);
            }

            function doDownA(e) {
                A_Starting = A_Dragging = 1;
                doMove(e);
                doPreventDefault(e);
            }

            function cursorSet(x) {
                isSet(x[1]) && styleSet(SV_Cursor, right, (SV_SizeWidth - (SV_CursorSizeWidth / 2) - (SV_SizeWidth * +x[1])) + px);
                isSet(x[2]) && styleSet(SV_Cursor, top, (SV_SizeHeight - (SV_CursorSizeHeight / 2) - (SV_SizeHeight * +x[2])) + px);
                isSet(x[0]) && styleSet(H_Cursor, top, (H_SizeHeight - (H_CursorSizeHeight / 2) - (H_SizeHeight * +x[0])) + px);
                isSet(x[3]) && styleSet(A_Cursor, top, (A_SizeHeight - (A_CursorSizeHeight / 2) - (A_SizeHeight * +x[3])) + px);
            }

            $.set = function(r, g, b, a) {
                return cursorSet(RGB2HSV([r, g, b, a])), $;
            };

            function cursorSVSet(e) {
                var SV_Point = axixGet(SV, e),
                    x = toEdge(SV_Point[0], [0, SV_SizeWidth]),
                    y = toEdge(SV_Point[1], [0, SV_SizeHeight]);
                data[1] = 1 - ((SV_SizeWidth - x) / SV_SizeWidth);
                data[2] = (SV_SizeHeight - y) / SV_SizeHeight;
                colorSet();
            }

            function cursorHSet(e) {
                data[0] = (H_SizeHeight - toEdge(axixGet(H, e)[1], [0, H_SizeHeight])) / H_SizeHeight;
                colorSet();
            }

            function cursorASet(e) {
                data[3] = (A_SizeHeight - toEdge(axixGet(A, e)[1], [0, A_SizeHeight])) / A_SizeHeight;
                colorSet();
            }

            function colorSet() {
                cursorSet(data);
                var a = P2RGB(data),
                    b = P2RGB([data[0], 1, 1]);
                styleSet(SV_Color, 'backgroundColor', 'rgb(' + b[0] + ',' + b[1] + ',' + b[2] + ')');
                styleSet(A_Color, 'backgroundImage', 'linear-gradient(rgb(' + a[0] + ',' + a[1] + ',' + a[2] + '),transparent)');
            } colorSet();

        } doApply(1);

        $.color = function(r, g, b, a) {
            return $$[isFunction($$[o.color]) ? o.color : HEX]([r, g, b, a]);
        };
        $.enter = doEnter;
        $.exit = doExit;
        $.fire = hookFire;
        $.fit = doFit;
        $.hooks = hooks;
        $.off = hookLet;
        $.on = hookSet;
        $.self = self;
        $.source = source;
        $.state = o;

    });

})(this, this.document, 'CP');
