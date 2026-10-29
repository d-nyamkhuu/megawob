// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base) => function (_c) {
      base(_c);
      if (!_c.ctx.finish) {
        const place = _c.rng.fork('win95/end-place').pick(['footer', 'header', 'link', 'icon', 'footer', 'footer']);
        _c.placement = place;
        _c.wantFooter = place === 'footer' || place === 'link';
      }
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'gtk-windowbar', document.body);
      winbar.textContent = 'Budget.xlsx - Spreadsheet';
      const winbuttons = util.el('div', 'gtk-window-buttons', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Data', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'gtk-toolbar', document.body);
      const svg = (body) => `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
      const art = {
        0: svg('<path d="M5 2h16l6 6v22H5z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M21 2v7h6" fill="none" stroke="#111" stroke-width="2"/>'),
        1: svg('<path d="M2 10h11l3-4h7v5H3z" fill="#e8d528" stroke="#111" stroke-width="2"/><path d="M2 12h28l-5 16H4z" fill="#ffe552" stroke="#111" stroke-width="2"/>'),
        2: svg('<path d="M8 2h16v8H8z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M3 10h26v14H3z" fill="#bcbcbc" stroke="#111" stroke-width="2"/><path d="M7 18h18v11H7z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M10 22h12m-12 3h12" stroke="#777"/>'),
        3: svg('<path d="M16 2v20m-7-8 7 9 7-9" fill="none" stroke="#111" stroke-width="3"/><path d="M12 25h8" stroke="#111" stroke-width="2"/>'),
        4: svg('<circle cx="7" cy="25" r="4" fill="none" stroke="#1745c2" stroke-width="2"/><circle cx="20" cy="25" r="4" fill="none" stroke="#1745c2" stroke-width="2"/><path d="M9 21 22 3M19 21 8 3" stroke="#111" stroke-width="2"/>'),
        5: svg('<path d="M4 2h16v22H4z" fill="#fff" stroke="#222" stroke-width="2"/><path d="M10 7h17v22H10z" fill="#fff" stroke="#153caa" stroke-width="2"/><path d="M13 12h11m-11 4h11m-11 4h11" stroke="#153caa"/>'),
        6: svg('<path d="M5 5h22v25H5z" fill="#e3bb29" stroke="#111" stroke-width="2"/><path d="M9 8h14v18H9z" fill="#fff" stroke="#111"/><path d="M11 2h10v6H11z" fill="#999" stroke="#111"/>'),
        7: svg('<path d="M23 3 9 17l5 5L29 7z" fill="#d5ae28" stroke="#111" stroke-width="2"/><path d="M8 18c-6 2-4 7-7 10 5 2 11 1 13-6z" fill="#f5d03a" stroke="#111" stroke-width="2"/>'),
        8: svg('<path d="M14 7 4 15l10 8v-5h8c8 0 8 8 8 8 1-12-4-15-12-15h-4z" fill="#1453d1" stroke="#073289" stroke-width="1.5"/>'),
        9: svg('<path d="m18 7 10 8-10 8v-5h-8c-8 0-8 8-8 8-1-12 4-15 12-15h4z" fill="#4a9ad7" stroke="#146499" stroke-width="1.5"/>'),
        23: svg('<path d="M4 27h25" stroke="#111" stroke-width="2"/><rect x="6" y="14" width="5" height="12" fill="#2e9bc7" stroke="#111"/><rect x="14" y="7" width="5" height="19" fill="#141492" stroke="#111"/><rect x="22" y="12" width="5" height="14" fill="#ac38c4" stroke="#111"/>'),
      };
      ['▯', '📂', '▤', '↓', '✂', '▣', '▤', '🖌', '↶', '↷', 'Arial', '10', 'B', 'I', 'U̲', '☰', '≡', '☷', '▣', '%', '❜', '⁺₀', '⁺₀', '▥'].forEach((item, index) => {
        const tool = util.el('span', 'gtk-tool', toolbar, item);
        if (art[index]) tool.innerHTML = art[index];
      });
      const desktop = util.el('div', 'win-desktop', document.body);
      for (const [icon, caption] of [['computer', 'My Computer'], ['folder', 'My Documents'], ['globe', 'Internet Explorer'], ['network', 'Network Neighborhood'], ['trash', 'Recycle Bin']]) {
        const shortcut = util.el('div', 'win-shortcut', desktop);
        util.el('div', `win-shortcut-icon win-${icon}`, shortcut);
        util.el('div', 'win-shortcut-label', shortcut, caption);
      }
      toolbar.after(header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, toolbar, winbar, winbuttons });
    },
    'frame.instruction': (base) => function (_c) {
      if (_c.display === 'header') _c.util.el('span', 'win-title-instruction', _c.winbar, ` — ${_c.ctx.instruction}`);
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      if (_c.display !== 'panel') return;
      const panel = _c.body.querySelector('.ref-panel');
      const heading = panel?.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task';
      if (panel) {
        const close = _c.util.el('button', 'win-panel-close', panel, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close task note');
        close.addEventListener('click', () => { panel.style.visibility = 'hidden'; env.log('note-close'); });
      }
    },
  };

  env.site({
    name: 'design-use-spreadsheet-sort-05',
    template: 'site/base',
    design: { parts },
  });
})();
