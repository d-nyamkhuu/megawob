(function () {
  'use strict';
  const palette = { bg: '#eeece0', panel: '#eeece0', fg: '#111111', muted: '#0a3ba8', line: '#c9c5b8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design laboratory';
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      const icon = u.el('div', 'app-icon', title, '');
      icon.innerHTML =
        '<svg viewBox="0 0 32 32" width="100%" height="100%"><defs><linearGradient id="paletteGold" x2="0" y2="1"><stop stop-color="#ffff8c"/><stop offset="1" stop-color="#ebbe25"/></linearGradient></defs><path d="M29 12C28 4 18 1 10 5S0 17 4 24s12 8 16 4c3-3-2-5 0-8s10-1 9-8Z" fill="url(#paletteGold)" stroke="#bd9b22"/><ellipse cx="7.5" cy="16" rx="3" ry="2.5" fill="#f33"/><ellipse cx="12" cy="8.5" rx="3" ry="2.3" fill="#31bb4e"/><ellipse cx="21" cy="8.5" rx="3" ry="2.3" fill="#339aff"/><ellipse cx="24" cy="14" rx="2.7" ry="2.3" fill="#f77521"/><ellipse cx="11" cy="24" rx="3" ry="2.5" fill="#466ddd"/><ellipse cx="17" cy="16.5" rx="2.7" ry="3.3" transform="rotate(25 17 16.5)" fill="#0761ea" stroke="#b7a72c"/></svg>';
      u.el('div', 'title', title, 'Color Picker');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name, cls] of [
        ['', 'Minimize', ' minimize'],
        ['', 'Maximize', ' maximize'],
        ['', 'Close', ' close'],
      ]) {
        const b = u.el('button', 'window-button' + cls, controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const note = u.el('section', 'task-note', shell);
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      note.classList.toggle('instruction-toast', _c.display === 'toast');
      Object.assign(_c, { shell, header: title, note, windowControls: controls });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.note;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.insertBefore(_c.headerTools, _c.windowControls);
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.note.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.shell);
      const action = u.el('div', 'action-section', footer);
      const reset = u.el('button', 'reset', action, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset-click');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) action.appendChild(foot);
      Object.assign(_c, { footer, action });
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
    name: 'design-pick-color-hex-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-hex-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a3ba8'],
      LOW_ACCENTS: ['#0a3ba8'],
      parts,
    },
  });
})();
