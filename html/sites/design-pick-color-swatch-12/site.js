(function () {
  'use strict';
  const palette = { bg: '#d6ecfb', panel: '#f2f9ff', fg: '#29364c', muted: '#1d4a8a', line: '#9cc6e6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('design', 'aero');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.el('div', 'logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 60 70" width="58" height="68"><defs><linearGradient id="leafshine" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#168c1c"/><stop offset=".5" stop-color="#64bd16"/><stop offset="1" stop-color="#e0ef43"/></linearGradient></defs><path d="M6 58C-2 18 22 6 59 1C44 13 60 46 31 58C20 63 13 61 6 58Z" fill="url(#leafshine)"/><path d="M1 69Q23 31 53 7M13 49L10 30M21 38L39 36M27 29L25 13M34 22L47 20" stroke="#82c93d" stroke-width="1.5" fill="none"/></svg>';
      const lt = u.el('div', 'logo-text', logo);
      u.el('div', 'logo-name', lt, 'ColorMatch');
      u.el('div', 'logo-sub', lt, 'Find. Match. Create.');
      const nav = u.el('nav', 'nav', head);
      for (const label of ['Colors', 'Palettes', 'Help']) {
        const b = u.el('button', 'nav-item', nav, label);
        b.type = 'button';
        b.onclick = () => {
          env.log('menu', { label });
          env.log('decoy', { label });
        };
      }
      const intro = u.el('div', 'intro', head);
      u.el('div', 'intro-title', intro, 'Match Colors');
      u.el('div', 'intro-copy', intro, 'A simple way to compare and match colors with precision.');
      u.el('div', 'skyline', head);
      const goal = u.el('section', 'goal-card task-note', head);
      u.el('div', 'target-slot', goal);
      if (_c.display !== 'header') goal.classList.add('target-only');
      if (_c.display !== 'header' && _c.display !== 'hidden') intro.hidden = true;
      const toolbar = u.el('div', 'end-toolbar');
      const topTools = u.el('div', 'top-tools', head);
      Object.assign(_c, { shell, head, goal, toolbar, topTools, header: goal });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.goal.querySelector('.ref-instruction');
      if (note) note.classList.add('goal-text', 'instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.topTools.appendChild(button);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('section', 'main-panel', _c.shell);
      const banner = u.el('div', 'banner', main);
      u.el('div', 'leaves', banner);
      u.el('div', 'orb', banner);
      const bt = u.el('div', 'banner-text', banner);
      u.el('div', 'banner-title', bt, 'Tools are hidden to keep your focus');
      u.el('div', 'banner-copy', bt, 'Explore the color, then expand the tools to make your selection.');
      const exp = u.el('button', 'expand', bt);
      exp.type = 'button';
      exp.innerHTML =
        '<svg viewBox="0 0 20 12" width="22" height="14"><path d="M2 2l8 8 8-8" stroke="#fff" stroke-width="3" fill="none"/></svg><span>Expand tools</span>';
      exp.onclick = () => {
        main.classList.toggle('expanded');
        env.log('expand-tools', {});
      };
      const workspace = u.el('main', 'stage', main);
      workspace.dataset.role = 'workspace';
      const delta = u.el('div', 'difference-value', main, '—');
      delta.dataset.role = 'color-difference';
      delta.hidden = true;
      main.appendChild(_c.toolbar);
      Object.assign(_c, { body: main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.head;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const taskStage = _c.util.el('div', 'task-stage', _c.shell);
      taskStage.dataset.role = 'stage';
      _c.stage = taskStage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.head.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.body.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.head.appendChild(dock);
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
    name: 'design-pick-color-swatch-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2b9a2a'],
      LOW_ACCENTS: ['#2b9a2a'],
      parts,
    },
  });
})();
