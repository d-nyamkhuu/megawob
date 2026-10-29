(function () {
  const LOCK = '<svg viewBox="0 0 124 182" width="100%" height="100%"><defs><linearGradient id="pkb" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#d9bd78"/><stop offset=".5" stop-color="#b08c42"/><stop offset="1" stop-color="#7d5c22"/></linearGradient></defs><path d="M28 78 V48 a34 34 0 0 1 68 0 V78" fill="none" stroke="#9c7a35" stroke-width="13"/><path d="M28 78 V48 a34 34 0 0 1 68 0 V78" fill="none" stroke="#e6cf94" stroke-width="3" transform="translate(-3 0)"/><rect x="6" y="76" width="112" height="100" rx="12" fill="url(#pkb)" stroke="#5e4416" stroke-width="3"/><rect x="14" y="84" width="96" height="84" rx="7" fill="none" stroke="#e8d395" stroke-width="2" opacity=".7"/><circle cx="62" cy="116" r="12" fill="#1f1608"/><path d="M57 120 H67 L70 148 H54Z" fill="#1f1608"/></svg>';

  env.widget({
    task: 'type-text',
    site: 'design-type-text-password-02',
    name: 'design',
    split: 'train',
    scenarios: ['password'],
    template: 'type-text/fields',
    design: {
      sample: { first: 'inline', layout: 'try', margin: 0 },
      labelWithPlaceholder: false,
      parts: {
        heading: () => (ctx, card) => {
          ctx.util.el('h2', '', card, 'Protect Document');
        },
        // The introduction follows the sampled subtitle, as in the original document form.
        beforeFields: () => (ctx, grid) => {
          const util = ctx.util;
          const intro = util.el('div', 'pk-intro', null);
          grid.parentElement.insertBefore(intro, grid);
          const lock = util.el('span', 'pk-lock', intro);
          lock.innerHTML = LOCK;
          const itext = util.el('div', 'pk-text', intro, 'Set a password to prevent others from opening this document.');
          util.el('span', 'pk-sub', itext, 'The document will be encrypted using a strong standard.');
        },
      },
    },
  });
})();
