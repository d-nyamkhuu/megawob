(function () {
  'use strict';
  const palette = { bg: '#b0aea4', panel: '#b0aea4', fg: '#0b0b0a', muted: '#0b0b0a', line: '#77776f' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'laboratory');
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title, 'ℒ');
      u.el('div', 'title', title, 'Chromatic Laboratory');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const menu = u.el('nav', 'menu-bar', shell);
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Tools', 'Calibration', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'version', menu, 'ColSys v1.3.2  │  Workstation LX-2004');
      const note = u.el('section', 'task-note', shell);
      note.dataset.instruction = _c.display;
      if (_c.display === 'panel') note.classList.add('instruction-panel');
      if (_c.display === 'toast') note.classList.add('instruction-toast');
      const branding = u.el('div', 'console-brand', note);
      u.el('div', '', branding, 'Color Calibration Console');
      u.el('div', '', branding, 'Spectral Fidelity for a Brighter Tomorrow');
      Object.assign(_c, { shell, menu, branding, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        _c.header.insertBefore(note, _c.branding);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('menu-end-controls');
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        _c.header.insertBefore(panel, _c.branding);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction');
        _c.header.insertBefore(note, _c.branding);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.shell);
      const rackLabel = (parent, text) => {
        const label = u.el('div', 'rack-label', parent);
        u.el('span', '', label, text);
      };
      const status = u.el('section', 'status-section', footer);
      rackLabel(status, 'CALIBRATION STATUS');
      const line = u.el('div', 'status-line', status);
      u.el('span', 'status-led', line);
      u.el('span', 'status-ready', line, 'Ready');
      u.el('span', 'status-divider', line, '│');
      u.el('span', 'status-copy', line, 'Instrument connected. Profile loaded.');
      const difference = u.el('section', 'difference-section', footer);
      rackLabel(difference, 'COLOR DIFFERENCE (ΔE₀₀)');
      const delta = u.el('div', 'difference-value', difference, '—');
      delta.dataset.role = 'color-difference';
      const profile = u.el('section', 'profile-section', footer);
      rackLabel(profile, 'INSTRUMENT PROFILE');
      u.el('div', 'profile-line', profile, 'Display : Generic RGB');
      u.el('div', 'profile-line', profile, 'White Pt: D65   Gamma: 2.2');
      const action = u.el('div', 'action-section', footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      action.appendChild(foot);
      // Keep secondary controls in the menu, leaving the rack's action bay clear.
      for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(button);
      Object.assign(_c, { action, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.action.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        {
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#8c263d'],
      LOW_ACCENTS: ['#8c263d'],
      parts,
    },
  });
})();
