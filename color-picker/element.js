(function(win, doc) {

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
                source = doc.createElement('span'),
                input = doc.createElement('input'),
                inputName = this.getAttribute('name'),
                inputValue = this.getAttribute('value');
            source.style.cssText = 'display:inline-block;vertical-align:middle;width:2em;height:2em;cursor:pointer;';
            input.type = 'hidden';
            if (inputName) {
                input.name = inputName;
            }
            if (inputValue) {
                input.value = inputValue;
                source.style.backgroundColor = inputValue;
                source.setAttribute('data-color', inputValue);
            }
            root.appendChild(source);
            root.host.parentNode.insertBefore(input, root.host);
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
