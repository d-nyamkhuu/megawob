(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#f4f7fb', fg: '#182238', muted: '#6b7385', line: '#d9dfea' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated note row fits all displays, including the smallest viewport.
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
      document.body.className = 'design neumorphic';
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'app-head', shell);
      const brand = u.el('div', 'brand', head);
      u.el('span', 'brand-dot', brand);
      u.el('span', 'brand-name', brand, 'Color Match');
      const tabs = u.el('nav', 'tabs', head);
      ['Tool', 'History', 'Settings'].forEach((label, i) => {
        const b = u.el('button', 'tab' + (i === 0 ? ' on' : ''), tabs, label);
        b.type = 'button';
        b.onclick = () => env.log('tab', { label });
      });
      const noteRow = u.el('section', 'task-note', shell);
      noteRow.classList.add('note-' + _c.display);
      Object.assign(_c, { shell, header: head, noteRow });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteRow;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.shell;
      const u = _c.util;
      const pal = u.el('aside', 'palette', document.body);
      const ph = u.el('div', 'pal-head', pal);
      u.el('span', '', ph, 'Saved Colors');
      u.el('span', 'pal-plus', ph, '+');
      const grid = u.el('div', 'pal-grid', pal);
      for (const c of ['#51ae58', '#3887fc', '#f9c33b', '#ff7568', '#8b3cce', '#43b4b9', '#c2ccda', '#424954']) {
        const s = u.el('button', 'pal-sw', grid);
        s.type = 'button';
        s.style.background = c;
        s.setAttribute('aria-label', 'Saved color');
        s.onclick = () => env.log('saved-color', { hex: c });
      }
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteRow;
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
      if (note) _c.noteRow.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
      const reset = _c.util.el('button', 'reset', foot, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset');
      foot.insertBefore(reset, foot.firstChild);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this device.',
          toast: 'The color tool is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the saved colors before you start.',
          banner: 'Match the target color as closely as possible.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f80ed'],
      LOW_ACCENTS: ['#2f80ed'],
      parts,
    },
  });
})();
