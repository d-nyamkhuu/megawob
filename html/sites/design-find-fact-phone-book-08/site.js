(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-08',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
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
      const top = u.el('header', 'ds-top', document.body);
      const lg = u.el('span', 'ds-logo', top);
      u.el('span', '', u.el('span', 'ds-logo-i', lg, ''));
      const bt = u.el('span', 'ds-bt', lg);
      u.el('b', '', bt, 'Corporate Contacts');
      u.el('i', '', bt, 'People • Teams • A Stronger Workday');
      const us = u.el('span', 'ds-us', top);
      u.el('b', '', us, 'Welcome, Taylor Reed');
      u.el('u', '', us, 'Preferences  |  Help  |  Sign Out');
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
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'top';
      if (mode === 'toast' && window.innerHeight < 700) mode = 'top';
      const endR = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const keepDefault = endR.bool(0.5);
      const placement = keepDefault ? 'footer' : endR.pick(['footer', 'header', 'link']);
      const endLabel = keepDefault ? 'Submit' : endR.pick(endLabels);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collide = collideR.pick(options);
      }
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const b = briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Showing contacts');
      let submit = null;
      if (!ctx.finish) {
        const cl = u.el('button', 'ds-clear', foot, 'Clear Selection');
        cl.type = 'button';
        cl.addEventListener('click', () => env.log('decoy', { label: 'Clear Selection' }));
        const addEnd = (parent, cls, label) => {
          const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, label);
          b.type = 'button';
          if (b.tagName === 'A') b.href = '#';
          b.dataset.role = 'submit';
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const decoy = (parent, label) => {
          const b = u.el('button', 'ds-xtra', parent, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        };
        if (placement === 'header') {
          const tools = u.el('span', 'ds-end-tools', top);
          submit = addEnd(tools, 'ds-submit ds-end-header', endLabel);
        } else if (placement === 'link') {
          submit = addEnd(foot, 'ds-end-link', endLabel + ' ›');
        } else {
          submit = addEnd(foot, 'ds-submit', endLabel);
        }
        if (collide) decoy(foot, collide);
      }
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
