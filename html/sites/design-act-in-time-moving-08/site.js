(function () {
  'use strict';
  const palette = { bg: '#1683d9', panel: '#f3f7fc', fg: '#102b4b', muted: '#47617e', line: '#a8c4e4' };
  function titlebar(u, parent, text) {
    const title = u.el('header', 'ds-titlebar', parent);
    u.el('span', 'ds-appicon', title, '');
    u.el('span', 'ds-brand', title, text);
    const controls = u.el('div', 'ds-window-buttons', title);
    ['−', '□', '×'].forEach((t, i) => {
      const b = u.el('button', 'ds-wb ds-wb-' + i, controls, t);
      b.type = 'button';
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.dataset.dsDisplay = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const primary = u.el('section', 'ds-window ds-primary', document.body);
      titlebar(u, primary, 'Shape Catcher');
      const tabs = u.el('nav', 'ds-tabs', primary);
      ['Home', 'Game', 'View'].forEach((t, i) => u.el('span', i === 0 ? 'active' : '', tabs, t));
      const ribbon = u.el('div', 'ds-ribbon', primary);
      const groups = [
        ['Game Controls', [['Ⅱ', 'Pause'], ['■', 'Reset']]],
        ['Settings', [['⚙', 'Difficulty⌄'], ['▥', 'Sound⌄']]],
        ['Display', [['□', 'Fit to Window'], ['↗', 'Full Screen']]],
      ];
      groups.forEach(([name, items]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        const row = u.el('div', 'ds-ribbon-tools', g);
        items.forEach(([icon, label]) => {
          const b = u.el('button', 'ds-tool', row);
          b.type = 'button';
          u.el('span', 'ds-tool-icon', b, icon);
          u.el('span', '', b, label);
        });
        u.el('div', 'ds-group-label', g, name);
      });
      Object.assign(_c, { primary, ribbon, header: primary });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.ribbon;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const panel = u.el('section', 'ds-window ds-panel', document.body);
      titlebar(u, panel, 'Timer & Controls');
      const tabs = u.el('nav', 'ds-panel-tabs', panel);
      u.el('span', 'active', tabs, 'Control');
      u.el('span', '', tabs, 'Info');
      Object.assign(_c, { body: _c.primary, panel });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panel;
      base(_c);
      _c.body = body;
      const note = _c.panel.querySelector('.ref-panel');
      if (note) note.classList.add('ds-panel-note');
      const u = _c.util;
      const timer = u.el('section', 'ds-timer-card', _c.panel);
      u.el('strong', '', timer, 'Time Remaining');
      const progress = u.el('div', 'ds-progress', timer);
      u.el('i', '', progress);
      const controlsArea = u.el('div', 'ds-panel-controls', _c.panel);
      u.el('div', 'ds-control-label', controlsArea, 'Target Shape');
      u.el('div', 'ds-control-label', controlsArea, 'Board Size');
      u.el('div', 'ds-value', controlsArea, 'Medium');
      u.el('div', 'ds-control-label', controlsArea, 'Speed');
      u.el('div', 'ds-value', controlsArea, 'Normal');
      const actions = u.el('div', 'ds-panel-actions', _c.panel);
      const pause = u.el('button', 'ds-pause', actions, 'Pause');
      pause.type = 'button';
      _c.actions = actions;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.primary);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-instruction-note', 'ds-toast-note');
        _c.primary.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const taskbar = u.el('footer', 'ds-taskbar', document.body);
      u.el('span', 'ds-start', taskbar, '⊞');
      u.el('span', 'ds-taskbar-app', taskbar, '▣');
      u.el('span', 'ds-taskbar-app', taskbar, '▶');
      const foot = document.body.querySelector('.ref-foot');
      taskbar.appendChild(foot);
      const tray = u.el('div', 'ds-tray', taskbar);
      u.el('span', '', tray, '⌃');
      u.el('span', '', tray, '◖');
      u.el('span', '', tray, '▣');
      u.el('span', 'ds-time', tray, '10:15 AM');
      u.el('span', '', tray, '4/22/2008');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
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
    name: 'design-act-in-time-moving-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1479d0'],
      LOW_ACCENTS: ['#1479d0'],
      parts,
    },
  });
})();
