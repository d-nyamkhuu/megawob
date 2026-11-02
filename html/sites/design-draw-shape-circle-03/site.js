(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#3f51b5', muted: '#757575', line: '#c9cfd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each note mode has its own space above the drawing surface.
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
      document.body.classList.add('design', 'dt');
      document.documentElement.style.setProperty('--font', "Roboto, 'Segoe UI', Arial, sans-serif");
      const shell = u.el('div', 'dt-shell', document.body);
      const head = u.el('header', 'dt-head', shell);
      const tt = u.el('div', 'dt-titles', head);
      u.el('div', 'dt-title', tt, 'Dot Trace');
      u.el('div', 'dt-sub', tt, 'Follow the shape with your mouse.');
      const icons = u.el('div', 'dt-icons', head);
      const q = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none', stroke: '#c5cae9', 'stroke-width': 1.7 }, icons);
      u.svg('circle', { cx: 12, cy: 12, r: 9.5 }, q);
      u.svg('path', { d: 'M9.3 9.5Q9.5 6.8 12 6.8Q14.7 6.9 14.6 9.3Q14.5 10.8 12.6 11.7Q12 12.2 12 13.4M12 16.2V17.4', 'stroke-linecap': 'round' }, q);
      const g = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: '#c5cae9' }, icons);
      u.svg('path', { d: 'M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.200h-4l-.4 2.700a7.400 7.400 0 0 0-1.700 1l-2.500-1-2 3.500L6.600 11a7.500 7.500 0 0 0 0 2l-2.100 1.600 2 3.500 2.500-1a7.400 7.400 0 0 0 1.700 1l.4 2.700h4l.4-2.700a7.400 7.400 0 0 0 1.700-1l2.500 1 2-3.500ZM13 15.500a3.500 3.500 0 1 1 0-7 3.500 3.500 0 0 1 0 7Z' }, g);
      const band = u.el('div', 'dt-band', shell);
      Object.assign(_c, { shell, head, icons, band, header: band });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.band.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('dt-note', 'task-note', 'instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.icons;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.band; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.band.querySelector('.ref-panel');
      if (note) {
        note.classList.add('dt-note', 'task-note', 'instruction-panel');
        const text = note.querySelector('.ref-panel-text');
        text.classList.add('instruction');
        text.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage dt-stage', _c.band);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('dt-note', 'task-note', 'dt-toast');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction');
        text.dataset.display = _c.display;
        _c.band.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('dt-foot');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const clr = _c.util.el('button', 'clear dt-reset', null, 'Reset');
      clr.type = 'button';
      clr.onclick = () => { env.widgetDef.clear?.(); };
      foot.prepend(clr);
      foot.querySelector('.ref-tools').classList.add('dt-foot-actions');
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
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-circle-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-circle-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3949ab'],
      LOW_ACCENTS: ['#3949ab'],
      parts,
    },
  });
})();
