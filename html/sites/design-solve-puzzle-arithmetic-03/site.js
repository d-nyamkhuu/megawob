(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-arithmetic-03',
    task: 'solve-puzzle',
    scenario: 'arithmetic',
    style: 'material-ledger',
    title: 'Math Practice',
    menu: 'Problems|History|Settings',
    note: 'Instructions',
    layout: 'ledger',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const fallbackEnds = [
    'Submit',
    'Done',
    'Finish',
    'Continue',
    'Save',
    'OK',
    'Confirm',
    'Apply',
    'Complete',
    "I'm done",
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        hamb = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'hamburger' }, top);
      u.svg('path', { d: 'M3 6h22M3 14h22M3 22h22', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, hamb);
      u.el('span', 'brand', top, C.title);
      const nav = u.el('nav', 'menu', top);
      nav.style.cssText =
        'position:absolute;left:auto;right:126px;top:0;width:max-content;height:72px;margin:0;padding:0;display:flex;align-items:center;gap:40px;color:#e6ebff;font-size:18px;white-space:nowrap';
      C.menu.split('|').forEach((label) => u.el('span', '', nav, label));
      const user = u.el('span', 'user-avatar', top),
        portrait = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, user);
      u.svg('circle', { cx: 14, cy: 14, r: 14, fill: '#dce5ff' }, portrait);
      u.svg('circle', { cx: 15, cy: 10, r: 5, fill: '#fff' }, portrait);
      u.svg('path', { d: 'M5 27c.7-6 4.5-9 10-9s9.3 3 10 9', fill: '#fff' }, portrait);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : 'Problem 3 of 10'),
        stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', center);
      u.el('b', '', aside, C.note);
      if (ctx.display === 'panel') u.el('p', 'episode-instruction', aside, ctx.instruction);
      const list = u.el('ol', 'instruction-list', aside);
      ['Solve the math problem.', 'Type your answer in the box.'].forEach((t) =>
        u.el('li', '', list, t),
      );
      if (ctx.display === 'toast') u.el('div', 'episode-toast', document.body, ctx.instruction);
      const preview = u.el('section', 'preview', document.body),
        previewHead = u.el('header', 'preview-head', preview);
      u.el('b', '', previewHead, 'Preview');
      u.el('span', 'preview-min', previewHead, '—');
      u.el('p', '', preview, 'Your answer will be checked after you submit.');
      let submit = null;
      if (!ctx.finish) {
        const rng = ctx.rng.fork('chrome/end'),
          ends =
            ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
              ? ctx.content.END_LABELS
              : fallbackEnds;
        const placement = rng.pick(['form', 'form', 'form', 'footer', 'link']);
        const label = rng.bool(0.5) ? 'Submit' : labelOf(rng.pick(ends));
        submit = u.el('button', 'submit placement-' + placement, stage, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = labelOf(collideRng.pick(pool)),
              decoy = u.el('button', 'end-xtra', nav, text);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
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
