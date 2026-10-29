// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'cb-titlebar', header);
        util.el('span', 'cb-sun', titlebar, '✿');
        util.el('strong', 'cb-title', titlebar, 'Community Web Builder - Sunflower Garden');
        const windowControls = util.el('div', 'cb-window-controls', titlebar);
        for (const glyph of ['−', '□', '×']) util.el('span', 'cb-window-control', windowControls, glyph);
        const menu = util.el('nav', 'cb-menu', header);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Page', 'Publish', 'Tools', 'Help']) {
          const m = util.el('span', 'cb-menu-item', menu, item);
          m.dataset.role = 'nav';
        }
        const toolbar = util.el('div', 'cb-toolbar', header);
        const toolArt = {
          New: '<svg viewBox="0 0 32 32"><path fill="#fff" stroke="#111" stroke-width="2" d="M6 2h13l8 8v20H6z"/><path fill="#dceaff" stroke="#111" stroke-width="2" d="M19 2v8h8"/><path stroke="#2443a6" stroke-width="2" d="M10 16h13M10 21h13M10 26h9"/></svg>',
          Open: '<svg viewBox="0 0 32 32"><path fill="#e8ad18" stroke="#111" stroke-width="2" d="M2 8h11l3 4h14v16H2z"/><path fill="#ffd950" stroke="#111" stroke-width="2" d="M2 13h28l-4 15H2z"/></svg>',
          Preview:
            '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#36a9df" stroke="#111" stroke-width="2"/><path fill="#58a83c" stroke="#14522a" stroke-width="1.5" d="m5 11 6 1 2 4-3 3-1 7-5-5zm13-7 2 5 6 1 4 5-5 1-2 5-5-2 1-6-4-4z"/><path fill="none" stroke="#fff" stroke-width="1.5" d="M4 16h24M16 3c-5 6-5 20 0 26m0-26c5 6 5 20 0 26"/></svg>',
          Publish:
            '<svg viewBox="0 0 32 32"><circle cx="15" cy="17" r="12" fill="#38a9de" stroke="#111" stroke-width="2"/><path fill="#62ad3c" d="m6 11 7 1 2 5-5 2-2 6-5-6zm13-6 2 5 6 2 3 5-6 1-2 5-4-3 1-6-4-4z"/><path fill="#ffe34c" stroke="#111" stroke-width="1.5" d="M23 2v12m-5-5 5-5 5 5"/></svg>',
          Cut: '<svg viewBox="0 0 32 32"><circle cx="7" cy="8" r="4" fill="#e34d47" stroke="#111" stroke-width="2"/><circle cx="7" cy="24" r="4" fill="#e34d47" stroke="#111" stroke-width="2"/><path stroke="#111" stroke-width="2.5" d="m10 10 17 14M10 22 27 8M16 16l5-3"/></svg>',
          Copy: '<svg viewBox="0 0 32 32"><path fill="#b9d3ff" stroke="#111" stroke-width="2" d="M4 7h16v21H4z"/><path fill="#fff" stroke="#111" stroke-width="2" d="M11 3h16v21H11z"/><path stroke="#2443a6" stroke-width="2" d="M14 9h9m-9 5h9m-9 5h6"/></svg>',
          Paste:
            '<svg viewBox="0 0 32 32"><path fill="#fff" stroke="#111" stroke-width="2" d="M6 7h20v23H6z"/><path fill="#e5c74d" stroke="#111" stroke-width="2" d="M11 3h10v8H11z"/><path stroke="#2443a6" stroke-width="2" d="M10 16h12m-12 5h12m-12 5h8"/></svg>',
          Undo: '<svg viewBox="0 0 32 32"><path fill="none" stroke="#17358e" stroke-width="4" d="M12 9H5l7-7M6 9c15-4 22 2 21 13"/></svg>',
          Redo: '<svg viewBox="0 0 32 32"><path fill="none" stroke="#17358e" stroke-width="4" d="M20 9h7l-7-7m7 7C12 5 5 11 6 22"/></svg>',
          Page: '<svg viewBox="0 0 32 32"><path fill="#fff" stroke="#111" stroke-width="2" d="M6 2h14l7 7v21H6z"/><path fill="#dceaff" stroke="#111" stroke-width="2" d="M20 2v7h7"/><path stroke="#2443a6" stroke-width="2" d="M10 14h13M10 19h13M10 24h13"/></svg>',
          Properties:
            '<svg viewBox="0 0 32 32"><path fill="#fff" stroke="#111" stroke-width="2" d="M4 3h24v26H4z"/><path fill="#2443a6" d="M8 8h4v4H8zm0 8h4v4H8zm0 8h4v4H8z"/><path stroke="#111" stroke-width="2" d="M15 10h9m-9 8h9m-9 8h9"/></svg>',
          Media:
            '<svg viewBox="0 0 32 32"><path fill="#fff" stroke="#111" stroke-width="2" d="M2 4h28v24H2z"/><circle cx="22" cy="10" r="3" fill="#ffd94c" stroke="#111"/><path fill="#3d9d42" stroke="#111" stroke-width="1.5" d="m4 24 8-10 5 6 4-4 7 8z"/></svg>',
        };
        for (const [icon, label] of [
          ['▧', 'New'],
          ['📂', 'Open'],
          ['🌐', 'Preview'],
          ['🌐', 'Publish'],
          ['✂', 'Cut'],
          ['▤', 'Copy'],
          ['▣', 'Paste'],
          ['↶', 'Undo'],
          ['↷', 'Redo'],
          ['▤', 'Page'],
          ['☷', 'Properties'],
          ['▧', 'Media'],
        ]) {
          const item = util.el('div', 'cb-tool', toolbar);
          const art = util.el('span', 'cb-tool-icon', item);
          art.innerHTML = toolArt[label];
          util.el('span', 'cb-tool-label', item, label);
        }
        toolbar.appendChild(util.el('span', 'cb-tool-spacer', toolbar));
        S.frameBrand(_c, header);
        Object.assign(_c, { header, menu, titlebar, toolArt, toolbar, windowControls });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        Object.assign(_c, { stage });
      },
  };

  env.site({
    name: 'design-use-site-builder-page-01',
    template: 'site/base',
    design: { parts },
  });
})();
