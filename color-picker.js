/*!
 * ==========================================================
 *  COLOR PICKER PLUGIN 1.0.0
 * ==========================================================
 * Author: Taufik Nurrohman <http://latitudu.com>
 * Licensed under the MIT license.
 * ----------------------------------------------------------
 */

var CP = function(target) {

    var w = window,
        d = document,
        r = this,
        hooks = {},
        picker = d.createElement('div');

    function isset(x) {
        return typeof x !== "undefined";
    }

    // [h, s, v] ... 0 <= h, s, v <= 1
    function HSV2RGB(a) {
        var h = +a[0],
            s = +a[1],
            v = +a[2],
            r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        if (isNaN(i)) i = 0;
        if (isNaN(q)) q = 0;
        if (isNaN(t)) t = 0;
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
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function HSV2HEX(a) {
        return RGB2HEX(HSV2RGB(a));
    }

    // [r, g, b] ... 0 <= r, g, b <= 255
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
        return [h, s, v];
    }
    function RGB2HEX(a) {
        var s = +a[2] | (+a[1] << 8) | (+a[0] << 16);
        s = '000000' + s.toString(16);
        return s.slice(-6);
    }

    // rrggbb or rgb
    function HEX2HSV(s) {
        return RGB2HSV(HEX2RGB(s));
    }
    function HEX2RGB(s) {
        if (s.length === 3) {
            s = s.replace(/./g, '$&$&');
        }
        return [parseInt(s[0] + s[1], 16), parseInt(s[2] + s[3], 16), parseInt(s[4] + s[5], 16)];
    }

    // convert range from `0` to `360` and `0` to `100` in color into range from `0` to `1`
    function _2HSV_pri(a) {
        return [+a[0] / 360, +a[1] / 100, +a[2] / 100];
    }

    // convert range from `0` to `1` in color into `0` to `360` and `0` to `100`
    function _2HSV_pub(a) {
        return [Math.round(+a[0] * 360), Math.round(+a[1] * 100), Math.round(+a[2] * 100)];
    }

    // *
    r.parse = function(x) {
        if (typeof x === "object") return x;
        var rgb = /\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i.exec(x),
            hsv = /\s*hsv\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/i.exec(x),
            hex = x[0] === '#' && x.match(/^#([\da-f]{3}|[\da-f]{6})$/);
        if (hex) {
            return HEX2HSV(x.slice(1));
        } else if (hsv) {
            return _2HSV_pri([+hsv[1], +hsv[2], +hsv[3]]);
        } else if (rgb) {
            return RGB2HSV([+rgb[1], +rgb[2], +rgb[3]]);
        }
        return [0, 1, 1]; // default is red
    };

    // add event
    function on(ev, el, fn) {
        return el.addEventListener(ev, fn, false);
    }

    // remove event
    function off(ev, el, fn) {
        return el.removeEventListener(ev, fn);
    }

    // get mouse/finger coordinate
    function point(el, e) {
      var x = !!e.touches ? e.touches[0].pageX : e.pageX,
          y = !!e.touches ? e.touches[0].pageY : e.pageY,
          left = el.offsetLeft,
          top = el.offsetTop;
      while (el = el.offsetParent) {
          left += el.offsetLeft;
          top += el.offsetTop;
          el = el.offsetParent;
      }
      return {
          x: x - left,
          y: y - top
      };
    }

    // get position
    function offset(el) {
        return {
            l: el.offsetLeft,
            t: el.offsetTop
        };
    }

    // get dimension
    function size(el) {
        return {
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    }

    // get color data
    function get_data(el, a) {
        var s = el.getAttribute('data-color');
        s = s ? s.split(',') : [];
        if (!isset(a)) a = false;
        return s.length === 3 ? [+s[0], +s[1], +s[2]] : a;
    }

    // set color data
    function set_data(el, a) {
        if (a === false) {
            return el.removeAttribute('data-color');
        }
        return el.setAttribute('data-color', a.join(','));
    }

    // add hook
    function add(ev, fn, id) {
        if (!isset(hooks[ev])) hooks[ev] = {};
        if (!isset(ev)) return hooks, r;
        if (!isset(fn)) return hooks[ev], r;
        if (!isset(id)) return hooks[ev][Object.keys(hooks[ev]).length] = fn, r;
        return hooks[ev][id] = fn, r;
    }

    // remove hook
    function remove(ev, id) {
        if (!isset(ev)) return hooks = {}, r;
        if (!isset(id)) return hooks[ev] = {}, r;
        return delete hooks[ev][id], r;
    }

    // trigger hook
    function trigger(ev, a, id) {
        if (!isset(hooks[ev])) return r;
        if (!isset(id)) {
            for (var i in hooks[ev]) {
                hooks[ev][i].apply(r, a);
            }
        } else {
            if (isset(hooks[ev][id])) {
                hooks[ev][id].apply(r, a);
            }
        }
        return r;
    }

    // initialize data ...
    if (target.value && target.value.length) {
        set_data(target, r.parse(target.value));
    } else if (!target.value) {
        var data = get_data(target, target.getAttribute('data-color'));
        if (data) set_data(target, r.parse(data));
    }

    // generate color picker pane ...
    picker.className = 'color-picker';
    picker.innerHTML = '<div class="color-picker-control"><span class="color-picker-h"><i></i></span><span class="color-picker-sv"><i></i></span></div>';
    var b = d.body,
        h = d.documentElement,
        c = picker.firstChild.children,
        HSV = get_data(target, [0, 1, 1]), // default is red
        H = c[0],
        SV = c[1],
        H_point = H.firstChild,
        SV_point = SV.firstChild,
        drag_H = false,
        drag_SV = false,
        left = 0,
        top = 0,
        P_W = 0,
        P_H = 0,
        set, exit;

    // fit to window
    function fit() {
        var w_W = /* w.innerWidth */ size(h).w,
            w_H = w.innerHeight,
            w_L = Math.max(b.scrollLeft, h.scrollLeft),
            w_T = Math.max(b.scrollTop, h.scrollTop),
            width = w_W + w_L,
            height = w_H + w_T;
        left = offset(target).l;
        top = offset(target).t + size(target).h;
        if (left + P_W > width) {
            left = width - P_W;
        }
        if (top + P_H > height) {
            top = height - P_H;
        }
        picker.style.left = left + 'px';
        picker.style.top = top + 'px';
        return trigger("fit", [r]), r;
    };

    // create
    function create(first) {
        if (!first) b.appendChild(picker);
        P_W = size(picker).w;
        P_H = size(picker).h;
        var H_H = size(H).h,
            SV_W = size(SV).w,
            SV_H = size(SV).h,
            H_point_H = size(H_point).h,
            SV_point_W = size(SV_point).w,
            SV_point_H = size(SV_point).h, v;
        if (first) {
            picker.style.left = '-9999px';
            picker.style.top = '-9999px';
            on("resize", w, fit);
            function click(e) {
                create();
                trigger("click", [r]);
                e.stopPropagation();
                e.preventDefault();
            } on("click", target, click);
            r.create = function() {
                create(1);
                return trigger("create", [r]), r;
            };
            r.destroy = function() {
                off("click", target, click);
                set_data(target, false);
                exit();
                return trigger("destroy", [r]), r;
            };
        } else {
            fit(), trigger("enter", [r]);
        }
        set = function() {
            HSV = get_data(target, HSV);
            color();
            H_point.style.top = ((H_H * +HSV[0]) - (H_point_H / 2)) + 'px';
            SV_point.style.right = (SV_W - (SV_point_W / 2) - (SV_W * +HSV[1])) + 'px';
            SV_point.style.top = (SV_H - (SV_point_H / 2) - (SV_H * +HSV[2])) + 'px';
        };
        exit = function() {
            if (picker.parentNode) b.removeChild(picker);
            off("touchmove", d, move);
            off("mousemove", d, move);
            off("touchend", d, stop);
            off("mouseup", d, stop);
            off("touchdown", d, exit);
            off("click", d, exit);
            return trigger("exit", [r]), r;
        };
        function color(e) {
            var a = HSV2RGB(HSV),
                b = HSV2RGB([HSV[0], 1, 1]);
            SV.style.backgroundColor = 'rgb(' + b.join(',') + ')';
            set_data(target, HSV);
            if (e) e.preventDefault();
        } set();
        function do_H(e) {
            var o = point(H, e), y = o.y;
            if (y < 0) {
                y = 0;
            } else if (y > H_H) {
                y = H_H;
            }
            HSV[0] = 1 - ((H_H - y) / H_H);
            H_point.style.top = (y - (H_point_H / 2)) + 'px';
            color(e);
        }
        function do_SV(e) {
            var o = point(SV, e),
                x = o.x,
                y = o.y;
            if (x < 0) {
                x = 0;
            } else if (x > SV_W) {
                x = SV_W;
            }
            if (y < 0) {
                y = 0;
            } else if (y > SV_H) {
                y = SV_H;
            }
            HSV[1] = 1 - ((SV_W - x) / SV_W);
            HSV[2] = (SV_H - y) / SV_H;
            SV_point.style.right = (SV_W - x - (SV_point_W / 2)) + 'px';
            SV_point.style.top = (y - (SV_point_H / 2)) + 'px';
            color(e);
        }
        function move(e) {
            if (drag_H) {
                do_H(e);
                v = HSV2HEX(HSV);
                trigger("drag:h", [v, r]);
                trigger("drag", [v, r]);
            }
            if (drag_SV) {
                do_SV(e);
                v = HSV2HEX(HSV);
                trigger("drag:sv", [v, r]);
                trigger("drag", [v, r]);
            }
        }
        function stop() {
            drag_H = false;
            drag_SV = false;
            if (!first) trigger("stop", [HSV2HEX(HSV), r]); // TODO: add `stop:h` and `stop:sv` hook
        }
        function down_H(e) {
            drag_H = true;
            do_H(e);
            trigger("start:h", [r]);
            trigger("start", [r]);
        }
        function down_SV(e) {
            drag_SV = true;
            do_SV(e);
            trigger("start:sv", [r]);
            trigger("start", [r]);
        }
        on("touchstart", H, down_H);
        on("mousedown", H, down_H);
        on("touchstart", SV, down_SV);
        on("mousedown", SV, down_SV);
        on("touchmove", d, move);
        on("mousemove", d, move);
        on("touchend", d, stop);
        on("mouseup", d, stop);
        on("touchdown", d, exit);
        on("click", d, exit);
    } create(1);

    w.setTimeout(function() {
        trigger("create", [HSV2HEX(HSV), r]);
    }, .1);

    // register to global ...
    r.target = target;
    r.picker = picker;
    r.on = add;
    r.off = remove;
    r.trigger = trigger;
    r.fit = fit;
    r.set = function(a) {
        if (typeof a === "string") {
            a = r.parse(a);
        }
        if (!isset(a)) return get_data(target);
        return set_data(target, a), set(), r;
    };
    r.HSV2RGB = function(a) {
        return HSV2RGB(_2HSV_pri(a));
    };
    r._HSV2RGB = HSV2RGB;
    r.HSV2HEX = function(a) {
        return HSV2HEX(_2HSV_pri(a));
    };
    r._HSV2HEX = HSV2HEX;
    r.RGB2HSV = function(a) {
        return _2HSV_pub(RGB2HSV(a));
    };
    r._RGB2HSV = RGB2HSV;
    r.RGB2HEX = RGB2HEX;
    r.HEX2HSV = function(s) {
        return _2HSV_pub(HEX2HSV(s));
    };
    r._HEX2HSV = HEX2HSV;
    r.HEX2RGB = HEX2RGB;
    r.hooks = hooks;
    r.enter = create;
    r.exit = exit;

    // return the global object
    return r;

};