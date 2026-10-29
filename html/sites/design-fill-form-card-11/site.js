(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-11',
    'brand': 'People Manager',
    'instruction': 'top',
    'rail': '',
    'menu': 'Contacts|Add|Search|Help',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-welcome', top, 'Welcome, User   |   Sign out');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t, i) => {
          if (i) u.el('i', '', nav, '|');
          u.el('span', '', nav, t);
        });
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      let display = ctx.display;
      if (display === 'panel' && (window.innerWidth < 1260 || window.innerHeight < 700)) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      const mode =
        display === 'hidden' ? 'hidden' : display === 'toast' ? 'toast' : display === 'panel' ? 'left' : natural;
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
      u.el('span', '', foot, 'People Manager v1.0');
      u.el('em', 'ds-flinks', foot, 'Privacy   |   Terms   |   Contact');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const classic = er.bool(0.5);
      const placement = classic ? 'form' : er.pick(['toolbar', 'link']);
      const label = classic ? 'Submit' : er.pick(endWords);
      const tools = u.el('div', 'ds-end-tools', document.querySelector('.ds-menu'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tools : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'form' ? 'ds-submit' : 'ds-end ds-end-' + placement,
          parent,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endWords)].filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const decoyLabel = cr.pick(pool);
          const decoy = u.el('button', 'ds-xtra', tools, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const obstacle = u.el('section', 'ds-initial ds-initial-survey', document.body);
        const tbar = u.el('div', 'ds-sv-bar', obstacle);
        u.el('b', '', tbar, 'Quick Survey');
        const xb = u.el('button', 'ds-sv-x', tbar, '✕');
        xb.type = 'button';
        xb.setAttribute('aria-label', 'Close survey');
        xb.addEventListener('click', () => close.click());
        u.el('h3', '', obstacle, 'Help us improve People Manager');
        u.el('p', '', obstacle, 'What do you think of this application?');
        const options = u.el('div', 'ds-survey-options', obstacle);
        ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'].forEach((t) => {
          const l = u.el('label', '', options);
          const r = u.el('input', '', l);
          r.type = 'radio';
          r.name = 'survey';
          l.append(' ' + t);
        });
        u.el('div', 'ds-sv-label', obstacle, 'Additional comments (optional):');
        u.el('textarea', '', obstacle).setAttribute('aria-label', 'Additional comments (optional)');
        const close = u.el('button', '', obstacle, 'Close survey');
        close.type = 'button';
        obstacle.dataset.role = 'overlay';
        close.addEventListener('click', () => {
          env.log('reference-obstruction-dismiss', { kind: 'survey' });
          ctx.dismiss('close');
        });
        return { el: obstacle, dismiss: close };
      }
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
