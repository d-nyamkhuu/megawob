(function () {
  'use strict';
  const C = { site: 'design-type-text-validation-fix-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = ctx.util;
      const top = u.el('header', 'bp-top', document.body);
      const logo = u.el('div', 'bp-logo', top);
      const mark = u.el('span', 'bp-mark', logo);
      mark.setAttribute('aria-hidden', 'true');
      u.el('i', 'bp-person bp-person-left', mark);
      u.el('i', 'bp-person bp-person-center', mark);
      u.el('i', 'bp-person bp-person-right', mark);
      const brand = u.el('span', 'bp-brand', logo);
      u.el('span', '', brand, 'Bright');
      u.el('span', 'bp-brand-accent', brand, 'Path');
      const nav = u.el('nav', 'bp-nav', top);
      ['Home', 'People', 'Teams', 'Reports', 'Settings'].forEach((x, i) => {
        const n = u.el('span', i === 1 ? 'active' : '', nav, x);
      });
      const search = u.el('div', 'bp-search', top, '⌕　Search people...');
      const user = u.el('div', 'bp-user', top);
      u.el('span', 'bp-avatar', user, '●');
      u.el('span', '', user, 'Alex Carter　⌄');
      const title = u.el('section', 'bp-title', document.body);
      const titletext = u.el('div', 'bp-titletext', title);
      const back = u.el('div', 'bp-back', titletext, '←　All People');
      u.el('h1', '', titletext, 'Edit Employee');
      const stats = u.el('div', 'bp-stats', title);
      [
        ['24', 'Employees'],
        ['3', 'Teams'],
        ['1', 'On Leave'],
      ].forEach((a) => {
        const c = u.el('div', '', stats);
        u.el('strong', '', c, a[0]);
        u.el('span', '', c, a[1]);
      });
      if (ctx.display === 'header') {
        u.el('div', 'bp-title-instruction', titletext, ctx.instruction);
      }
      const main = u.el('main', 'bp-main', document.body);
      if (ctx.display === 'panel') {
        const p = u.el('aside', 'bp-panel', main);
        u.el('strong', '', p, 'Task');
        u.el('div', '', p, ctx.instruction);
      }
      const stage = u.el('div', 'bp-stage', main);
      let submit = null,
        placement = null,
        label = 'Confirm',
        collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          label = String(
            er.pick(
              Array.isArray(labels) && labels.length
                ? labels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
            ),
          );
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const opts = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (opts.length) collide = cr.pick(opts);
        }
        const decoy = (parent, text) => {
          const b = u.el('button', 'bp-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        const end = (parent, cls) => {
          const b = u.el('button', cls, parent, label);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical || placement === 'header') {
          if (collide) decoy(top, collide);
          submit = end(top, 'bp-confirm');
        } else {
          if (collide) decoy(title, collide);
          submit = end(title, 'bp-confirm bp-link');
        }
      }
      if (ctx.display === 'toast') {
        const toast = u.el('aside', 'bp-toast', document.body, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'bp-overlay bp-overlay-' + ctx.kind, document.body);
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
