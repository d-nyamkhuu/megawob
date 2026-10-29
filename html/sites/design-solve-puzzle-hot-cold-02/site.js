(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-hot-cold-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'web2 full-board instruction-' + ctx.display;
      const u = ctx.util;
      const app = u.el('main', 'app', document.body);
      const instruction = u.el('div', 'instruction-strip', app, ctx.display === 'hidden' ? '' : ctx.instruction);
      const mast = u.el('header', 'masthead', app);
      const tabs = u.el('nav', 'file-tabs', mast);
      for (const [label, active] of [['Files', true], ['Photos', false], ['Music', false], ['Shared', false], ['Trash', false]]) {
        u.el('span', 'file-tab' + (active ? ' active' : ''), tabs, label);
      }
      const links = u.el('div', 'utility-links', mast);
      for (const label of ['Help', 'Settings', 'Sign Out']) u.el('span', 'utility-link', links, label);
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center, ctx.display === 'panel' || ctx.display === 'toast' ? ctx.instruction : '');
      u.el('div', 'page-title', center, 'My Files');
      u.el('div', 'page-subtitle', center, 'Browse and manage your files.');
      const search = u.el('div', 'search-row', center);
      u.el('div', 'search-field', search);
      u.el('button', 'search-button', search, '⌕　Search');
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
        const baseline = er.bool(0.5);
        const label = baseline ? 'Submit' : labelOf(er.pick(labels));
        const placement = baseline ? 'footer' : er.pick(['toolbar', 'link', 'footer']);
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
          return b;
        };
        if (placement === 'toolbar') {
          mast.classList.add('has-toolbar-end');
          submit = end(mast, 'submit toolbar-submit', label);
        }
        else if (placement === 'link') submit = end(footer, 'end-link', label + ' ›');
        else submit = end(footer, 'submit', label);

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = [...new Set(labels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = labelOf(cr.pick(pool));
            const parent = cr.pick(['toolbar', 'footer']) === 'toolbar' ? links : footer;
            const decoy = u.el('button', 'end-xtra', parent, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      u.el('button', 'reset-control', footer, 'Reset');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  });
})();
