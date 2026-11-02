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
  const palette = {bg: '#f3f6f7', panel: '#e4e3de', fg: '#111111', muted: '#071d66', line: '#bfd5ef'};
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ng', `instruction-${_c.display}`);
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
      const title = u.el('div', 'ng-title', dlg);
      u.el('span', '', title, 'Display Settings');
      const x = u.el('button', 'ng-x', title, '✕'); x.type = 'button'; x.tabIndex = -1;
      const tabs = u.el('div', 'ng-tabs', dlg);
      C.tabs.forEach((t, i) => u.el('div', 'ng-tab' + (i ? '' : ' on'), tabs, t));
      const actions = u.el('div', 'ng-actions', dlg);
      Object.assign(_c, {header: document.body, dlg, title, actions});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-instruction');
      if (note) note.classList.add('ng-note', 'ng-note-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.placement === 'icon' ? _c.title : _c.actions;
      base(_c);
      _c.header = header;
      if (_c.placement === 'icon') _c.title.insertBefore(_c.headerTools, _c.title.querySelector('.ng-x'));
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ng-body', _c.dlg);
      u.el('h2', '', body, 'Adjust Opacity Range');
      u.el('p', 'ng-desc', body, 'Control the range of window opacity (more transparent to more solid).');
      const info = u.el('div', 'ng-info', body);
      u.el('div', '', info, 'Lower values make the window more transparent.');
      u.el('div', '', info, 'Higher values make the window more solid.');
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      base({..._c, body: document.body});
      const note = document.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ng-note', 'ng-note-panel');
        note.querySelector('.ref-panel-title').classList.add('ng-note-title');
        note.querySelector('.ref-panel-text').classList.add('ng-note-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ng-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ng-note', 'ng-note-toast');
        note.querySelector('.ref-note-text').classList.add('ng-note-copy');
        const close = note.querySelector('.ref-note-x');
        close.classList.add('ng-btn', 'ng-note-close');
        close.textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.actions.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-range-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: {'design-set-slider-range-03': palette},
      LOW_THEME: palette,
      ACCENTS: ['#0753d3'],
      LOW_ACCENTS: ['#0753d3'],
      parts,
    },
  });
})();
