(function () {
  'use strict';
  const palette = { bg: '#3a2418', panel: '#fbf9f3', fg: '#1d1a16', muted: '#6a5d4a', line: '#cfc6b2' };
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
      const u = _c.util, body = document.body;
      body.classList.add('design', 'wood');
      body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', "Georgia, 'Times New Roman', serif");
      const winCtl = (parent) => {
        const c = u.el('div', 'wctl', parent);
        for (const g of ['m', 'x', 'c']) {
          const b = u.el('button', 'wbtn', c);
          b.type = 'button';
          const s = u.svg(
            'svg',
            { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: '#2a1a0c', 'stroke-width': 2.2 },
            b,
          );
          u.svg(
            'path',
            {
              d: g === 'm' ? 'M3 8H13' : g === 'x' ? 'M3.5 3.5H12.5V12.5H3.5Z' : 'M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5',
            },
            s,
          );
          b.onclick = () => env.log('window-control', { label: g });
        }
      };
      const shell = u.el('div', 'shell', body),
        win = u.el('div', 'win', shell),
        head = u.el('header', 'head', win);
      const logo = u.el('div', 'logo', head);
      const ls = u.svg(
        'svg',
        { width: 40, height: 40, viewBox: '0 0 40 40', fill: 'none', stroke: '#2a1a0c', 'stroke-width': 1.6 },
        logo,
      );
      u.svg(
        'path',
        { d: 'M20 3V9M18 9H22L30 36L22 25L20 13L18 25L10 36Z M11 24Q20 17 29 24 M18 10L14 27M22 10L26 27' },
        ls,
      );
      u.el('div', 'title', head, 'Geometry Workshop');
      winCtl(head);
      const menu = u.el('nav', 'menu', head);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      Object.assign(_c, { shell, win, menu, winCtl, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const content = _c.util.el('div', 'content', _c.win);
      const note = _c.util.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header' && _c.display !== 'panel';
      const header = _c.header;
      _c.header = note;
      base(_c);
      _c.header = header;
      Object.assign(_c, { content, note });
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util, shell = _c.shell, winCtl = _c.winCtl;
      const tw = u.el('aside', 'aside tools', shell);
      const th = u.el('div', 'thead', tw);
      const ws = u.svg(
        'svg',
        { width: 33, height: 33, viewBox: '0 0 32 32', fill: '#d8c598', stroke: '#77603a', 'stroke-width': 0.8 },
        th,
      );
      u.svg('path', { d: 'M3 25L17 11Q15 5 21 2L25 1L21 7L24 11L29 6Q32 14 23 16L9 30Q5 33 2 29Q1 27 3 25Z' }, ws);
      u.svg('circle', { cx: 5.5, cy: 27, r: 1.5, fill: '#4b3b2a', stroke: 'none' }, ws);
      u.el('span', 'tt', th, 'Tools');
      winCtl(th);
      const tb = u.el('div', 'tbody', tw);
      const grp = (name) => {
        const g = u.el('section', 'tgrp', tb);
        u.el('h4', '', g, name);
        return g;
      };
      const g1 = grp('Pointer');
      const sel = u.el('button', 'tbtn big on', g1);
      sel.type = 'button';
      const ss = u.svg(
        'svg',
        {
          width: 34,
          height: 40,
          viewBox: '0 0 32 38',
          fill: '#303034',
          stroke: '#f7f3e8',
          'stroke-width': 1.4,
          'stroke-linejoin': 'round',
        },
        sel,
      );
      u.svg('path', { d: 'M6 2V30L13 23L18 34L23 32L18 21H28Z' }, ss);
      u.el('span', '', sel, 'Select');
      const g2 = grp('View');
      const row = u.el('div', 'trow', g2);
      for (const [n, p] of [
        ['Zoom In', 'M22 22L30 30M24 14A10 10 0 1 1 4 14A10 10 0 1 1 24 14M9 14H19M14 9V19'],
        ['Zoom Out', 'M22 22L30 30M24 14A10 10 0 1 1 4 14A10 10 0 1 1 24 14M9 14H19'],
        ['Reset', 'M12 7A11 11 0 1 1 5 20'],
      ]) {
        const b = u.el('button', 'tbtn', row);
        b.type = 'button';
        const s = u.svg(
          'svg',
          { width: 32, height: 32, viewBox: '0 0 32 32', fill: 'none', stroke: '#303034', 'stroke-width': 2.7 },
          b,
        );
        u.svg('path', { d: p }, s);
        u.el('span', '', b, n);
        if (n === 'Reset') {
          u.svg('path', { d: 'M12 1L5 8L12 14Z', fill: '#303034', stroke: 'none' }, s);
          b.onclick = () => env.widgetDef.clear?.();
        }
      }
      const g3 = grp('Options');
      for (const [n, on] of [
        ['Show labels (A, B, V)', 1],
        ['Show dotted circle', 1],
        ['Show angle measurement', 0],
      ]) {
        const l = u.el('label', 'opt', g3);
        const i = u.el('input', '', l);
        i.type = 'checkbox';
        i.checked = !!on;
        u.el('span', '', l, n);
      }
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.note });
      _c.note.classList.toggle('instruction-panel', _c.display === 'panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('task-note', 'instruction-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.win.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const coords = _c.util.el('div', 'coords', null, 'x:  —     y:  —');
      const copy = _c.util.el('div', 'footer-copy', null, 'Click a point in the drawing area.');
      footer.prepend(coords, copy);
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
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
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
    name: 'design-click-point-bisect-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#a8843c'], LOW_ACCENTS: ['#a8843c'], parts },
  });
})();
