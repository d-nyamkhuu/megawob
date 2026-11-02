(function () {
  'use strict';
  const C = {
    title: 'DRAW LAB',
    nav: ['TASKS', 'HELP', 'SETTINGS'],
    side: ['Draw', 'Practice', 'Results'],
    dialog: 'Circle Trace',
    yellow: '#ffe65e',
    bg: '#f6f5f3',
    font: '"Courier New",Courier,monospace',
  };
  const palette = { bg: C.bg, panel: '#fdfdfd', fg: '#000', muted: '#111', line: '#000' };
  const PENCIL = 'M3 21L4.5 14.5L17 2Q18 1 19 2L22 5Q23 6 22 7L9.5 19.5ZM16 3L21 8M4.5 14.5L9.5 19.5M3.5 18L6 20.5';
  const ERASER = 'M3 14L13 3Q14 2 15 3L21 9Q22 10 21 11L11 21H8L3 16Q2 15 3 14ZM7 10L16 17';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame has dedicated space for all four note displays.
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
      document.body.className = 'design brut display-' + _c.display;
      _c.root.style.setProperty('--font', C.font);
      _c.root.style.setProperty('--yellow', C.yellow);
      const shell = u.el('div', 'shell', document.body);
      const header = u.el('header', 'head', shell);
      u.el('div', 'title', header, C.title);
      const nav = u.el('nav', 'menu', header);
      for (const t of C.nav) u.el('span', '', nav, t);
      const side = u.el('aside', 'side', shell);
      C.side.forEach((t, i) => {
        const b = u.el('button', 'side-item' + (i === 0 ? ' on' : ''), side, t);
        b.type = 'button';
      });
      const dlg = u.el('section', 'dialog', shell);
      const tb = u.el('div', 'dlg-title', dlg);
      u.el('span', '', tb, C.dialog);
      const sq = u.el('span', 'sq', tb);
      for (let i = 0; i < 3; i++) u.el('i', '', sq);
      Object.assign(_c, { shell, header, dlg });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.shell.appendChild(note);
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const title = _c.body.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task:';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.dlg);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'footer', _c.dlg);
      const icon = (parent, d) => {
        const s = u.svg('svg', {
          width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: '#000',
          'stroke-width': 1.8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
        }, parent);
        u.svg('path', { d }, s);
      };
      const pen = u.el('button', 'tool on', foot);
      pen.type = 'button';
      icon(pen, PENCIL);
      u.el('span', '', pen, 'Pencil');
      const clr = u.el('button', 'tool clear', foot);
      clr.type = 'button';
      icon(clr, ERASER);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('span', 'grow', foot);
      Object.assign(_c, { stage, foot });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      // Secondary actions use the roomy application header.
      for (const b of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(b);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      // Keep the dock in the toolbar so a corner note cannot cover it.
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.type = 'button';
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-circle-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-circle-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#d6246e'],
      LOW_ACCENTS: ['#d6246e'],
      parts,
    },
  });
})();
