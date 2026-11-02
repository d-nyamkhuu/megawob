(function () {
  'use strict';
  const palette = { bg: '#00858a', panel: '#fff', fg: '#000', muted: '#333', line: '#808080' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated briefing window supports all note modes at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { ctx, util: u } = _c;
      const body = document.body;
      body.classList.add('win31');
      const desk = u.el('div', 'desk', body);
      // desktop icons
      const icons = u.el('div', 'icons', desk);
      const icon = (label, draw) => {
        const d = u.el('div', 'dicon', icons);
        const sv = u.svg('svg', { width: 56, height: 56, viewBox: '0 0 56 56' }, d);
        draw(sv);
        u.el('span', '', d, label);
      };
      icon('Program Manager', (s) => {
        u.svg('path', { d: 'M12 5L40 4L44 7V27L50 29V44L44 50H5L7 45L9 29L13 27Z', fill: '#111' }, s);
        u.svg('path', { d: 'M13 5H41V28H13Z', fill: '#deded0', stroke: '#fff' }, s);
        u.svg('path', { d: 'M41 6L44 8V27L41 30Z', fill: '#81817c' }, s);
        u.svg('rect', { x: 16, y: 8, width: 22, height: 17, fill: '#00005e', stroke: '#777' }, s);
        u.svg(
          'path',
          { d: 'M21 13H30V19H21M24 11H34V21H24M20 21H33', fill: 'none', stroke: '#6e84be', 'stroke-width': 1 },
          s,
        );
        u.svg('path', { d: 'M27 15H31V18H27', fill: '#75b036' }, s);
        u.svg('path', { d: 'M11 30H48V43H10Z', fill: '#e9e9d9', stroke: '#fff' }, s);
        u.svg('path', { d: 'M48 30V43L44 47H9L10 43H48', fill: '#8e8e86', stroke: '#444' }, s);
        u.svg('rect', { x: 14, y: 33, width: 10, height: 6, fill: '#000060', stroke: '#333' }, s);
        u.svg('rect', { x: 16, y: 34, width: 6, height: 3, fill: '#d5d5ca' }, s);
        u.svg('rect', { x: 32, y: 34, width: 9, height: 5, fill: '#313144' }, s);
        u.svg('rect', { x: 34, y: 35, width: 5, height: 3, fill: '#f0f0dd' }, s);
        u.svg('path', { d: 'M8 46H44L40 49H5Z', fill: '#ddd', stroke: '#fff' }, s);
      });
      icon('My Files', (s) => {
        u.svg('path', { d: 'M6 17L11 10H22L28 16H49V45H6Z', fill: '#ddcc63', stroke: '#564e18', 'stroke-width': 1 }, s);
        u.svg('path', { d: 'M7 17L12 11H22L27 17M7 17H48', fill: 'none', stroke: '#fffbc0', 'stroke-width': 2 }, s);
        u.svg('path', { d: 'M6 19H49V46H6Z', fill: '#f6ed81', stroke: '#333', 'stroke-width': 1.2 }, s);
        u.svg('path', { d: 'M7 45V20H48', fill: 'none', stroke: '#ffffce', 'stroke-width': 1.5 }, s);
        u.svg('path', { d: 'M49 20V46H7', fill: 'none', stroke: '#8b8038', 'stroke-width': 1.5 }, s);
      });
      icon('Recycle Bin', (s) => {
        u.svg(
          'path',
          { d: 'M8 12L26 5L47 13L42 43L32 50L16 45Z', fill: '#c5c5bc', stroke: '#333', 'stroke-width': 1 },
          s,
        );
        u.svg('path', { d: 'M8 12L29 20L47 13L26 5Z', fill: '#85857c', stroke: '#eee', 'stroke-width': 1.5 }, s);
        u.svg('path', { d: 'M29 20L47 13L42 43L32 50Z', fill: '#91918c' }, s);
        u.svg('path', { d: 'M9 15L27 22L31 48L17 44Z', fill: '#deded1' }, s);
        u.svg(
          'path',
          {
            d: 'M18 26L21 22L25 27M21 23L22 31M17 28L14 32L19 37M15 32L21 33M22 38L26 35L25 30M26 35L20 36',
            fill: 'none',
            stroke: '#399245',
            'stroke-width': 2.2,
          },
          s,
        );
        u.svg('path', { d: 'M9 13L29 21L46 14', fill: 'none', stroke: '#fff', 'stroke-width': 1 }, s);
      });
      const brief = u.el('section', 'win brief', desk);
      u.el('div', 'tbar', brief).append(u.el('span', 'tt', '', 'Task Briefing'));
      u.el('hr', '', brief);
      // main window
      const win = u.el('section', 'win main', desk);
      const tb = u.el('div', 'tbar', win);
      const ti = u.svg('svg', { width: 18, height: 18, viewBox: '0 0 18 18', class: 'ticon' }, tb);
      u.svg('rect', { x: 2, y: 1, width: 13, height: 16, fill: '#fffddd', stroke: '#555' }, ti);
      u.svg(
        'path',
        { d: 'M4 5H12M4 7H12M5 11L8 8L11 13M5 14V9M9 14V6', stroke: '#80ae8b', 'stroke-width': 1.2, fill: 'none' },
        ti,
      );
      u.el('span', 'tt', tb, 'Drawing Task');
      const wc = u.el('div', 'wctl', tb);
      for (const l of ['min', 'max', 'close']) {
        const b = u.el('button', 'wb ' + l, wc);
        b.type = 'button';
        b.tabIndex = -1;
        b.onclick = () => env.log('window-control', { label: l });
      }
      const menu = u.el('nav', 'menubar', win);
      for (const [a, rest] of [
        ['F', 'ile'],
        ['E', 'dit'],
        ['V', 'iew'],
        ['H', 'elp'],
      ]) {
        const s = u.el('span', '', menu);
        u.el('u', '', s, a);
        s.append(rest);
      }
      Object.assign(_c, { desk, brief, win, header: win });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('header-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const { ctx, util: u, win } = _c;
      const tools = u.el('div', 'toolbar', win);
      const pencil = u.el('button', 'tbtn sel', tools);
      pencil.type = 'button';
      const pi = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, pencil);
      u.svg(
        'path',
        {
          d: 'M6 35L10 24L28 5L34 11L16 30Z',
          fill: '#eee447',
          stroke: '#151515',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        pi,
      );
      u.svg('path', { d: 'M11 25L29 7L31 9L14 28Z', fill: '#ffff95' }, pi);
      u.svg('path', { d: 'M15 29L33 11L31 9L13 27Z', fill: '#b39c25' }, pi);
      u.svg(
        'path',
        { d: 'M28 5L30 3L33 3L36 6L36 9L34 11Z', fill: '#d53232', stroke: '#111', 'stroke-width': 1.5 },
        pi,
      );
      u.svg('path', { d: 'M28 6L33 11', stroke: '#ddd', 'stroke-width': 2 }, pi);
      u.svg('path', { d: 'M6 35L10 24L16 30Z', fill: '#e5d5a9', stroke: '#111', 'stroke-width': 1.5 }, pi);
      u.svg('path', { d: 'M5 36L7 31L10 34Z', fill: '#111' }, pi);
      u.el('span', '', pencil, 'Pencil');
      const clr = u.el('button', 'tbtn', tools);
      clr.type = 'button';
      const ci = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, clr);
      u.svg(
        'path',
        {
          d: 'M5 24L20 8H33L36 11L21 29H7Z',
          fill: '#efefef',
          stroke: '#222',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        ci,
      );
      u.svg('path', { d: 'M21 29L36 11V18L21 34Z', fill: '#8b8b8b', stroke: '#222', 'stroke-width': 1.5 }, ci);
      u.svg('path', { d: 'M5 24H19L21 29V34H9L5 29Z', fill: '#c5c5c5', stroke: '#222', 'stroke-width': 1.5 }, ci);
      u.svg('path', { d: 'M7 24L21 9H32', fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const header = _c.header;
      _c.header = tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.win);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        _c.brief.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const { util: u, win } = _c;
      const body = document.body;
      const status = u.el('div', 'status', win);
      u.el('span', 'st', status, 'Tool: Pencil');
      u.el('span', 'stsep', status);
      u.el('span', 'st', status, 'Draw with mouse (press and hold)');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      status.appendChild(foot);
      _c.status = status;
      // taskbar
      const task = u.el('div', 'taskbar', body);
      const st = u.el('div', 'startbtn', task);
      const fl = u.svg('svg', { width: 30, height: 26, viewBox: '0 0 30 26' }, st);
      u.svg('path', { d: 'M7 5L16 2L26 5L25 24L16 21L7 24Z', fill: '#000', stroke: '#000', 'stroke-width': 2 }, fl);
      for (const [d, c] of [
        ['M9 7L15 5V12L9 14Z', '#e03a2a'],
        ['M18 5L23 7V14L18 12Z', '#2aac3c'],
        ['M9 16L15 14V20L9 22Z', '#3854d1'],
        ['M18 14L23 16V22L18 20Z', '#f2cc27'],
      ])
        u.svg('path', { d, fill: c }, fl);
      for (const [x, y] of [
        [2, 5],
        [4, 9],
        [1, 13],
        [4, 17],
        [2, 21],
      ])
        u.svg('rect', { x, y, width: 3, height: 2, fill: '#111' }, fl);
      u.el('span', '', st, 'Start');
      const app = u.el('div', 'taskapp', task);
      const ai = u.svg('svg', { width: 30, height: 28, viewBox: '0 0 30 28' }, app);
      u.svg('rect', { x: 3, y: 3, width: 24, height: 17, fill: '#c0c0c0', stroke: '#222' }, ai);
      u.svg('rect', { x: 6, y: 6, width: 18, height: 11, fill: '#1a2a9a' }, ai);
      u.svg('rect', { x: 8, y: 22, width: 14, height: 3, fill: '#888' }, ai);
      u.el('span', '', app, 'Drawing Task');
      u.el('div', 'clock', task, '10:24 AM');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.status.appendChild(dock);
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
      const tbar = u.el('div', 'tbar', box);
      u.el('span', 'tt', tbar, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'OK');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.type = 'button';
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-circle-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-circle-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
