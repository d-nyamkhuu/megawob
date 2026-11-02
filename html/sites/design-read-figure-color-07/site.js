(function () {
  'use strict';
  const palette = { bg: '#fbf8f1', panel: '#dde7f3', fg: '#0e2250', muted: '#4a5f7a', line: '#0e2250' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'pix utility instruction-' + _c.display + (_c.display === 'toast' ? ' ref-has-note' : '');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Color Match');
      u.el('small', 'date', top, 'Mon Apr 25, 2005');
      const tabs = u.el('nav', 'tabs', top);
      ['Task', 'Results', 'Preferences'].forEach((t, i) => u.el('span', i ? 'tab' : 'tab on', tabs, t));
      const rail = u.el('div', 'rail', document.body);
      [
        ['Home', 'M3 13h3v-3h3V7h3V4h3V2h3v3h3v3h3v3h3v3h3v3h-4v13H6V17H3z', ''],
        ['Tasks', 'M2 5h11v3h17v23H2z', 'M4 7h8v3h16v19H4z'],
        ['Tools', 'M3 3h26v27H3z', 'M6 6h4v4H6zM13 6h13v4H13zM6 13h4v4H6zM13 13h13v4H13zM6 20h4v4H6zM13 20h13v4H13z'],
        ['Settings', 'M12 1h8v4h4v3h4v4h4v8h-4v4h-4v4h-4v4h-8v-4H8v-4H4v-4H0v-8h4V8h4V4h4z', 'M12 10h8v2h2v8h-2v2h-8v-2h-2v-8h2z'],
        ['Help', 'M8 2h17v3h4v4h3v17h-4v4H5v-4H2V9h3V5h3z', 'M11 7h10v3h3v7h-4v4h-6v-7h5v-4h-6v3H8V9h3zM14 24h6v4h-6z'],
      ].forEach(([n, d, detail], i) => {
        const b = u.el('div', i === 1 ? 'ri on' : 'ri', rail);
        const svg = u.svg('svg', { width: 42, height: 42, viewBox: '0 0 34 34', 'shape-rendering': 'crispEdges' }, b);
        u.svg('path', { d, fill: i === 1 ? '#153653' : '#edf5f7' }, svg);
        if (detail) u.svg('path', { d: detail, fill: i === 1 ? '#edf5f7' : '#173b60' }, svg);
        u.el('span', '', b, n);
      });
      const center = u.el('div', 'center', app);
      center.style.setProperty('--instruction-size', 'clamp(24px,' + Math.min(4.4, 130 / Math.max(1, _c.ctx.instruction.length)) + 'vw,74px)');
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-color-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#08899a'],
      LOW_ACCENTS: ['#08899a'],
      parts,
    },
  });
})();
