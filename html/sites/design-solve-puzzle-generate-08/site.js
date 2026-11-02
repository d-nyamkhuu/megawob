(function () {
  'use strict';
  const palette = { bg: '#c8c7c1', panel: '#c9c8c2', fg: '#171717', muted: '#777873', line: '#777873' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'industrial ribbon instruction-' + _c.display;
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
      u.el('span', '', top, 'CalibPro 1.3  -  Sensor Calibration Utility');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        u.el('span', 'window-control ' + kind, wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
      }
      const menu = u.el('nav', 'menu', app);
      ['File', 'Tools', 'View', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const ribbon = u.el('section', 'ribbon', app);
      const groups = [
        ['Session', [['▯', 'New'], ['▱', 'Open'], ['▣', 'Save']]],
        ['Device', [['⌁', 'Connect'], ['◌', 'Disconnect'], ['⚙', 'Settings']]],
        ['Calibration', [['⊙', 'Calibrate'], ['▥', 'View Log'], ['▤', 'Export']]],
        ['System', [['🔧', 'Preferences'], ['?', 'Help']]],
      ];
      let toolbar;
      groups.forEach(([label, items]) => {
        const g = u.el('div', 'ribbon-group', ribbon);
        const row = u.el('div', 'ribbon-buttons', g);
        items.forEach(([icon, text]) => {
          const b = u.el('div', 'ribbon-button', row);
          u.el('span', 'ribbon-icon', b, icon);
          u.el('span', '', b, text);
        });
        u.el('div', 'ribbon-label', g, label);
        toolbar = row;
      });
      u.el('div', 'workspace-title', app, 'Random Number Calibration');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, center, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'mode-header');
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief', 'mode-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'mode-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'bottom', _c.app);
      ['Ready', 'Device: CAL-200', 'Status: Connected', '18 Apr 2004   14:27'].forEach((x, i) =>
        _c.util.el('div', 'status-cell status-' + i, footer, x),
      );
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      footer.firstElementChild.appendChild(foot);
      _c.status = footer.firstElementChild;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.querySelector('.menu').appendChild(dock);
    },
    'frame.end': (base) => (_c) => {
      if (_c.submit) _c.submit.classList.add('calib-end-' + _c.placement);
      return base(_c);
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
    name: 'design-solve-puzzle-generate-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-generate-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6c252c'],
      LOW_ACCENTS: ['#6c252c'],
      parts,
    },
  });
})();
