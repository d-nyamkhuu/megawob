(function () {
  'use strict';
  const palette = { bg: '#fafafa', panel: '#ffffff', fg: '#212121', muted: '#757575', line: '#e0e0e0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated left pane fits all note modes at every supported size.
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
      document.body.className = 'design material';
      const shell = u.el('div', 'shell display-' + _c.display, document.body);
      const doc = u.el('div', 'doc', shell);
      const bar = u.el('header', 'app-bar', doc);
      u.el('div', 'app-title', bar, 'Color Matcher');
      u.el('div', 'app-hint', bar, 'Match the color to proceed');
      Object.assign(_c, { shell, doc, header: bar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.shell;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'doc-body', _c.doc);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.shell;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      _c.stage = stage;
      const tools = u.el('aside', 'tools', _c.body);
      u.el('div', 'tools-label', tools, 'Tools');
      u.el('div', 'tools-rule', tools);
      const t1 = u.el('div', 'tool-btn on', tools);
      t1.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="#3d55c0" d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12a1 1 0 0 0 .01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/></svg>';
      const t2 = u.el('div', 'tool-btn', tools);
      t2.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#606977" stroke-width="2.4"/><circle cx="12" cy="12" r="4.4" fill="#606977"/><path d="M11 5h2v4h-2z" fill="#606977"/><circle cx="10.4" cy="9.2" r="1.2" fill="#f8f9fb"/></svg>';
      u.el('div', 'tools-rule two', tools);
      const t3 = u.el('div', 'tool-trash', tools);
      t3.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="#606977" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'doc-footer', _c.doc);
      const reset = _c.util.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset-click', {});
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
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
    name: 'design-pick-color-swatch-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3d55c0'],
      LOW_ACCENTS: ['#3d55c0'],
      parts,
    },
  });
})();
