// KDE Breeze frame: local artwork on the shared site frame and behavior.
(function () {
  'use strict';
  const ROWS = [
    ['circle', 'Circle', 'Small', 'Red'],
    ['circle', 'Circle', 'Large', 'Red'],
    ['square', 'Square', 'Small', 'Blue'],
    ['square', 'Square', 'Large', 'Blue'],
    ['triangle', 'Triangle', 'Small', 'Green'],
    ['triangle', 'Triangle', 'Large', 'Green'],
  ];
  const COL = { Red: '#e8282b', Blue: '#1686f5', Green: '#2ca02c' };
  function drawChrome(u, app) {
      const top = u.el('header', 'top', app);
      const ic = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20', class: 'title-icon' }, top);
      u.svg('rect', { x: 1, y: 1, width: 18, height: 18, rx: 2, fill: '#3daee9' }, ic);
      u.svg(
        'path',
        {
          d: 'M7 5l8 11M15 3L6 16M8 13a3 3 0 1 1-3-3 3 3 0 0 1 3 3M16 7a2 2 0 1 1-2-2 2 2 0 0 1 2 2',
          fill: 'none',
          stroke: '#fff',
          'stroke-width': 1.2,
        },
        ic,
      );
      u.el('span', 'ttl', top, 'Shape Counter — Practice');
      const wc = u.el('div', 'wc', top);
      for (const k of ['min', 'max', 'close']) {
        const s = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, wc);
        u.svg(
          'path',
          {
            d: k === 'min' ? 'M2 11h12' : k === 'max' ? 'M2 2h12v12H2z' : 'M2 2l12 12M14 2L2 14',
            fill: 'none',
            stroke: '#31363b',
            'stroke-width': 1.6,
          },
          s,
        );
      }
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const tb = u.el('div', 'toolbar', app);
      const icons = {
        Open: 'M2 6h8l2 3h10v11H2z',
        Save: 'M3 3h15l3 3v15H3zM7 3v6h9V3M7 21v-7h10v7',
        Reset: 'M5 12a7 7 0 1 1 2 5M5 6v6h6',
        Settings:
          'M9 2h6l.7 3 2 .9 2.7-1.2 2.2 4-2.2 2v2.6l2.2 2-2.2 4-2.7-1.2-2 .9-.7 3H9l-.7-3-2-.9-2.7 1.2-2.2-4 2.2-2v-2.6l-2.2-2 2.2-4 2.7 1.2 2-.9zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
      };
      ['Open', 'Save', 'Reset', '|', 'Settings'].forEach((t) => {
        if (t === '|') {
          u.el('i', 'sep', tb);
          return;
        }
        const b = u.el('button', 'tbtn', tb);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
        const s = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 24 24' }, b);
        u.svg(
          'path',
          {
            d: icons[t],
            fill: t === 'Reset' ? 'none' : '#5d7a99',
            'fill-rule': 'evenodd',
            stroke: '#4d6a8a',
            'stroke-width': 2,
            'stroke-linejoin': 'round',
          },
          s,
        );
        u.el('span', '', b, t);
      });
      return tb;
  }

  function drawLedger(u, main) {
      const led = u.el('section', 'ledger', main);
      const hd = u.el('div', 'lrow lhead', led);
      ['Shape type', 'Size', 'Color', 'Count'].forEach((t) => u.el('span', '', hd, t));
      ROWS.forEach((r, i) => {
        const row = u.el('div', 'lrow', led);
        const c = u.el('span', 'shp', row);
        const s = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36' }, c);
        const f = COL[r[3]];
        if (r[0] === 'circle')
          u.svg(
            'circle',
            {
              cx: 18,
              cy: 18,
              r: 17,
              fill: f,
              stroke: r[3] === 'Red' ? '#943338' : r[3] === 'Blue' ? '#23435c' : '#30633a',
              'stroke-width': 1.3,
            },
            s,
          );
        else if (r[0] === 'square')
          u.svg(
            'rect',
            {
              x: 1,
              y: 1,
              width: 34,
              height: 34,
              fill: f,
              stroke: r[3] === 'Red' ? '#943338' : r[3] === 'Blue' ? '#23435c' : '#30633a',
              'stroke-width': 1.3,
            },
            s,
          );
        else
          u.svg(
            'polygon',
            {
              points: '18,1 35,35 1,35',
              fill: f,
              stroke: r[3] === 'Red' ? '#943338' : r[3] === 'Blue' ? '#23435c' : '#30633a',
              'stroke-width': 1.3,
            },
            s,
          );
        u.el('span', 'nm', c, r[1]);
        u.el('span', '', row, r[2]);
        u.el('span', '', row, r[3]);
        const cell = u.el('span', 'cnt', row);
        u.el('i', i === 0 ? 'box focus' : 'box', cell);
      });
  }

  function drawTaskbar(u, app) {
      const tk = u.el('footer', 'taskbar', app);
      function icon(parent, cls, paths, color = '#263341') {
        const svg = u.svg('svg', { viewBox: '0 0 32 32', class: cls }, parent);
        paths.forEach((d) =>
          u.svg(
            'path',
            {
              d,
              fill: 'none',
              stroke: color,
              'stroke-width': 1.7,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
            },
            svg,
          ),
        );
        return svg;
      }
      const km = u.el('span', 'kmark', tk, 'K');
      icon(km, 'kgear', ['M8 4l-2 4-4 1v5l4 1 2 4-2 4 4 3 4-3 4 1 1 4h5'], '#3daee9');
      const folder = u.el('span', 'tapp folder', tk);
      const fs = u.svg('svg', { viewBox: '0 0 32 32' }, folder);
      u.svg('path', { d: 'M2 8h10l3 3h15v19H2z', fill: '#1ba7f7' }, fs);
      u.svg('path', { d: 'M2 8V5h10l3 3h15v4H2z', fill: '#7acaf5' }, fs);
      const terminal = u.el('span', 'tapp terminal', tk);
      u.el('span', '', terminal, '›_');
      const active = u.el('span', 'tapp act', tk);
      icon(
        active,
        'app-scissors',
        ['M11 6l10 20M22 5L10 25M12 20a5 5 0 1 1-5-5 5 5 0 0 1 5 5M24 10a4 4 0 1 1-4-4 4 4 0 0 1 4 4'],
        '#fff',
      );
      const tray = u.el('div', 'tray', tk);
      icon(tray, '', ['M9 6H5v24h21V6h-5M12 3h8v6h-8zM10 14h12M10 19h12M10 24h9']);
      icon(tray, '', ['M4 13h6l7-6v22l-7-6H4zM22 11q8 7 0 14M25 7q12 11 0 22']);
      icon(tray, '', ['M2 11q14-12 28 0M7 16q9-8 18 0M12 21q4-4 8 0M16 26h.1']);
      icon(tray, '', ['M7 21l9-9 9 9']);
      u.el('span', 'clock', tk, '10:24 AM\nApr 24, 2018');
      icon(tk, 'show-desktop', ['M3 5h26v23H3zM6 24h20']);
      return tk;
  }

  const BREEZE = { bg: '#f3f6f8', panel: '#fff', fg: '#162136', muted: '#6e7781', line: '#cfd4d9' };

  env.site({
    name: 'design-read-figure-count-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { light: BREEZE },
      LOW_THEME: BREEZE,
      ACCENTS: ['#1d99f3'],
      LOW_ACCENTS: ['#1d99f3'],
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          document.body.className = 'kde ledger instruction-' + _c.ctx.display;
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The detached briefing area also fits panel and toast at the small viewport.
          _c.display = _c.ctx.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const app = u.el('main', 'app', document.body);
          const toolbar = drawChrome(u, app);
          const right = u.el('section', 'right');
          Object.assign(_c, { app, toolbar, right, header: right });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.right.querySelector('.ref-instruction');
          if (instruction) instruction.classList.add('brief');
          _c.right.querySelector('.ref-spacer')?.remove();
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { decoyBtn, endBtn } = _c;
          // Keep the template's events, labels and accessibility; apply the KDE control classes.
          _c.decoyBtn = (parent, text, collides) => decoyBtn(
            _c.right.contains(parent) ? _c.toolbar : parent, text, collides);
          _c.endBtn = (parent, cls, text) => {
            const form = _c.right.contains(parent) && !cls.includes('ref-icon');
            const button = endBtn(form ? _c.right : parent, cls, text);
            button.classList.add('submit', form ? 'end-form' : 'end-toolbar');
            return button;
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.toolbar.append(_c.headerTools);
        },
        'frame.body': () => (_c) => {
          const { app, right, util: u } = _c;
          const body = u.el('div', 'mainarea ref-body', app);
          drawLedger(u, body);
          body.append(right);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => (_c) => {
          base({ ..._c, body: _c.right });
          const panel = _c.right.querySelector('.ref-panel');
          if (panel) panel.classList.add('brief');
          _c.util.el('p', 'sub', _c.right,
            'Use the preview to review the items. Record your answer in the field or choose an available option.');
          _c.util.el('div', 'pvhead', _c.right, 'Preview');
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('section', 'stage', _c.right);
          // The widget's aside host is part of the original frame's DOM contract.
          _c.util.el('aside', 'aside', document.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('brief');
            _c.right.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          _c.taskbar = drawTaskbar(_c.util, _c.app);
          base(_c);
          const footer = document.querySelector('.ref-foot');
          if (footer) {
            const tools = footer.querySelector('.ref-tools');
            _c.taskbar.insertBefore(tools, _c.taskbar.querySelector('.tray'));
            tools.querySelectorAll('.submit').forEach((button) => {
              button.classList.replace('end-toolbar', 'end-footer');
            });
            footer.remove();
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.taskbar.insertBefore(dock, _c.taskbar.querySelector('.tray'));
            _c.submit.classList.replace('end-toolbar', 'end-footer');
          }
        },
      },
    },
  });
})();
