(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated left pane has room for every note mode at all viewports.
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
      document.body.className = 'design mac';
      _c.root.style.setProperty('--font', "Chicago, Geneva, 'Helvetica Neue', Helvetica, Arial, sans-serif");
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('header', 'menubar', shell);
      const apple = u.svg('svg', { class: 'apple', width: 30, height: 34, viewBox: '0 0 22 24' }, bar);
      u.svg('path', {
        d: 'M15 1C15 3 13.500 4.500 11.700 4.700C11.500 2.700 13.200 1 15 1ZM11 7C9.500 6.200 6 5.800 4.200 9C2.400 12 4 18 6.500 20.500C7.700 21.700 9 21.500 10 21C11 20.500 12.300 20.500 13.500 21C14.700 21.500 15.800 21.300 17 19.500C18 18 18.500 17 18.700 16.500C16 15.500 15.500 11 18 9.500C16.500 7 13 6 11 7Z',
        fill: '#000',
      }, apple);
      const menu = u.el('nav', 'menu', bar);
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', '', menu, m);
      u.el('span', 'clock', bar, '10:24 AM');
      const ic = u.svg('svg', { class: 'mi', width: 34, height: 30, viewBox: '0 0 34 30', fill: 'none', stroke: '#000', 'stroke-width': 2 }, bar);
      u.svg('path', { d: 'M5 1H29L33 5V28L30 29H4L1 26V5ZM5 5H29V25H5ZM7 21L13 15L17 18L26 9M7 23H27M12 10L16 12M23 17L26 22' }, ic);
      u.svg('circle', { cx: 11, cy: 8, r: 1.4, fill: '#000' }, ic);
      const main = u.el('div', 'main', shell);
      const noteArea = u.el('section', 'task-note', main);
      noteArea.hidden = _c.display !== 'header';
      const win = u.el('div', 'win', main);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'close-box', tb);
      u.el('span', 'tt', tb, 'Geometry Practice');
      Object.assign(_c, { shell, main, noteArea, win, header: tb });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteArea;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'winbody', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'toolcol', _c.body);
      const paths = [
        ['Select', 'M9 3V25L15 19L20 30L24 28L19 18H27Z', '#000'],
        ['Line', 'M3 29L29 3', 'none'],
        ['Circle', '', 'none'],
        ['Erase', 'M3 21L17 6L29 12V18L15 31L3 26ZM3 21L15 25L29 12M15 25V31M17 6L21 5L29 10V12', 'none'],
      ];
      for (const [n, d, f] of paths) {
        const b = u.el('button', 'mtool' + (n === 'Select' ? ' sel' : ''), aside);
        b.type = 'button';
        b.title = n;
        const s = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 32 32', fill: f, stroke: '#000', 'stroke-width': 1.6 }, b);
        if (d) u.svg('path', { d }, s);
        if (n === 'Circle') {
          u.svg('circle', { cx: 16, cy: 16, r: 13, fill: 'none', 'stroke-dasharray': '3 2' }, s);
          u.svg('circle', { cx: 16, cy: 16, r: 1.2, fill: '#000' }, s);
        }
        b.onclick = () => {
          if (n === 'Erase') env.widgetDef.clear?.();
          else {
            aside.querySelectorAll('.mtool').forEach((x) => x.classList.remove('sel'));
            b.classList.add('sel');
          }
        };
      }
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.main.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      foot.querySelector('.ref-foot-text').textContent = 'Click to place a point.';
      _c.win.appendChild(foot);
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
      const icon = u.svg(
        'svg',
        {
          class: 'ob-icon',
          width: 86,
          height: 76,
          viewBox: '0 0 86 76',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 6,
          'stroke-linejoin': 'miter',
        },
        box,
      );
      u.svg('path', { d: 'M43 6L80 70H6Z' }, icon);
      u.svg('path', { d: 'M43 26V48M43 56V62', 'stroke-width': 7 }, icon);
      const txt = u.el('div', 'ob-text', box);
      u.el('h3', '', txt, 'Important Announcement');
      u.el('p', '', txt, 'New practice sets are now available!\nClick Collapse to continue working.');
      const dismiss = u.el('button', 'dismiss', box, 'Collapse');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss alt', box, 'Accept');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-click-point-right-angle-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-right-angle-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
