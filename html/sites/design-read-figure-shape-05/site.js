(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-05',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'fa',
    'layout': 'ribbon',
  };
  const GROUPS = [
    [
      'View',
      [
        ['Select', 'sel', 1],
        ['Zoom In', 'zin'],
        ['Zoom Out', 'zout'],
        ['Fit', 'fit'],
      ],
    ],
    [
      'Shape Tools',
      [
        ['Circle', 'circle'],
        ['Square', 'square'],
        ['Triangle', 'tri'],
        ['Star', 'star'],
        ['Text', 'text'],
      ],
    ],
    ['Options', null],
    [
      'Help',
      [
        ['Help', 'help'],
        ['Tutorial', 'doc'],
      ],
    ],
  ];
  function icon(u, p, k) {
    const s = u.svg('svg', { width: 44, height: 44, viewBox: '0 0 44 44', class: 'fa-ico' }, p);
    const A = (t, a) => u.svg(t, a, s);
    const defs = A('defs', {}),
      grad = u.svg('linearGradient', { id: 'tool-' + k, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    const shades = {
      circle: ['#078bff', '#1680ee'],
      square: ['#ff3827', '#f02518'],
      tri: ['#13ae3c', '#04952c'],
      star: ['#ffe817', '#ffca00'],
      text: ['#a653df', '#7b22c0'],
      help: ['#1c95ff', '#0877ec'],
    };
    if (shades[k]) shades[k].forEach((c, i) => u.svg('stop', { offset: i, 'stop-color': c }, grad));
    if (k === 'sel')
      A('path', { d: 'M14 5l0 28 7-6 5 11 5-2-5-11 9 0z', fill: '#1a3b66', stroke: '#fff', 'stroke-width': 1.5 });
    else if (k === 'zin' || k === 'zout') {
      A('circle', { cx: 20, cy: 20, r: 12, fill: 'none', stroke: '#2a4d7a', 'stroke-width': 3 });
      A('path', { d: 'M29 29l11 11', stroke: '#2a4d7a', 'stroke-width': 4 });
      A('path', { d: k === 'zin' ? 'M14 20h12M20 14v12' : 'M14 20h12', stroke: '#2a4d7a', 'stroke-width': 2.5 });
    } else if (k === 'fit')
      A('path', {
        d: 'M7 17V7h10M27 7h10v10M37 27v10H27M17 37H7V27M10 10l10 10M25 25l9 9',
        fill: 'none',
        stroke: '#2a4d7a',
        'stroke-width': 2.5,
        'stroke-dasharray': '8 3',
      });
    else if (k === 'circle') A('circle', { cx: 22, cy: 22, r: 19, fill: '#1285ff' });
    else if (k === 'square') A('rect', { x: 5, y: 5, width: 34, height: 34, fill: '#fa2e20' });
    else if (k === 'tri') A('polygon', { points: '22,5 41,39 3,39', fill: '#1f9d3f' });
    else if (k === 'star')
      A('polygon', { points: '22,4 27,16 40,17 30,26 33,39 22,32 11,39 14,26 4,17 17,16', fill: '#ffd000' });
    else if (k === 'text') {
      A('rect', { x: 7, y: 6, width: 30, height: 8, fill: '#8c3fd0' });
      A('rect', { x: 18, y: 6, width: 8, height: 32, fill: '#8c3fd0' });
    } else if (k === 'help') {
      A('circle', { cx: 22, cy: 22, r: 18, fill: '#1a7cf0' });
      const t = A('text', { x: 22, y: 31, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 700, fill: '#fff' });
      t.textContent = '?';
    } else if (k === 'doc') {
      A('path', { d: 'M10 4h17l9 9v27H10z', fill: '#f4f9ff', stroke: '#1385ed', 'stroke-width': 2 });
      A('path', { d: 'M27 4v10h9M16 20h14M16 27h14M16 33h10', fill: 'none', stroke: '#1385ed', 'stroke-width': 2 });
    }
    if (shades[k])
      s.querySelectorAll('circle,rect,polygon').forEach((e) => {
        if (e.getAttribute('fill') !== 'none') e.setAttribute('fill', 'url(#tool-' + k + ')');
      });
  }
  const palette = { bg: '#cfe8fc', panel: '#ffffff', fg: '#17315a', muted: '#315d85', line: '#a7cdf0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has its own side card and in-pane notice at every size.
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
      document.body.className = 'fa instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const waves = u.svg('svg', { viewBox: '0 0 1672 235', preserveAspectRatio: 'none', class: 'fa-waves' }, app);
      [
        'M-100 4 C120 10 170 108 400 43 S690 16 865 56 S1220 28 1680 -10',
        'M-20 28 C200 146 350 -10 610 14 S920 116 1190 28 S1510 10 1680 72',
        'M980 90 C1150 -48 1320 -30 1450 15 S1610 90 1770 82',
      ].forEach((d, i) => u.svg('path', {
        d, fill: 'none', stroke: '#d4f3ff', 'stroke-width': i === 1 ? 8 : 24, opacity: i === 1 ? 0.28 : 0.14,
      }, waves));
      const head = u.el('header', 'fa-head', app);
      const lg = u.svg('svg', { width: 46, height: 40, viewBox: '0 0 48 48' }, head);
      [
        [2, 2, 25, 24, '#b9e77c'],
        [13, 13, 22, 22, '#88d6a0'],
        [22, 21, 23, 23, '#6ccbf7'],
      ].forEach(([x, y, w, h, c]) =>
        u.svg('rect', { x, y, width: w, height: h, rx: 4, fill: c, stroke: '#d4f3ff', 'stroke-width': 1.4 }, lg));
      const tt = u.el('div', 'fa-brand', head);
      u.el('b', '', tt, 'BrightLearn');
      u.el('small', '', tt, 'Shape Explorer');
      Object.assign(_c, { app, head, header: head });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const rib = u.el('nav', 'fa-ribbon', _c.app);
      GROUPS.forEach(([name, items]) => {
        const g = u.el('div', 'fa-group g-' + name.replace(/\W/g, ''), rib);
        u.el('h4', '', g, name);
        const row = u.el('div', 'fa-row', g);
        if (!items) {
          ['Show Grid', 'Snap to Shapes', 'Show Labels'].forEach((l, i) => {
            const o = u.el('label', 'fa-opt', row);
            const c = u.el('i', i === 0 ? 'fa-chk on' : 'fa-chk', o);
            if (i === 0) c.textContent = '✔';
            u.el('span', '', o, l);
          });
          row.classList.add('opts');
        } else items.forEach(([l, k, on]) => {
          const b = u.el('div', 'fa-tool' + (on ? ' on' : ''), row);
          icon(u, b, k);
          u.el('span', '', b, l);
        });
      });
      const center = u.el('div', 'center', _c.app);
      const stageWrap = u.el('div', 'fa-main', center);
      Object.assign(_c, { center, stageWrap });
    },
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.stageWrap;
      base(_c);
      _c.header = h;
      const note = _c.stageWrap.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('fa-instruction-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task instructions';
        _c.body.insertBefore(panel, _c.stageWrap);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.stageWrap);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('fa-toast');
        _c.stageWrap.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const st = u.el('div', 'fa-status', footer);
      u.el('span', 'fa-count', st, 'Shapes: —');
      u.el('i', '', st);
      u.el('span', 'fa-selected', st, 'Selected: None');
      footer.prepend(st);
      const spacer = u.el('div', 'fa-spacer', footer);
      st.after(spacer);
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1a7cf0'], LOW_ACCENTS: ['#1a7cf0'], parts,
    },
  });
})();
