(function () {
  'use strict';
  const palette = { bg: '#e4e4e4', panel: '#dedede', fg: '#111', muted: '#111', line: '#111' };
  const fitNote = (_c) => {
    const note = _c.noteHost;
    const text = note.querySelector('.ref-instruction, .ref-panel-text, .ref-note-text');
    if (!text) return;
    // The original measures the text before adding the panel or toast border.
    text.style.width = note.clientWidth + 'px';
    let size = 4;
    note.style.fontSize = size + 'cqh';
    while (text.getBoundingClientRect().height > _c.shell.clientHeight * 0.145 && size > 2) {
      size -= 0.1;
      note.style.fontSize = size + 'cqh';
    }
    text.style.width = '';
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The console has a dedicated note area even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'laboratory');
      const shell = u.el('div', 'shell', document.body);
      if (_c.ctx.finish) shell.classList.add('finish-mode');
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title);
      u.el('div', 'title', title, 'Color Matcher');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const menu = u.el('nav', 'menu-bar', shell);
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Edit', 'Options', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'version', menu, 'ColSys v1.3.2  │  Workstation LX-2004');
      const noteHost = u.el('section', 'note-host', shell);
      noteHost.classList.toggle('note-panel', _c.display === 'panel');
      noteHost.classList.toggle('note-toast', _c.display === 'toast');
      Object.assign(_c, { shell, menu, noteHost, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.noteHost;
      base(_c);
      _c.header = h;
      fitNote(_c);
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      fitNote(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteHost.appendChild(note);
      fitNote(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('footer');
        _c.shell.appendChild(foot);
        const options = _c.util.el('div', 'footer-options', foot);
        for (const button of foot.querySelectorAll('.ref-xtra')) options.appendChild(button);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: 'design-pick-color-swatch-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
