/* NetGuide 1998 directory portal: link columns, yellow strips, compact Display Settings dialog. */
(function () {
  'use strict';
  const C = {
    cats: ['Arts & Humanities', 'Business & Economy', 'Computers & Internet', 'Education', 'Entertainment', 'Health', 'News & Media', 'Recreation & Sports', 'Reference', 'Science', 'Society', 'Travel'],
    quick: ['Maps', 'People Finder', 'Job Search', 'Classifieds', 'Stock Quotes', 'TV Listings', 'Weather', 'White Pages'],
    nav: ['Home', 'Search', 'Directory', 'News', 'Weather', 'Help'],
    tabs: ['Appearance', 'Colors', 'Fonts', 'Display'],
  };
  function globe(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox: '0 0 100 100', class: 'ng-globe', 'aria-hidden': 'true'}, parent);
    const defs = u.svg('defs', {}, svg);
    const g = u.svg('radialGradient', {id: 'ngg', cx: '26%', cy: '24%', r: '78%'}, defs);
    u.svg('stop', {offset: '0', 'stop-color': '#70a5ef'}, g);
    u.svg('stop', {offset: '.46', 'stop-color': '#1465d1'}, g);
    u.svg('stop', {offset: '1', 'stop-color': '#001c73'}, g);
    const clip = u.svg('clipPath', {id: 'ng-earth-clip'}, defs);
    u.svg('circle', {cx: 50, cy: 50, r: 47}, clip);
    u.svg('circle', {cx: 50, cy: 50, r: 47, fill: 'url(#ngg)'}, svg);
    const land = u.svg('g', {'clip-path': 'url(#ng-earth-clip)', fill: '#3d970e'}, svg);
    u.svg('path', {d: 'M22 12l10-7 9 3-1 7 6-2 6 5-3 7-8 2-5-4-4 5-5 2-1 8-5 3-4-5-2-9 5-5-2-5z M30 35l7 2 1 7 8 3-1 5-7-3-3-6-7-1z M43 54l9 1 5 5 9 1 7 8-5 9-8 3-4 8-7 7-6-1 3-10 3-11-3-7-6-4-2-6z M52 5l8-2 6 5-3 8-6 3-6-5z M78 13l8 5 4 9-4 5 7 7 4 10-3 12-7-3-5-13 2-8-5-6 3-7-5-5z'}, land);
    u.svg('path', {d: 'M25 14l10-4 3 4-7 3z M40 18l7 1-2 6-6-2z M46 57l7 3-3 4-5-2z M81 24l5 3-3 4-4-3z', fill: '#62b723'}, land);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'ng-notice overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'NetGuide Survey', cookie: 'Cookie Notice', toast: 'NetGuide Notice', promo: 'Special Offer', banner: 'Service Notice'}[ctx.kind];
    u.el('div', 'ng-notice-title', el, title);
    u.el('p', '', el, {chat: 'Take our quick survey about NetGuide.', cookie: 'This site remembers your display preferences.', toast: 'Your settings were saved.', promo: 'Get the NetGuide toolbar free!', banner: 'Scheduled maintenance tonight.'}[ctx.kind]);
    const dismiss = u.el('button', 'ng-btn', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name: 'design-set-slider-range-03', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `ng instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const endChoices = ctx.content && ctx.content.END_LABELS;
      const endLabels = (Array.isArray(endChoices) && endChoices.length ? endChoices : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])
        .map((x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x));
      const endLabel = endRng.pick(endLabels);
      const placement = endRng.pick(['actions', 'actions', 'title', 'link']);
      const head = u.el('header', 'ng-head', document.body);
      globe(head);
      const brand = u.el('div', 'ng-brand', head);
      u.el('div', 'ng-name', brand, 'NetGuide');
      u.el('div', 'ng-tag', brand, 'Your Guide to the Internet');
      const nav = u.el('nav', 'ng-nav', head);
      C.nav.forEach((n, i) => {
        if (i) u.el('span', 'ng-sep', nav, '|');
        const a = u.el('a', '', nav, n); a.href = '#'; a.onclick = (e) => e.preventDefault();
      });
      u.el('div', 'ng-date', head, 'Monday, Mar 23, 1998');
      const search = u.el('div', 'ng-search', head);
      u.el('label', '', search, 'Search the Web:');
      const inp = u.el('input', '', search); inp.type = 'text'; inp.tabIndex = -1; inp.readOnly = true;
      u.el('button', 'ng-go', search, 'Go').type = 'button';

      const side = (cls, title, items) => {
        const p = u.el('aside', 'ng-side ' + cls, document.body);
        u.el('div', 'ng-strip', p, title);
        items.forEach((t) => { const a = u.el('a', '', p, t); a.href = '#'; a.onclick = (e) => e.preventDefault(); });
      };
      side('left', 'Categories', C.cats);
      side('right', 'Quick Links', C.quick);

      const dlg = u.el('section', 'ng-dialog', document.body);
      dlg.setAttribute('role', 'group');
      const tb = u.el('div', 'ng-title', dlg);
      u.el('span', '', tb, 'Display Settings');
      let submit = null;
      const makeSubmit = (parent, cls, text, icon) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button'; b.dataset.role = 'submit'; b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        if (icon) b.classList.add('ng-icon-submit');
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish && placement === 'title') submit = makeSubmit(tb, 'ng-btn ng-title-submit', '✓', true);
      const x = u.el('button', 'ng-x', tb, '✕'); x.type = 'button'; x.tabIndex = -1;
      const tabs = u.el('div', 'ng-tabs', dlg);
      C.tabs.forEach((t, i) => u.el('div', 'ng-tab' + (i ? '' : ' on'), tabs, t));
      const body = u.el('div', 'ng-body', dlg);
      u.el('h2', '', body, 'Adjust Opacity Range');
      u.el('p', 'ng-desc', body, 'Control the range of window opacity (more transparent to more solid).');
      const stage = u.el('div', 'ng-stage', body); stage.dataset.role = 'stage';
      const info = u.el('div', 'ng-info', body);
      u.el('div', '', info, 'Lower values make the window more transparent.');
      u.el('div', '', info, 'Higher values make the window more solid.');
      const actions = u.el('div', 'ng-actions', dlg);
      const reset = u.el('button', 'ng-btn', actions, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      if (!ctx.finish && placement === 'actions') submit = makeSubmit(actions, 'ng-btn primary', endLabel, false);
      if (!ctx.finish && placement === 'link') submit = makeSubmit(actions, 'ng-end-link', endLabel + ' ›', false);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = endLabels.map((x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x))
          .filter((x) => x.trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
        if (pool.length) {
          const decoy = u.el('button', 'ng-btn ng-pq', actions, collideRng.pick(pool));
          decoy.type = 'button';
          decoy.onclick = () => env.log('decoy', {label: decoy.textContent, collide: true});
        }
      }
      const cancel = u.el('button', 'ng-btn', actions, 'Cancel'); cancel.type = 'button'; cancel.tabIndex = -1;

      const noteMode = ctx.display === 'panel' ? 'panel' : ctx.display === 'toast' ? 'toast' : 'header';
      const note = u.el('div', 'ng-note ng-note-' + noteMode, document.body);
      if (ctx.display === 'panel') {
        u.el('div', 'ng-note-title', note, 'Task Instructions');
        u.el('div', 'ng-note-copy', note, ctx.instruction);
      } else u.el('div', 'ng-note-copy', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'ng-btn ng-note-close', note, 'Close');
        close.type = 'button';
        close.onclick = () => { note.hidden = true; };
      }
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
