// Stand-in for a vendor's voice widget, used only on /styleguide and in tests
// to prove the real widget's script loads only after a click.
customElements.define(
  'hf-demo-assistant',
  class extends HTMLElement {
    connectedCallback() {
      this.textContent = 'Demo assistant loaded (a real vendor widget would appear here).';
    }
  },
);
