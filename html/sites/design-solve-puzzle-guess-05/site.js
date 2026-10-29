(function () {
  'use strict';
  const name = 'design-solve-puzzle-guess-05';
  env.site({
    name,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'dark horizontal instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg(
        'rect',
        { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#2877ac', stroke: '#8bc8ed', 'stroke-width': 1.5 },
        icon,
      );
      u.svg(
        'path',
        { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
        icon,
      );
      u.el('span', '', top, 'Number Finder   v1.0');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          svg,
        );
      }
      const menu = u.el('nav', 'menu', top),
        menuItems = u.el('span', 'menu-items', menu, 'File   Edit   View   Tools   Help');
      const toolbar = u.el('span', 'chrome-tools', menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end'),
        endWords = ctx.content && ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (
        Array.isArray(endWords) && endWords.length
          ? endWords
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const keepDefault = endRng.bool(0.5),
        label = keepDefault ? 'Submit' : endRng.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
      const placement = keepDefault ? 'footer' : endRng.pick(['header', 'footer-link']);
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'submit-link' ? 'a' : 'button', cls, parent, text);
        b.type = cls === 'submit-link' ? undefined : 'button';
        if (b.tagName === 'A') b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = makeEnd(toolbar, 'toolbar-submit', label);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(footer, 'submit', label);
      if (!ctx.finish && placement === 'footer-link') submit = makeEnd(footer, 'submit-link', label + ' ›');
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const word = collideRng.pick(choices),
            where = collideRng.pick(['header', 'footer']);
          const parent = where === 'header' ? toolbar : footer,
            decoy = u.el('button', 'chrome-xtra', parent, word);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
        }
      }
      if (ctx.display === 'panel') brief.classList.add('brief-panel');
      if (ctx.display === 'toast') brief.classList.add('brief-toast');
      if (ctx.display === 'hidden') brief.remove();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
