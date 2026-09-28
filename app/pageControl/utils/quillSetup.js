// app/pageControl/utils/quillSetup.js

function registerQuillModules() {
  if (window.Quill) {
    // Tysta Quills egna infologgar och varningar (t.ex. "Overwriting modules/...")
    window.Quill.debug('error');

    if (window.ImageResize || window.ImageResizeModule) {
      // Registrera endast om modulen inte redan är importerad/registrerad
      if (!window.Quill.import('modules/imageResize')) {
        const ImageResize = window.ImageResize?.default || window.ImageResize || window.ImageResizeModule;
        window.Quill.register('modules/imageResize', ImageResize);
      }
    }
  }
}

registerQuillModules();

export const commonQuillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['image', 'clean']
  ],
  imageResize: {
    modules: ['Resize', 'DisplaySize', 'Toolbar'],
    displaySize: true
  }
};

/**
 * Fabriksfunktion för att initiera en Quill-editor.
 * @param {string|HTMLElement} target - CSS-selektor (t.ex. '#nkpText') ELLER ett DOM-element
 * @param {string} [placeholder='Skriv text här...']
 * @returns {Quill|null}
 */
export function createQuillEditor(target, placeholder = 'Skriv text här...') {
  if (!target || !window.Quill) return null;

  // Hanterar både strängar ('#nkpText') och DOM-element (nkpText)
  const element = typeof target === 'string' ? document.querySelector(target) : target;

  if (!element) return null;

  // --- Tysta imageResize-modulens console.log vid instansiering ---
  const originalLog = console.log;
  console.log = function (...args) {
    // Filtrera bort utskriften från image-resize.min.js
    if (args[0] === 'this.options.modules') return;
    originalLog.apply(console, args);
  };

  let quillInstance = null;
  try {
    quillInstance = new window.Quill(element, {
      theme: 'snow',
      placeholder,
      modules: commonQuillModules
    });
  } finally {
    // Återställ console.log direkt efter skapandet
    console.log = originalLog;
  }

  return quillInstance;
}