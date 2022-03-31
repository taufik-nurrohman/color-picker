import {B, D, R, W, getDatum, getParent, getState, getText, letClass, letElement, setChildLast, setClass, setDatum, setElement, setState, setStyle, setText} from '@taufik-nurrohman/document';
import {offEvent, offEventDefault, offEvents, onEvent, onEvents} from '@taufik-nurrohman/event';
import {fromStates} from '@taufik-nurrohman/from';
import {hook} from '@taufik-nurrohman/hook';
import {isFunction, isInstance, isObject, isSet, isString} from '@taufik-nurrohman/is';
import {getAxis, getRect} from '@taufik-nurrohman/rect';
import {toCount, toEdge, toNumber, toObjectCount, toRound, toString} from '@taufik-nurrohman/to';

const COLOR_TYPE = 'HEX';

const EVENTS_DOWN = ['touchstart', 'mousedown'];
const EVENTS_MOVE = ['touchmove', 'mousemove'];
const EVENTS_RESIZE = ['orientationchange', 'resize'];
const EVENTS_UP = ['touchend', 'mouseup'];

let name = '%(js.name)',
    delay = W.setTimeout;

function getClosest(a, b) {
    if (a === b) {
        return a;
    }
    while ((a = a.parentElement) && a !== b);
    return a;
}

// Convert cursor position to RGBA
function P2RGB(a) {
    let h = +a[0],
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
    return [toRound(r * 255), toRound(g * 255), toRound(b * 255), isSet(a[3]) ? +a[3] : 1];
}

// Convert RGBA to HSVA
function RGB2HSV(a) {
    let r = +a[0] / 255,
        g = +a[1] / 255,
        b = +a[2] / 255,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h, s, v = max,
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

function CP(source, state = {}) {

    if (!source) return;

    // Already instantiated, skip!
    if (source[name]) {
        return source[name];
    }

    const $ = this;

    // Return new instance if `CP` was called without the `new` operator
    if (!isInstance($, CP)) {
        return new CP(source, state);
    }

    $.state = state = fromStates(CP.state, isString(state) ? {
        color: state
    } : (state || {}));

    // Store current instance to `CP.instances`
    CP.instances[source.id || source.name || toObjectCount(CP.instances)] = $;

    // Mark current DOM as active color picker to prevent duplicate instance
    source[name] = $;

    let {fire, hooks} = hook($);

    function getValue() {
        if (source.value) {
            return CP[isFunction(CP[state.color]) ? state.color : COLOR_TYPE](source.value || "");
        }
        return [0, 0, 0, 1]; // Default to black
    }

    let classNameB = state['class'],
        classNameE = classNameB + '__',
        classNameM = classNameB + '--',
        doEnter,
        doExit,
        doFit,
        doResize,

        isDisabled = () => source.disabled,
        isReadOnly = () => source.readOnly,

        theColor = getValue(),
        theData = RGB2HSV(theColor),

        self = setElement('div', {
            'class': classNameE + 'dialog',
            'role': 'dialog'
        }),

        C = setElement('div', {
            'class': classNameE + 'controls'
        }),
        classNameControl = classNameE + 'control',
        classNameCursor = classNameE + 'cursor',

        SV = setElement('div', {
            'class': classNameControl + ' ' + classNameControl + '--s/v'
        }),
        H = setElement('div', {
            'class': classNameControl + ' ' + classNameControl + '--h'
        }),
        A = setElement('div', {
            'class': classNameControl + ' ' + classNameControl + '--a'
        }),

        SVColor = setElement('div'),
        SVSaturation = setElement('div'),
        SVValue = setElement('div'),
        SVCursor = setElement('i', {
            'class': classNameCursor + ' ' + classNameCursor + '--s/v'
        }),

        HColor = setElement('div'),
        HCursor = setElement('i', {
            'class': classNameCursor + ' ' + classNameCursor + '--h'
        }),

        AColor = setElement('div'),
        APattern = setElement('div'),
        ACursor = setElement('i', {
            'class': classNameCursor + ' ' + classNameCursor + '--a'
        }),

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
        theData = RGB2HSV(theColor = getValue());

        if (!isFirst) {
            setChildLast(toParent || B, self);
            $.visible = true;
        }

        doEnter = toParent => {
            if (isDisabled() || isReadOnly()) {
                return $;
            }
            return doApply(0, toParent), fire('enter', theColor), $;
        };

        doExit = () => {
            if (isDisabled() || isReadOnly()) {
                return $;
            }
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
                scrollBarHeight = winRect[3] - R.clientHeight, // Horizontal scroll bar
                scrollBarWidth = winRect[2] - rootRect[2], // Vertical scroll bar
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
                fire((SVStarting || HStarting || AStarting ? 'start' : 'drag'), theColor);
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
            isSet(x[1]) && setStyle(SVCursor, 'right', (SVWidth - (SVWidthCursor / 2) - (SVWidth * +x[1])));
            isSet(x[2]) && setStyle(SVCursor, 'top', (SVHeight - (SVHeightCursor / 2) - (SVHeight * +x[2])));
            isSet(x[0]) && setStyle(HCursor, 'top', (HHeight - (HHeightCursor / 2) - (HHeight * +x[0])));
            isSet(x[3]) && setStyle(ACursor, 'top', (AHeight - (AHeightCursor / 2) - (AHeight * +x[3])));
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
            theData[1] = 1 - ((SVWidth - x) / SVWidth);
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
                    if (SVDragging || HDragging || ADragging) {
                    } else {
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

        $.color = (r, g, b, a) => CP[isFunction(CP[state.color]) ? state.color : COLOR_TYPE]([r, g, b, a]);

        $.current = null;
        $.enter = doEnter;
        $.exit = doExit;
        $.fit = doFit;

        $.get = () => getValue();

        $.pop = () => {
            if (!source[name]) {
                return $; // Already ejected
            }
            delete source[name];
            letClass(source, classNameE + 'source');
            offEvents(EVENTS_DOWN, source, doClick);
            return doExit(), fire('pop', theColor);
        };

        $.set = (r, g, b, a) => {
            return $._set(r, g, b, a), fire('change', [r, g, b, a]);
        };

        $.self = self;

        $._set = (r, g, b, a) => {
            theData = RGB2HSV([r, g, b, a]);
            return doSetColor(), $;
        };

        setClass(source, classNameE + 'source');

    } doApply(1);

    function doClick(e) {
        if (hooks.focus) {
            fire('focus', theColor);
        } else {
            let t = e.target,
                isSource = source === getClosest(t, source);
            if (isSource) {
                !getParent(self) && doEnter();
            } else {
                doExit();
            }
        }
    }

    $.source = source;
    $.visible = false;

    return $;

}

CP[COLOR_TYPE] = x => {
    if (isString(x)) {
        let count = toCount(x = x.trim());
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
    return '#' + ('000000' + toString(+x[2] | (+x[1] << 8) | (+x[0] << 16), 16)).slice(-6) + (isSet(x[3]) && x[3] < 1 ? toString(toRound(x[3] * 255) + 0x10000, 16).substr(-2) : "");
};

CP.instances = {};

CP.state = {
    'class': 'color-picker',
    'color': COLOR_TYPE
};

CP.version = '%(version)';

export default CP;