import {D, W, getAttribute, getParent, getState, hasAttribute, setAttribute, setChildLast, setDatum, setElement, setPrev, setState, setStates, setStyle, setStyles} from '@taufik-nurrohman/document';
import {onEvent} from '@taufik-nurrohman/event';

class HTMLColorPickerElement extends HTMLElement {

    constructor() {
        // Always call `super()` first in constructor
        super();
        // Create a shadow root
        this.attachShadow({
            mode: 'open'
        });
    }

    connectedCallback() {
        let root = this.shadowRoot,
            source = setElement('span'),
            input = setElement('input'),
            inputName = getAttribute(this, 'name'),
            inputValue = getAttribute(this, 'value');
        setState(input, 'type', 'hidden');
        if (inputName) {
            setState(input, 'name', inputName);
        }
        if (inputValue) {
            setState(input, 'value', inputValue);
            setDatum(source, 'color', inputValue);
            setStyle(source, 'background-color', inputValue);
        }
        setChildLast(root, source);
        setPrev(getParent(root.host), input);
        // Apply the color picker widget
        const picker = new CP(source);
        picker.on('change', function(r, g, b, a) {
            let color = this.color(r, g, b, a);
            setDatum(source, 'color', color);
            setState(input, 'value', color);
            setStyle(source, 'background-color', color);
        });
        setStyle(picker.self, 'margin-top', -1);
        setStyles(source, {
            'border': '1px solid #000',
            'cursor': 'pointer',
            'display': 'inline-block',
            'height': '2em',
            'vertical-align': 'middle',
            'width': '2em'
        })
        // TODO: Remove this event listener
        onEvent('click', source, () => picker.enter());
    }

}

// Define custom element
W.customElements.define('color-picker', HTMLColorPickerElement);
