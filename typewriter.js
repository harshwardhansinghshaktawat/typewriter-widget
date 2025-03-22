class TypewriterText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'text', 'font-size', 'font-family', 'font-color', 
      'background-color', 'typing-speed', 'typewriter-symbol'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleResize = () => this.render();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
  }

  setupTyping(targets) {
    targets.forEach(($dom) => {
      const textList = $dom.innerText.split('');
      let html = '';
      textList.forEach((char) => {
        html += `<span style="display: none;">${char}</span>`;
      });
      $dom.innerHTML = html;
    });
  }

  runTyping(targets) {
    const typingSpeed = parseInt(this.getAttribute('typing-speed')) || 50;
    let delay = 0;

    targets.forEach(($target) => {
      const $chars = $target.querySelectorAll('span');
      $chars.forEach(($char, index) => {
        const text = $char.textContent;
        delay += text === ' ' ? typingSpeed * 2 : typingSpeed;
        setTimeout(() => {
          $char.style.display = 'inline-block';
        }, delay);

        if (index === $chars.length - 1) {
          delay += typingSpeed * 4; // Extra delay between lines
        }
      });
    });
  }

  render() {
    const text = this.getAttribute('text') || '<p>Welcome aboard.</p><p>Let’s explore together.</p><p>Follow my journey.</p>';
    const fontSize = parseFloat(this.getAttribute('font-size')) || 2; // In vw
    const fontFamily = this.getAttribute('font-family') || 'Courier New';
    const fontColor = this.getAttribute('font-color') || '#00FFFF'; // Cyan
    const backgroundColor = this.getAttribute('background-color') || '#000000'; // Black
    const typewriterSymbol = this.getAttribute('typewriter-symbol') || '|';

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css?family=Courier+New');

        :host {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${backgroundColor};
          overflow: hidden;
        }

        .inner {
          width: 100%;
          max-width: 70vw;
          padding: 2em;
          border: 4px solid ${fontColor};
          border-radius: 4px;
          box-sizing: border-box;
          margin-top: 2em;
          margin-bottom: 2em;
        }

        p {
          display: block;
          color: ${fontColor};
          font-family: ${fontFamily}, monospace;
          font-size: ${fontSize}vw;
          line-height: 2em;
          margin: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }

        span {
          display: none;
          min-width: 1em;
        }

        .cursor {
          display: inline-block;
          width: 3px;
          height: 1em;
          background-color: ${fontColor};
          animation: flash 0.8s infinite;
          vertical-align: middle;
        }

        @keyframes flash {
          0%   { opacity: 0; }
          49%  { opacity: 0; }
          50%  { opacity: 1; }
          100% { opacity: 1; }
        }
      </style>
      <div class="inner">
        ${text}
        <span class="cursor">${typewriterSymbol}</span>
      </div>
    `;

    const targets = this.shadowRoot.querySelectorAll('p');
    this.setupTyping(targets);
    this.runTyping(targets);
  }
}

customElements.define('typewriter-text', TypewriterText);
