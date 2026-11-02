(function () {
  'use strict';
  const palette = { bg: '#f4f8fc', panel: '#fff', fg: '#182337', muted: '#62718a', line: '#d4dfeb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // SkyWays uses a reserved bottom row for toast notes, even on short screens.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1260) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      const u = _c.util;
      const win = u.el('header', 'ds-window', document.body);
      u.el('span', 'ds-plane', win, '✈');
      u.el('span', 'ds-brand', win, 'SkyWays');
      u.el('div', 'ds-window-controls', win, '−　□　×');
      const top = u.el('nav', 'ds-top', document.body);
      u.el('span', 'ds-plane ds-main-plane', top, '✈');
      u.el('strong', 'ds-title', top, 'Flights');
      const nav = u.el('div', 'ds-tabs', top);
      ['Departures', 'Arrivals', 'Airlines', 'Airports'].forEach((x, i) => {
        u.el('span', i === 0 ? 'active' : '', nav, x);
      });
      const search = u.el('div', 'ds-global-search', top);
      search.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="8.5" cy="8.5" r="5.8"/><path d="m13 13 4 4"/></svg>';
      u.el('span', '', search, 'Search flights, airports or cities...');
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { top, contentPane: content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('main', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.contentPane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'ds-dock', document.body);
      const items = [['✈', 'Flights'], ['▦', 'Bookings'], ['♧', 'Passengers'], ['▢', 'Airports'], ['▥', 'Reports'], ['⚙', 'Settings']];
      items.forEach((it, i) => {
        const a = u.el('div', i === 0 ? 'ds-dock-item selected' : 'ds-dock-item', dock);
        u.el('span', 'ds-dock-icon', a, it[0]);
        u.el('span', '', a, it[1]);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
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
    name: 'design-find-fact-datagrid-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-datagrid-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0876e8'],
      LOW_ACCENTS: ['#0876e8'],
      parts,
    },
  });
})();
