(function(win, doc) {

    class HTMLColorPickerElement extends HTMLElement {

        constructor() {
            // Always call `super()` first in constructor
            super();
            // Create a shadow root
            let shadow = this.attachShadow({
                mode: 'open'
            });
            // Create color picker source element
            let source = doc.createElement('span');
            source.style.cssText = 'display:inline-block;vertical-align:middle;width:2em;height:2em;cursor:pointer;';
            // Attach the created element to the shadow DOM
            shadow.appendChild(source);
        }

        connectedCallback() {
            const shadow = this.shadowRoot;
            let host = shadow.host,
                source = shadow.querySelector('span'),
                input = doc.createElement('input'),
                inputName = this.getAttribute('name'),
                inputValue = this.getAttribute('value');
            input.type = 'hidden';
            if (inputName) {
                input.name = inputName;
            }
            if (inputValue) {
                input.value = inputValue;
                source.style.backgroundColor = inputValue;
                source.setAttribute('data-color', inputValue);
            }
            host.parentNode.insertBefore(input, host);
            // Apply the color picker widget
            const picker = new CP(source);
            picker.on('change', function(r, g, b, a) {
                let color = this.color(r, g, b, a);
                source.style.backgroundColor = color;
                source.setAttribute('data-color', color);
                input.value = color;
            });
            // TODO: Remove this event listener
            source.addEventListener('click', function() {
                picker.enter();
            }, false);
        }

    }

    // Define the new element
    win.customElements.define('color-picker', HTMLColorPickerElement);

})(this, this.document);
