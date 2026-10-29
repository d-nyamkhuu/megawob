// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('mac-titlebar');
      util.el('span', 'mac-title-icon', header, '◉');
      util.el('span', 'mac-app-name', header, 'PageLayout Pro');
      const winControls = util.el('div', 'mac-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
      const menu = util.el('nav', 'mac-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Arrange', 'Window', 'Help']) {
        const entry = util.el('span', '', menu, item);
        entry.dataset.role = 'menu';
      }
      const toolbar = util.el('div', 'mac-toolbar', document.body);
      const toolbarIcons = [
        '<svg viewBox="0 0 32 36"><path d="M7 3h13l6 6v23H7z"/><path d="M20 3v7h6M11 16h11M11 21h11M11 26h8"/></svg>',
        '<svg viewBox="0 0 36 32"><path d="M3 12 16 3l14 9v16H3z"/><path d="M3 12h27M12 28V17h10v11"/><path d="M25 7l5 4"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="m13 5 18 18-7 7L6 12zM9 9l7-7 6 6-7 7M19 21 7 33M23 25l-7 8"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="M12 9h18v23H12zM6 25H4V3h18v3"/><path d="M16 14h10M16 19h10M16 24h7"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="M10 8h19v24H10zM6 4h19v4M14 3v9h12V3"/><path d="M14 21h11M14 25h11"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="M5 5h26v26H5z"/><path d="M18 11v14M12 14h12"/><path d="M12 25h12"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="M5 5h26v26H5zM10 10h16v16H10z"/><path d="M10 10l16 16M26 10 10 26"/></svg>',
        '<svg viewBox="0 0 36 36"><rect x="4" y="5" width="28" height="26"/><circle cx="12" cy="12" r="3"/><path d="m6 27 8-8 5 5 4-4 7 7"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="M5 9h26M5 18h26M5 27h26"/><path d="m12 5-4 4 4 4M24 14l4 4-4 4M12 23l-4 4 4 4"/></svg>',
        '<svg viewBox="0 0 36 36"><path d="M5 8h26M5 18h26M5 28h26"/><path d="m10 5-5 3 5 3m16-3 5 3-5 3M10 25l-5 3 5 3m16-3 5 3-5 3"/></svg>'
      ];
      for (const [i, label] of ['New', 'Open', 'Cut', 'Copy', 'Paste', 'Text', 'Box', 'Image', 'Align', 'Distribute'].entries()) {
        const tool = util.el('div', 'mac-tool', toolbar);
        const icon = util.el('span', 'mac-tool-icon', tool);
        icon.innerHTML = toolbarIcons[i];
        util.el('span', 'mac-tool-label', tool, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, toolbar, toolbarIcons, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const sidebarStack = util.el('div', 'mac-sidebar', body);
      const assets = util.el('aside', 'mac-assets', sidebarStack);
      const tabs = util.el('div', 'mac-tabs', assets);
      util.el('b', '', tabs, 'Assets');
      util.el('span', '', tabs, 'Styles');
      util.el('span', '', tabs, 'Layers');
      util.el('div', 'mac-select', assets, 'All Assets　 ▾');
      for (const [i, label] of ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'].entries()) {
        const row = util.el('div', `mac-asset${i === 0 ? ' selected' : ''}`, assets);
        util.el('span', `mac-thumb thumb-${i + 1}`, row);
        util.el('span', '', row, label);
      }
      util.el('div', 'mac-divider', assets);
      for (const [shape, label] of [['▰', 'Rectangle'], ['⬭', 'Oval'], ['★', 'Star'], ['―', 'Line']]) {
        const row = util.el('div', 'mac-shape', assets);
        util.el('span', '', row, shape);
        util.el('span', '', row, label);
      }
      S.frameSidebar(_c, sidebarStack);
      Object.assign(_c, { assets, body, tabs, sidebarStack });
    },
    'frame.panel': (base, S) => function (_c) {
      const body = _c.body;
      _c.body = _c.sidebarStack;
      base(_c);
      _c.body = body;
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stageWindow = util.el('div', 'mac-stage-window', body);
      util.el('div', 'mac-stage-head', stageWindow, '▤　Untitled Layout');
      const stage = util.el('main', 'ref-stage', stageWindow);
      const tips = util.el('aside', 'mac-tips', body);
      util.el('h2', '', tips, 'Dragging Tips');
      for (const [title, art] of [['Move cards', '▭　　⇢　 ▯'], ['Resize boxes', '▱　　↘'], ['Align edges', '▰　┆　┆　▰'], ['Space evenly', '▰　↔　▰　↔　▰']]) {
        const tip = util.el('section', 'mac-tip', tips);
        util.el('h3', '', tip, title);
        util.el('div', 'mac-tip-art', tip, art);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, stageWindow, tips });
    },
  };

  env.site({
    name: 'design-align-layout-align-01',
    template: 'site/base',
    design: { parts },
  });
})();
