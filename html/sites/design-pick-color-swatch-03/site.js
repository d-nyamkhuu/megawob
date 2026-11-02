(function () {
  'use strict';
  const BAND = ['#112d40', '#194f75', '#216796', '#46a7c4', '#77d7c6', '#6ed067', '#348641', '#375c33', '#9e834e', '#a55f53', '#803552', '#904385', '#40315d'];
  const BAND_W = [108, 100, 111, 118, 127, 129, 126, 120, 113, 106, 102, 97, 79];
  const palette = { bg: '#091e2b', panel: '#0a202d', fg: '#c3ecfa', muted: '#79b6cf', line: '#31566a' };
  function styleNote(_c, selector) {
    const text = _c.note.querySelector(selector);
    if (text) {
      text.classList.add('instruction');
      text.style.fontSize = 'min(4.9cqh, ' + (154 / Math.max(1, _c.ctx.instruction.length)).toFixed(3) + 'cqw)';
    }
  }
  function moveExtras(_c, parent) {
    parent.querySelectorAll('.ref-xtra').forEach((b) => _c.menu.appendChild(b));
  }
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
      const u = _c.util;
      document.body.classList.add('design', 'blueprint');
      const shell = u.el('div', 'shell display-' + _c.display, document.body);
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title);
      u.el('div', 'title', title, 'Color Matcher');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['—', 'Minimize'], ['☐', 'Maximize'], ['✕', 'Close']]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      Object.assign(_c, { shell });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'menu-bar', _c.shell);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const b = u.el('button', 'menu-item', menu, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const src = u.el('section', 'source-row', _c.shell);
      const srcMain = u.el('div', 'source-main', src);
      u.el('div', 'source-label', srcMain, 'Source Image (reference band)');
      const band = u.el('div', 'source-band', srcMain);
      BAND.forEach((c, i) => {
        const s = u.el('div', '', band);
        s.style.background = c;
        s.style.flex = BAND_W[i] + ' 1 0';
      });
      const info = u.el('div', 'source-info', src);
      u.el('div', '', info, 'W: 1200   H: 60');
      u.el('div', '', info, 'X: –     Y: –');
      u.el('div', '', info, 'RGB: –');
      const note = u.el('section', 'task-note instruction-' + _c.display, _c.shell);
      const footer = u.el('footer', 'footer');
      const view = u.el('section', 'foot-sec view-sec', footer);
      u.el('div', 'foot-title', view, 'View Options');
      for (const [label, on] of [['Show crosshair', true], ['Show numeric readouts', false], ['Lock hue (H)', false]]) {
        const row = u.el('div', 'chk-row', view);
        u.el('span', 'chk' + (on ? ' on' : ''), row, on ? '✓' : '');
        u.el('span', '', row, label);
      }
      const samp = u.el('section', 'foot-sec samp-sec', footer);
      u.el('div', 'foot-title', samp, 'Sampling');
      const pick = u.el('button', 'pick-btn', samp);
      pick.type = 'button';
      pick.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28 12l7 7 7-7a6 6 0 0 0-9-8z" fill="#cef2fc"/><path d="M23 13l12 12M27 18L9 36l-3 9 9-3 18-18" fill="none" stroke="#e0f5ff" stroke-width="3"/><path d="M10 36l5 6" stroke="#e0f5ff" stroke-width="2"/></svg><span>Pick from image</span>';
      pick.onclick = () => env.log('tool', { name: 'pick-from-image' });
      const act = u.el('div', 'foot-sec action-section', footer);
      const reset = u.el('button', 'reset', act, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset-decor', {});
      Object.assign(_c, { menu, note, header: note, footer, act });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, '.ref-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.act;
      base(_c);
      _c.header = h;
      moveExtras(_c, _c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const heading = _c.note.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task instruction';
      styleNote(_c, '.ref-panel-text');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.note.appendChild(note);
      styleNote(_c, '.ref-note-text');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.act.appendChild(foot);
        moveExtras(_c, foot);
      }
      _c.shell.appendChild(_c.footer);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shell.classList.add('has-floating-end');
        _c.shell.appendChild(dock);
      }
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
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Workstation notice' }[
          kind
        ],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The color matcher is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the source image before matching.',
          banner: 'The matcher is using the default display profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1679fa'],
      LOW_ACCENTS: ['#1679fa'],
      parts,
    },
  });
})();
