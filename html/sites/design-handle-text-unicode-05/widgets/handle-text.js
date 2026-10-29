// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-05',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  template: 'handle-text/editor',
  design: {
    parts: {
      sourceCreated: (base, S) => (ctx, parent, b, i, source) => {
        const { text, sel } = source;
        const { util } = ctx;
        const copy = util.el('button', 'ut-copy', parent);
        copy.type = 'button';
        copy.setAttribute('aria-label', 'Copy source text');
        copy.title = 'Copy source text';
        copy.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="6" width="12" height="15" rx="1.5"/><path d="M16 3H5.5A1.5 1.5 0 0 0 4 4.5v13"/></svg>';
        copy.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          sel.set({ start: 0, end: b.text.length });
          text.focus();
          document.execCommand('copy');
        });
      },
    },
  },
});
