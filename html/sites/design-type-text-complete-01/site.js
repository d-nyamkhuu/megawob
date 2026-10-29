(function () {
  'use strict';
  const C = { site: 'design-type-text-complete-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-mark', title, '●');
      u.el('span', 'ds-brand', title, 'People & Accounts');
      const win = u.el('span', 'ds-window', title, '−　□　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Records|Tools|Help'.split('|').forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      const icons = {
        plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#ff8000" stroke="none"/><path d="M12 6v12M6 12h12" stroke="#fff" stroke-width="1.8"/></svg>',
        folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h7l2 2h10v11h-19z"/><path d="M2.5 8.5v-3h7l2 2"/></svg>',
        trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 4h6M7 7l1 14h8l1-14M10 10v8M14 10v8"/></svg>',
        search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
        filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18l-7 8v7l-4 2v-9z"/></svg>',
        sort: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4v16m0 0-4-4m4 4 4-4M17 20V4m0 0-4 4m4-4 4 4"/></svg>',
      };
      const actions = [['plus', 'New'], ['folder', 'Open'], ['trash', 'Delete'], ['search', 'Find'], ['filter', 'Filter'], ['sort', 'Sort']];
      actions.forEach(([icon, text]) => {
        const b = u.el('button', 'ds-tool', toolbar);
        b.type = 'button';
        const mark = u.el('span', 'ds-tool-icon', b);
        mark.innerHTML = icons[icon];
        u.el('span', '', b, text);
      });
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [['♟', 'People'], ['▦', 'Organisations'], ['▢', 'Activity'], ['▤', 'Documents'], ['▥', 'Reports']].forEach(([icon, text], i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', item, icon);
        u.el('span', '', item, text);
      });
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'panel' : 'header';
      function briefing(parent, cls) {
        const note = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', note, 'Instructions');
        u.el('div', 'ds-instruction', note, ctx.instruction);
        return note;
      }
      if (mode === 'header') briefing(title, 'ds-header-note');
      const hero = u.el('section', 'ds-hero', content);
      const identity = u.el('div', 'ds-identity', hero);
      u.el('div', 'ds-avatar', identity, 'JS');
      const details = u.el('div', 'ds-identity-copy', identity);
      u.el('h1', '', details, 'Jordan Smith');
      u.el('div', 'ds-subtitle', details, 'Individual Customer');
      const meta = u.el('div', 'ds-meta', details);
      [['✉', 'jordan.smith@example.com'], ['♧', '+44 7700 900123'], ['♧', 'Bristol, UK']].forEach(([icon, text]) => {
        const item = u.el('span', '', meta);
        u.el('b', '', item, icon);
        u.el('span', '', item, text);
      });
      const stats = u.el('div', 'ds-stats', hero);
      [['4', 'Total bookings'], ['2', 'Open requests'], ['1', 'Saved card']].forEach(([n, label]) => {
        const stat = u.el('div', 'ds-stat', stats);
        u.el('strong', '', stat, n);
        u.el('span', '', stat, label);
      });
      const tabs = u.el('nav', 'ds-tabs', content);
      ['Details', 'Bookings', 'Requests', 'Documents'].forEach((text, i) => u.el('span', i === 0 ? 'active' : '', tabs, text));
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-task-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      let submit = null;
      let placement = null;
      let label = 'Done';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)));
          const options = [...new Set(pool)].filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const addDecoy = (parent, text, cls) => {
          const b = u.el('button', `ds-xtra ${cls || ''}`, parent, text);
          b.type = 'button'; b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        const endButton = (parent, cls) => {
          const b = u.el('button', cls, parent, label);
          b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', label); b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical) submit = endButton(toolbar, 'ds-submit');
        else if (placement === 'header') {
          if (collide) addDecoy(toolbar, collide, 'ds-pq-header');
          submit = endButton(toolbar, 'ds-submit');
        } else {
          if (collide) addDecoy(tabs, collide, 'ds-pq-link');
          submit = endButton(tabs, 'ds-submit ds-submit-link');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
