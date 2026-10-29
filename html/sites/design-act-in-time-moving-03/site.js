(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-moving-03',
    'brand': 'Shape Catcher',
    'title': 'Shape Catcher',
    'instruction': 'right',
    'rail': '',
    'menu': 'Home|Games|Archive|Help',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['brief', 'brief', 'header', 'footer']);
      const label = placement === 'brief' ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))
        : null;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const status = u.el('div', 'ds-chase-status', document.body);
      u.el('span', '', status, '●  Ready');
      u.el('span', '', status, 'Keep the pointer inside the circle for the required time.');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        if (cls === 'ds-brief') {
          const list = u.el('ol', 'ds-steps', b);
          [ctx.instruction, 'Ignore shapes of other colors.', 'Act quickly — they keep moving.'].forEach((t) =>
            u.el('li', '', list, t),
          );
        } else u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (ctx.display === 'header') u.el('div', 'ds-board-title', main, ctx.instruction);
      let toast = null;
      if (mode === 'toast') toast = briefing(main, 'ds-toast');
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, mode === 'hidden' ? 'Shapes are moving.' : 'Shapes are moving. Click the purple ones!');
      let submit = null;
      if (!ctx.finish) {
        let parent,
          cls = 'ds-submit';
        if (placement === 'header') {
          parent = top;
          cls += ' ds-submit-header';
        } else if (placement === 'footer') {
          parent = foot;
          cls += ' ds-submit-link';
        } else parent = main.querySelector('.ds-brief') || toast || u.el('aside', 'ds-end-shelf', main);
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const preview = u.el('aside', 'ds-preview', content);
      u.el('div', 'ds-preview-title', preview, 'Next Shapes (Preview)');
      const shapes = u.el('div', 'ds-preview-shapes', preview);
      ['square', 'triangle', 'circle'].forEach((t) => u.el('span', 'ds-preview-' + t, shapes));
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
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
