(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-01',
    'brand': 'Account Access',
    'title': '',
    'instruction': 'top',
    'rail': '',
    'menu': 'Help|Settings|Sign out',
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
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'link']);
      const alternatives = labels.filter((x) => textOf(x).trim().toLowerCase() !== 'submit');
      const label =
        placement === 'footer' ? 'Submit' : textOf(endRng.pick(alternatives.length ? alternatives : labels));
      const collide = collideRng.bool(0.3)
        ? textOf(collideRng.pick(labels.filter((x) => textOf(x).trim().toLowerCase() !== label.trim().toLowerCase())))
        : null;
      const collideWhere = collide ? collideRng.pick(['header', 'footer']) : null;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-globe', top);
      u.el('span', 'ds-brand', top, 'AquaAccount');
      u.el('span', 'ds-tag', top, 'Simple tools for your digital life');
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
      const pt = u.el('div', 'ds-ptitle', content);
      u.el('span', '', pt, 'Account Setup');
      const step = u.el('span', 'ds-step', pt, 'Step 2 of 3');
      const addEnd = (parent, cls, value) => {
        const b = u.el('button', cls, parent, value);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const addDecoy = (parent) => {
        const b = u.el('button', 'ds-pq', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = addEnd(pt, 'ds-submit ds-submit-header', label);
      if (collide && collideWhere === 'header') addDecoy(pt);
      const gl = u.el('div', 'ds-glow', document.body);
      if (mode === 'top') {
        const hn = briefing(content, 'ds-header-note');
        u.el('span', 'ds-lock', hn);
        hn.insertBefore(hn.lastChild, hn.firstChild);
      }
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
      if (!ctx.finish && placement === 'footer') submit = addEnd(foot, 'ds-submit', label);
      else if (!ctx.finish && placement === 'link') submit = addEnd(foot, 'ds-end-link', label + ' ›');
      if (collide && collideWhere === 'footer') addDecoy(foot);
      const lf = u.el('div', 'ds-links', document.body);
      ['Privacy', 'Terms', 'Contact'].forEach((t) => u.el('span', '', lf, t));
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
