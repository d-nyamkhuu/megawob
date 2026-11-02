(function () {
  'use strict';
  const palette = { bg: '#bdbdbd', panel: '#f4f4f4', fg: '#111111', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'os2-workplace instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'title-icon' }, top);
      u.svg('circle', { cx: 14, cy: 14, r: 11, fill: '#b9d9ff', stroke: '#102c54', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M14 4 8 13l5 2-2 8 9-12-5-1z', fill: '#663e92', stroke: '#24123a', 'stroke-width': 1 }, icon);
      u.el('span', 'window-title', top, 'OS/2 Workplace Shell - Number Order');
      const wc = u.el('div', 'native-window-controls', top);
      [
        ['min', 'M3 12h14'],
        ['max', 'M4 4h12v12H4z'],
        ['close', 'M4 4l12 12M16 4 4 16'],
      ].forEach(([kind, d]) => {
        const box = u.el('span', 'window-control ' + kind, wc);
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, box);
        u.svg('path', { d, fill: 'none', stroke: '#111', 'stroke-width': 2 }, svg);
      });
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      Object.assign(_c, { app, menu, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      // Build the original task panes before inserting the template's note.
      const u = _c.util;
      const work = u.el('div', 'workarea', _c.app);
      const center = u.el('section', 'center', work);
      const header = _c.header;
      _c.header = center;
      base(_c);
      _c.header = header;
      const note = center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      const aside = u.el('aside', 'aside', work);
      const tabs = u.el('div', 'tabs', aside);
      [['Instructions', true], ['Details', false], ['Notes', false]].forEach(([x, on]) => {
        u.el('div', 'tab' + (on ? ' active' : ''), tabs, x);
      });
      const page = u.el('div', 'instruction-page', aside);
      Object.assign(_c, { work, center, page });
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('chrome-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.page;
      base(_c);
      _c.body = body;
      const u = _c.util;
      if (_c.display !== 'panel' && _c.display !== 'toast') u.el('b', 'aside-title', _c.page, 'Workspace');
      u.el('p', 'aside-copy', _c.page, 'Number Order\nWorkplace Shell exercise');
      u.el('hr', '', _c.page);
      u.el('b', 'progress-title', _c.page, 'Progress');
      const track = u.el('div', 'progress-track', _c.page);
      const fill = u.el('div', 'progress-fill', track);
      fill.dataset.progress = 'fill';
      const progress = u.el('div', 'progress-text', _c.page, '0 of 11 selected');
      progress.dataset.progress = 'text';
      Object.assign(_c, { fill, progress });
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('section', 'stage', _c.center);
      let selectedCount = 0;
      stage.addEventListener('click', (event) => {
        if (!event.target.closest('.number-tile')) return;
        selectedCount = Math.min(11, selectedCount + 1);
        _c.progress.textContent = selectedCount + ' of 11 selected';
        _c.fill.style.width = (selectedCount / 11) * 100 + '%';
      });
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.page.prepend(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      const ready = footer.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready';
      const dates = _c.util.el('div', 'system-info', footer);
      _c.util.el('span', 'date', dates, 'Mar 10, 1994');
      _c.util.el('span', 'time', dates, '10:24 AM');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.page.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
    name: 'design-read-figure-ascending-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#00cbd0'],
      LOW_ACCENTS: ['#00cbd0'],
      parts,
    },
  });
})();
