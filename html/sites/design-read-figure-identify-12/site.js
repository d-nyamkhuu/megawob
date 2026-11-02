(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#555', line: '#000' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('mac', 'brief-left', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const apple = u.svg('svg', { class: 'apple', viewBox: '0 0 32 36', 'aria-hidden': 'true' }, top);
      u.svg('path', {
        d: 'M23 1c0 5-3 8-7 8 0-4 3-7 7-8zM17 11c5-4 10-1 12 2-7 4-5 11 1 13-2 5-5 10-9 9-3-2-5-2-8 0-5 2-10-8-11-14-1-7 4-12 9-11 3 0 4 2 6 1z',
        fill: 'currentColor',
      }, apple);
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', 'mi', top, m);
      u.el('span', 'clock', top, '10:24 AM');
      u.el('span', 'help-icon', top, '?');
      const computer = u.svg('svg', { class: 'computer-icon', viewBox: '0 0 36 36' }, top);
      u.svg('path', {
        d: 'M9 3h20v24H9zM12 6h14v15H12zM6 28h26l2 5H3z',
        fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
      }, computer);
      const titleBar = u.el('div', 'tbar', app);
      u.el('span', 'window-title', titleBar, 'Shape Quiz');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      const asideTitle = u.el('div', 'tbar', aside);
      u.el('span', 'window-title', asideTitle, 'Task Details');
      const kv = u.el('div', 'kv', aside);
      for (const r of [['Task', 'Shape Quiz'], ['Items', '1'], ['Time Limit', 'Not timed'], ['Status', 'Ready']]) {
        const p = u.el('p', '', kv);
        u.el('b', '', p, r[0] + ': ');
        p.append(r[1]);
      }
      u.el('div', 'note', aside, 'The workspace layout is ready.');
      Object.assign(_c, { app, center, aside, header: titleBar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
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
      const rows = document.querySelectorAll('.kv p');
      if (rows[2]) rows[2].lastChild.textContent = '01:00 (paused)';
      if (rows[3]) rows[3].lastChild.textContent = 'Waiting for layout';
      const note = document.querySelector('.aside .note');
      if (note) note.textContent = 'The timer will start after the layout is restored.';
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      const dlg = u.el('div', 'dlg', el);
      u.el('b', '', dlg, 'Layout could not be restored.');
      u.el('p', '', dlg, 'The previous window layout could not be restored.\nSome panels may be out of place.');
      const warning = u.svg('svg', { class: 'warning-icon', viewBox: '0 0 90 90', 'aria-hidden': 'true' }, dlg);
      u.svg(
        'path',
        {
          d: 'M44 6Q46 4 48 8L85 76Q88 81 81 81H9Q3 81 6 75Z',
          fill: 'white',
          stroke: 'black',
          'stroke-width': 5,
          'stroke-linejoin': 'round',
        },
        warning,
      );
      u.svg('path', { d: 'M45 26v29', stroke: 'black', 'stroke-width': 8, 'stroke-linecap': 'round' }, warning);
      u.svg('circle', { cx: 45, cy: 68, r: 4, fill: 'black' }, warning);
      el.title = messages[ctx.kind];
      const dismiss = u.el('button', 'dbtn', dlg, 'Use default layout');
      dismiss.addEventListener('click', () => {
        ctx.dismiss();
        const rows = document.querySelectorAll('.kv p');
        if (rows[2]) rows[2].lastChild.textContent = 'Not timed';
        if (rows[3]) rows[3].lastChild.textContent = 'Ready';
        const note = document.querySelector('.aside .note');
        if (note) note.textContent = 'The workspace layout has been restored.';
      });
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-identify-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'mac.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-read-figure-identify-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
