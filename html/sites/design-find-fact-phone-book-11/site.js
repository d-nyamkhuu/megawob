(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-11',
    'brand': 'Contact Book',
    'instruction': 'right',
    'rail': '',
    'menu': '',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'chat' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-actions', top, '−    □    ×');
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
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const keepCurrent = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : keepCurrent ? 'footer' : endRng.pick(['header', 'footer-link']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const alternatives = labels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const label = keepCurrent ? 'Submit' : endRng.pick(alternatives.length ? alternatives : labels);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labels)].filter(
          (x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase(),
        );
        if (options.length) collide = collideRng.pick(options);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide) decoy(top, collide);
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(foot, 'ds-submit', label);
        else if (placement === 'footer-link') submit = endButton(foot, 'ds-submit ds-submit-link', label);
        else submit = endButton(top, 'ds-submit ds-header-submit', label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = ctx.initial
        ? u.el('section', 'ds-initial ds-initial-tip', document.body)
        : u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.initial) {
        u.el('h2', '', el, 'Tip of the day');
        u.el('p', '', el, 'You can quickly find someone by using the search box or sorting the columns.');
        const l = u.el('label', '', el);
        const cb = u.el('input', '', l);
        cb.type = 'checkbox';
        l.append(' Do not show again');
        const dismiss = u.el('button', '', el, 'Close');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
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
