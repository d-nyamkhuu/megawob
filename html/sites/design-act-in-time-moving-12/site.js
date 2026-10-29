(function () {
  'use strict';
  const C = { site: 'design-act-in-time-moving-12' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top, 'Shape Catcher - Qt');
      brand.dataset.role = 'brand';
      const controls = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', controls, t);
        b.type = 'button';
        b.setAttribute('aria-label', t === '×' ? 'Close' : 'Window control');
      });
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Game', 'Options', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display || 'header';
      if (mode === 'header' || mode === 'panel') {
        const note = u.el(
          'section',
          mode === 'panel' ? 'ds-instruction-band ds-instruction-panel' : 'ds-instruction-band',
          content,
        );
        if (mode === 'panel') u.el('div', 'ds-panel-label', note, 'Task');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      if (mode === 'toast') {
        const note = u.el('div', 'ds-toast', content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', content);
      const preview = u.el('button', 'ds-preview', foot);
      preview.type = 'button';
      preview.dataset.role = 'xtra';
      preview.innerHTML =
        '<span class="ds-preview-icon" aria-hidden="true"></span><span class="ds-preview-copy"><b>Preview</b><small>Show upcoming shapes</small></span>';
      preview.addEventListener('click', () => env.log('decoy', { label: 'Preview' }));
      const rr = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : rr.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      let submit = null;
      let label = 'Submit';
      if (!ctx.finish) {
        const raw = rr.pick(ctx.content.END_LABELS);
        label = typeof raw === 'string' ? raw : (raw && (raw.label || raw.text || raw.name)) || 'Submit';
        const make = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        const collide = ctx.rng.fork('chrome/collide');
        if (collide.bool(0.3)) {
          const pool = ctx.content.END_LABELS.map((x) =>
            typeof x === 'string' ? x : x.label || x.text || x.name || '',
          ).filter((x) => x && x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const text = collide.pick(pool);
            const d = u.el('button', 'ds-xtra-end', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
        if (placement === 'footer') submit = make(foot, 'ds-submit', label);
        else if (placement === 'header') submit = make(top, 'ds-submit ds-submit-head', label);
        else if (placement === 'icon') submit = make(top, 'ds-submit ds-icon-submit', '✓');
        else {
          const link = u.el('button', 'ds-submit ds-link-submit', foot, label + ' ›');
          link.type = 'button';
          link.dataset.role = 'submit';
          link.title = label;
          link.setAttribute('aria-label', label);
          link.addEventListener('click', () => ctx.submit());
          submit = link;
        }
      }
      const status = u.el('div', 'ds-chase-status', document.body);
      u.el('span', '', status, 'Ready.');
      u.el('span', '', status, 'Game: Shapes');
      u.el('span', '', status, 'v1.0');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
