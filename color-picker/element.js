((win, doc) => {

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
            input.type = 'hidden';
            if (inputName) {
                input.name = inputName;
            }
            if (inputValue) {
                input.value = inputValue;
                source.dataset.color = inputValue;
                source.style.backgroundColor = inputValue;
            }
            root.appendChild(source);
            root.host.parentNode.insertBefore(input, root.host);
            // Apply the color picker widget
            const picker = new CP(source);
            picker.on('change', function(r, g, b, a) {
                let color = this.color(r, g, b, a);
                source.dataset.color = color;
                source.style.backgroundColor = color;
                input.value = color;
            });
            picker.self.style.marginTop = '-1px';
            source.style.border = '1px solid #000';
            source.style.cursor = 'pointer';
            source.style.display = 'inline-block';
            source.style.height = '2em';
            source.style.verticalAlign = 'middle';
            source.style.width = '2em';
            // TODO: Remove this event listener
            source.addEventListener('click', () => picker.enter());
        }

    }

    // Define custom element
    win.customElements.define('color-picker', HTMLColorPickerElement);

})(window, document);
