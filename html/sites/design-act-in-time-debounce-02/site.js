(function () {
  'use strict';
  const palette = { bg: '#edf3f8', panel: '#ffffff', fg: '#172846', muted: '#62738e', line: '#d9e2ee' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      document.body.classList.add('wayfarer');
      const app = u.el('div', 'wf-app', document.body);
      const rail = u.el('aside', 'wf-rail', app);
      u.el('div', 'wf-logo', rail, '▲');
      u.el('strong', 'wf-wordmark', rail, 'Wayfarer');
      [ ['◆', 'Home'], ['▢', 'Trips'], ['◉', 'Explore'], ['▣', 'Stays'], ['▱', 'Cars'], ['☆', 'Rewards'] ].forEach((x, i) => {
        const a = u.el('div', 'wf-navitem' + (!i ? ' selected' : ''), rail);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const canvas = u.el('main', 'wf-canvas', app);
      u.el('div', 'wf-hero', canvas);
      const top = u.el('div', 'wf-top-actions', canvas);
      ['⌕', '♧', 'J'].forEach((x, i) => u.el('span', 'wf-action a' + i, top, x));
      const greeting = u.el('div', 'wf-greeting', canvas);
      u.el('h1', '', greeting, 'Good morning');
      u.el('p', '', greeting, 'Where will you go next?');
      const records = u.el('section', 'wf-records', canvas);
      const rh = u.el('header', '', records);
      u.el('h2', '', rh, 'Recent trips');
      u.el('a', '', rh, 'View all');
      [ ['Seattle', 'Mar 3 – Mar 7, 2022', '▥'], ['Honolulu', 'Feb 10 – Feb 16, 2022', '◩'], ['Tokyo', 'Jan 12 – Jan 20, 2022', '▤'], ['Barcelona', 'Nov 3 – Nov 12, 2021', '▧'], ['London', 'Sep 18 – Sep 26, 2021', '▥'] ].forEach((x, i) => {
        const row = u.el('div', 'wf-triprow', records);
        u.el('div', 'wf-thumb t' + i, row, x[2]);
        const txt = u.el('div', 'wf-triptext', row);
        u.el('b', '', txt, x[0]);
        u.el('span', '', txt, x[1]);
        u.el('i', '', row, '›');
      });
      const panelWindow = u.el('section', 'wf-window', canvas);
      const toolbar = u.el('header', 'wf-toolbar', panelWindow);
      const tabs = u.el('nav', 'wf-tabs', toolbar);
      [ ['✈', 'Flights'], ['▰', 'Stays'], ['▱', 'Cars'], ['▣', 'Packages'] ].forEach((x, i) => {
        const t = u.el('div', 'wf-tab' + (!i ? ' active' : ''), tabs);
        u.el('b', '', t, x[0]);
        u.el('span', '', t, x[1]);
      });
      Object.assign(_c, { app, canvas, panelWindow, toolbar, header: canvas });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.canvas; },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage wf-stage', _c.panelWindow);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.canvas.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.panelWindow.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.canvas.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-act-in-time-debounce-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-debounce-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1766ca'],
      LOW_ACCENTS: ['#1766ca'],
      parts,
    },
  });
})();
