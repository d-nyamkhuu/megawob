(function () {
  'use strict';
  const palette = { bg: '#77737a', panel: '#d4d2cd', fg: '#17202e', muted: '#55565a', line: '#8d8b87' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const desktop = u.el('div', 'ds-desktop', document.body);
      const win = u.el('section', 'ds-window', desktop);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-app-icon', top, '▤');
      u.el('span', 'ds-brand', top, 'Display Calibration Utility');
      u.el('small', 'ds-version', top, 'v1.4.2');
      const controls = u.el('span', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('b', '', controls, x));
      Object.assign(_c, { desktop, win, top, header: top });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'ds-menu', _c.win);
      ['File', 'Tools', 'Profiles', 'Help'].forEach((x) => _c.util.el('span', '', menu, x));
      _c.menu = menu;
      const body = _c.util.el('div', 'ds-body', _c.win);
      const rail = _c.util.el('aside', 'ds-rail', body);
      ['▸ Login', 'Calibration', 'Display Info', 'Color Profiles', 'Settings', 'Diagnostics'].forEach((x, i) => {
        _c.util.el('div', i === 0 ? 'active' : '', rail, x);
      });
      const content = _c.util.el('div', 'ds-content', body);
      if (_c.display === 'panel') content.classList.add('ds-panel-mode');
      Object.assign(_c, { body, content });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.display === 'header'
        ? _c.util.el('aside', 'ds-header-note', _c.content) : _c.content;
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Task Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.appendChild(note);
      }
      const u = _c.util;
      const info = u.el('section', 'ds-system', _c.content);
      const left = u.el('div', 'ds-system-block', info);
      u.el('h3', '', left, 'System Information');
      u.el('p', '', left, 'Display:           LCD-17A\nResolution:        1280 × 1024\nColor Depth:       24-bit\nCurrent Profile:   Default');
      const right = u.el('div', 'ds-system-block ds-status', info);
      u.el('h3', '', right, 'Status');
      u.el('p', '', right, 'Not logged in.\nCalibration tools are disabled.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.win.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('ds-ready');
      text.textContent = 'Ready';
      _c.foot = foot;
      const u = _c.util;
      const taskbar = u.el('div', 'ds-taskbar', _c.desktop);
      u.el('span', 'ds-launch', taskbar, '⚙  Applications   Places   System');
      u.el('span', 'ds-task-icon', taskbar, '▣');
      u.el('span', 'ds-task-active', taskbar, 'Display Calibration Utility');
      u.el('span', 'ds-tray', taskbar, '◖))   Mon Apr 26 2004   10:24');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const title = u.el('header', 'ds-overlay-title', el, ctx.kind === 'cookie' ? 'Update Notice' : 'System Notice');
      u.el('span', 'ds-overlay-x', title, '×');
      u.el('div', 'ds-overlay-copy', el, 'A newer calibration database is available (v1.5). Install it now?');
      const row = u.el('div', 'ds-overlay-row', el);
      u.el('span', 'ds-checkbox', row, '□');
      u.el('span', 'ds-check-label', row, "Don't show this again");
      const dismiss = u.el('button', 'ds-overlay-close', el, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-popup-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#741a24'],
      LOW_ACCENTS: ['#741a24'],
      parts,
    },
  });
})();
