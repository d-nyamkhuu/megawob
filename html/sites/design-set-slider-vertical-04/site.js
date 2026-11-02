// DeskWrite frame design on the shared site template. SVG ribbon art stays local.
(function () {
  'use strict';
  function drawIcon(u, d, p, key) {
    const s = u.svg(
      'svg',
      {
        viewBox: '0 0 32 32',
        width: 32,
        height: 32,
        class: 'ico',
        'aria-hidden': 'true',
        fill: 'none',
        stroke: '#111',
        'stroke-width': 1.3,
      },
      p,
    );
    const path = (d, extra = {}) => u.svg('path', { d, ...extra }, s);
    if (key === 'Text') {
      const text = u.svg(
        'text',
        {
          x: 5,
          y: 28,
          fill: '#111',
          stroke: 'none',
          'font-family': 'Times New Roman,serif',
          'font-size': 32,
          'font-weight': 'bold',
        },
        s,
      );
      text.textContent = 'A';
    } else if (key === 'Save') {
      path('M4 3H27V29H4Z', { fill: '#111' });
      path('M8 4H23V14H8Z M8 19H24V29H8Z', { fill: '#f3f0e3' });
      path('M17 5H21V12H17Z', { fill: '#111' });
      path('M10 21H22M10 24H22M10 27H22');
    } else if (key === 'Cut') {
      path('M10 3L22 22M22 3L10 22', { 'stroke-width': 2.5 });
      u.svg('circle', { cx: 9, cy: 25, r: 3.2 }, s);
      u.svg('circle', { cx: 23, cy: 25, r: 3.2 }, s);
    } else if (key === 'Preferences') {
      path(
        'M13 2H19L20 6L23 7L26 5L29 9L26 12L27 15L31 16V21L27 22L26 25L28 28L24 31L21 28L18 29L17 32H12L11 28L8 27L5 29L2 25L5 22L4 19L1 18V13L5 12L6 9L4 6L8 3L11 6L13 5Z',
      );
      u.svg('circle', { cx: 16, cy: 17, r: 6 }, s);
    } else if (key === 'Find') {
      u.svg('circle', { cx: 13, cy: 12, r: 8.5 }, s);
      path('M19 19L28 28', { 'stroke-width': 3.5 });
    } else if (key === 'Image') {
      path('M3 5H29V28H3Z');
      path('M4 26L11 16L17 22L22 17L28 26Z', { fill: '#111' });
      u.svg('circle', { cx: 10, cy: 11, r: 2.5 }, s);
    } else if (key === 'Styles') {
      path('M6 3H27V29H6Z', { 'stroke-dasharray': '2 2', 'stroke-width': 1.8 });
      path('M10 7H23V25H10Z', { 'stroke-dasharray': '2 2' });
    } else if (key === 'Open') {
      path('M3 10V8Q3 6 6 6H12L16 11H29V28H3ZM3 14H29');
    } else if (key === 'Undo') {
      path('M12 8L6 13L12 18M6 13H18C29 13 29 25 23 27');
    } else {
      path(d);
      if (key === 'Copy') path('M9 2H20L26 8M20 2V8H26M16 14H23M16 17H23M16 20H23M16 23H23');
      if (key === 'Print') path('M11 22H21M11 25H21M24 15H25');
      if (key === 'Date') path('M11 12H15V18H11ZM10 22H21M10 25H21');
      if (key === 'Paragraph') path('M5 8H25M5 13H22M5 18H25M5 23H21');
    }
    return s;
  }

  const paper = { bg: '#f3f0e3', panel: '#f3f0e3', fg: '#111', muted: '#222', line: '#1a1a1a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      document.body.className = `library instruction-${_c.ctx.display}`;
      base(_c);
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const header = u.el('header', 'dw-title', document.body);
      drawIcon(u, 'M7 3h13l6 6v20H7zM20 3v6h6', header);
      u.el('span', 'dw-app', header, 'DeskWrite');
      u.el('span', 'dw-dash', header, '—');
      u.el('span', 'dw-doc', header, 'Untitled Document');
      const wb = u.el('span', 'dw-wbtns', header);
      for (const t of ['?', '_', '×']) u.el('span', 'dw-wbtn', wb, t);
      Object.assign(_c, { header, wb });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const ribbon = u.el('nav', 'dw-ribbon', document.body);
      const icons = {
        New: 'M8 3h11l6 6v20H8zM19 3v6h6',
        Open: 'M3 9h9l3 3h14v15H3zM3 15h26',
        Save: 'M5 4h20l3 3v21H5zM10 4v8h12V4M9 28v-9h14v9',
        Print: 'M9 12V4h14v8M5 12h22v12h-5v-5H10v5H5zM10 19h12v9H10z',
        Cut: 'M10 3l12 20M22 3L10 23M8 24a3 3 0 1 0 .1 0M24 24a3 3 0 1 0 .1 0',
        Copy: 'M6 5h13v17H6zM13 10h13v18H13z',
        Paste: 'M8 6h16v22H8zM12 3h8v6h-8z',
        Undo: 'M10 12l-6 5 6 5M4 17h15a7 7 0 0 1 0 0 7 7 0 0 1 7 7',
        Text: 'M6 28L16 4l10 24M10 20h12',
        Paragraph: 'M5 6h22M5 11h22M5 16h22M5 21h22M5 26h22',
        Styles: 'M5 5h22v22H5z',
        Image: 'M4 5h24v22H4zM4 22l7-7 6 6 4-4 7 7M20 11a2 2 0 1 0 .1 0',
        Table: 'M4 5h24v22H4zM4 13h24M4 20h24M12 5v22M20 5v22',
        Date: 'M7 3h12l6 6v20H7zM12 17h8M12 22h8',
        Find: 'M13 5a8 8 0 1 0 .1 0M19 19l9 9',
        Spelling: 'M16 8C12 5 8 5 4 6v19c4-1 8-1 12 2 4-3 8-3 12-2V6c-4-1-8-1-12 2zM16 8v19',
        Preferences: 'M16 10a6 6 0 1 0 .1 0M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3',
      };
      for (const [g, items] of [
        ['File', ['New', 'Open', 'Save', 'Print']],
        ['Edit', ['Cut', 'Copy', 'Paste', 'Undo']],
        ['Format', ['Text', 'Paragraph', 'Styles']],
        ['Insert', ['Image', 'Table', 'Date']],
        ['Tools', ['Find', 'Spelling', 'Preferences']],
      ]) {
        const grp = u.el('div', 'dw-group', ribbon);
        u.el('div', 'dw-gname', grp, g);
        const row = u.el('div', 'dw-items', grp);
        for (const it of items) {
          const b = u.el('div', 'dw-item', row);
          drawIcon(u, icons[it], b, it);
          u.el('span', '', b, it);
        }
      }
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const endBtn = _c.endBtn;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add(cls === 'ref-endlink' ? 'dw-end-link' : 'primary');
        return button;
      };
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('dw-title-actions');
      _c.header.insertBefore(_c.headerTools, _c.wb);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'dw-main ref-body', document.body);
      const left = u.el('div', 'dw-left', main);
      u.el('h2', 'dw-h', left, 'Adjust Playback Speed');
      u.el(
        'p',
        'dw-p',
        left,
        'Use the slider on the right to set the playback speed.\nThe current value is shown below the slider.',
      );
      u.el('p', 'dw-p', left, 'Drag the handle to adjust the value.');
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('instruction');
        left.prepend(instruction);
      }
      Object.assign(_c, { body: main, left });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.left });
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        _c.left.prepend(panel);
      }
    },
    'frame.stage': () => (_c) => {
      const { body, util: u } = _c;
      const stage = u.el('main', 'record-stage', body);
      stage.dataset.role = 'stage';
      const note = u.el('aside', 'dw-note', body);
      u.el('div', 'dw-nt', note, 'Controls');
      u.el('div', 'dw-nv', note, 'Playback speed');
      u.el('hr', '', note);
      u.el('p', '', note, 'Drag the handle to set the value. The current value is shown below the slider.');
      Object.assign(_c, { stage });
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.querySelector('.ref-foot') || u.el('footer', '', document.body);
      footer.className = 'dw-status';
      const genericText = footer.querySelector('.ref-foot-text');
      if (genericText) genericText.remove();
      const tools = footer.querySelector('.ref-tools') || u.el('div', '', footer);
      tools.classList.add('footer-actions');
      if (_c.placement === 'link') tools.classList.add('dw-actions-link');
      const status = document.createDocumentFragment();
      u.el('span', '', status, 'Page 1 of 1');
      u.el('i', '', status);
      u.el('span', '', status, 'Words: 0');
      u.el('i', '', status);
      u.el('span', '', status, 'Insert');
      footer.insertBefore(status, tools);
      _c.footerTools = tools;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footerTools.append(dock);
    },
  };

  env.site({
    name: 'design-set-slider-vertical-04',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { paper },
      LOW_THEME: paper,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
