(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-05',
    'brand': 'Preferences - Topic Selection',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Your Task',
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
      u.el('span', 'ds-brand', top, 'GlobalNet Extranet');
      const tl = u.el('span', 'ds-toplinks', top);
      ['Partners', 'Resources', 'Support'].forEach((t) => u.el('span', '', tl, t));
      const tr = u.el('span', 'ds-topright', top);
      ['Mon, Apr 12, 1999', 'Welcome, Alex', 'Sign Out'].forEach((t) => u.el('span', '', tr, t));
      {
        const nav = u.el('nav', 'ds-menu', document.body);
        ['Home', 'Projects', 'Market Research', 'Documents', 'Team', 'Admin'].forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const titlebar = u.el('div', 'ds-titlebar', content, 'Topic Selection');
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
      u.el('span', '', foot, '');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const cr = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? labels.find((x) => x === 'Submit') || 'Submit' : er.pick(labels);
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? titlebar : foot;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'ds-submit ds-end-' + placement, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (cr.bool(0.3)) {
          const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = cr.pick(pool);
            const decoy = u.el('button', 'ds-submit ds-xtra', placement === 'toolbar' ? foot : titlebar, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
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
