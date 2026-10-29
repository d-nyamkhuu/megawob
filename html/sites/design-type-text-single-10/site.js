(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-single-10',
    'brand': 'Task Center',
    'title': 'Your Answer',
    'instruction': 'left',
    'rail': '',
    'menu': '',
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
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = ctx.content.END_LABELS || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endRng.bool(0.5) ? 'Submit' : asLabel(endRng.pick(endWords));
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'header', 'link', 'floating']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const opts = [
          ...new Set(endWords.map(asLabel).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (opts.length) collide = asLabel(collideRng.pick(opts));
      }
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top, C.brand);
      brand.insertAdjacentHTML(
        'afterbegin',
        '<svg width="30" height="40" viewBox="0 0 30 40" style="margin-right:22px"><rect x="1" y="1" width="28" height="38" rx="5" fill="#1a6cf0"/><rect x="7" y="6" width="16" height="7" rx=".5" fill="#fff"/><path d="M7 20h16M7 26h16M7 32h12" stroke="#fff" stroke-width="2"/></svg>',
      );
      const wins = u.el('div', 'ds-wincontrols', top);
      ['minimize', 'maximize', 'close'].forEach((key) => {
        const b = u.el('button', 'ds-wincontrol', wins);
        b.type = 'button';
        b.setAttribute('aria-label', key);
        b.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 16 16"><path d="' +
          {
            minimize: 'M2 8h12',
            maximize:
              'M4 2.5h8a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5z',
            close: 'M2 2l12 12M14 2 2 14',
          }[key] +
          '" fill="none" stroke="#1b2430" stroke-width="1.3"/></svg>';
      });
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
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      document.body.dataset.instruction = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'header') briefing(main, 'ds-brief');
      if (mode === 'panel') briefing(content, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (collide && placement !== 'header') decoyBtn(top, collide, true);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? top : foot;
        const cls = placement === 'link' ? 'ds-endlink' : 'ds-submit';
        const text = placement === 'floating' ? '✓' : label;
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide && placement === 'header') decoyBtn(foot, collide, true);
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
