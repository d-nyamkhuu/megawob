// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icon = (body, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const folderIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5a2 2 0 0 1 2-2h6l3 3h7a2 2 0 0 1 2 2v11H2z" fill="#efb521"/><path d="M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="#ffd34e"/></svg>';

  const parts = {
    overlay: (base) => ctx => {
      const result=base(ctx);
      if(ctx.kind === 'chat') {
        const title=document.createElement('div');title.className='win-chat-title';title.innerHTML=icon('<path d="M3 3h18v13H9l-6 5z"/>')+'<span>Chat</span>';result.el.prepend(title);
        const message=result.el.querySelector('.ref-ov-text');if(message)message.textContent='Need any help with this?';
        const time=document.createElement('div');time.className='win-chat-time';time.textContent='10:24 AM';result.el.append(time);
        const input=document.createElement('div');input.className='win-chat-input';input.innerHTML='<span>Type a message...</span>'+icon('<path d="m3 3 19 9-19 9 4-9zM7 12h15"/>');result.el.append(input);
      }
      return result;
    },
    endLabel: (base) => (rng, content) => {
      const label=base(rng,content);
      return rng.fork('explorer/end-label').bool(0.55) ? 'Confirm' : label;
    },
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // Keep the scaffold's theme draws and use the Explorer dark palette.
      for (const [k, v] of Object.entries({ bg:'#13171b', panel:'#1b2229', fg:'#edf0f4', muted:'#bac2cf', line:'#303942' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#52b4ee');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const frame = util.el('div', 'motif-titlebar', header);
      util.el('span', 'motif-system', frame, '📁');
      util.el('strong', 'motif-appname', frame, 'Research');
      const winbuttons = util.el('div', 'motif-winbuttons', frame);
      util.el('span', '', winbuttons, '−');
      util.el('span', '', winbuttons, '□');
      util.el('span', '', winbuttons, '×');
      const address = util.el('div', 'motif-address', header);
      util.el('span', 'motif-arrow', address, '←'); util.el('span', 'motif-arrow', address, '→');
      util.el('span', 'motif-arrow', address, '↓'); util.el('span', 'motif-arrow', address, '↑');
      const path = util.el('div', 'motif-path', address);
      util.el('span', 'motif-path-folder', path, '📁');
      for (const [i, label] of ['This PC', 'Documents', 'Research'].entries()) {
        if (i) util.el('span', 'motif-path-sep', path, '›');
        util.el('span', 'motif-path-label', path, label);
      }
      util.el('span', 'motif-search', address, '⌕　Search Research');
      const menubar = util.el('div', 'motif-menubar', header);
      const newBtn = util.el('span', 'motif-new', menubar);
      newBtn.innerHTML = icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>') + '<span>New</span><span class="win-chevron">⌄</span>';
      for (const [shape, label] of [
        ['<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="m8 16 10-13M16 16 6 3"/>',''],
        ['<rect x="8" y="3" width="12" height="15" rx="2"/><path d="M15 21H5a2 2 0 0 1-2-2V8"/>',''],
        ['<path d="M8 5H5v17h14V5h-3"/><rect x="8" y="2" width="8" height="5" rx="1"/>',''],
        ['<path d="M10 4H3v16h7M14 4h7v16h-7M11 2h3M11 22h3M12.5 2v20M5 15l2-6 2 6M6 13h2"/>',''],
        ['<path d="M4 6h16M9 3h6M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',''],
        ['<path d="M7 3v18M3 7l4-4 4 4M17 21V3M13 17l4 4 4-4"/>','Sort'],
        ['<path d="M3 6h18M3 10h18M3 14h18M3 18h18"/>','View'],
        ['<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>','']
      ]) {
        const item = util.el('span', 'motif-tool-icon' + (label ? ' with-label' : ''), menubar);
        item.innerHTML = icon(shape) + (label ? `<span>${label}</span><span class="win-chevron">⌄</span>` : '');
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { frame, header, menubar, winbuttons, address });
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.menubar.append(_c.headerTools);
    },
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note)_c.frame.insertBefore(note,_c.winbuttons);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const motContent = util.el('div', 'motif-content', body);
      const summary = util.el('section', 'motif-summary', motContent);
      util.el('div', 'motif-folder-icon', summary, '');
      const folder = util.el('div', 'motif-folder-copy', summary);
      util.el('strong', '', folder, 'Research');
      util.el('span', '', folder, 'File folder');
      util.el('span', '', folder, 'Date modified:  10/9/2023 1:06 PM');
      util.el('span', '', folder, 'Path:  C:\\Users\\alex\\Documents\\Research');
      const facts = util.el('div', 'motif-facts', summary);
      for (const [k, v] of [['Path:', '/home/user/Documents'], ['Size:', '2.4 MB (approximate)'], ['Type:', 'Folder'], ['Owner:', 'user'], ['Permissions:', 'drwxr-xr-x']]) {
        const row = util.el('div', '', facts); util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const side = S.frameSidebar(_c, body);
      Object.assign(_c, { body, facts, folder, motContent, summary, side });
    },
    'frame.stage': (base, S) => function (_c) {
      const { motContent, util, menubar } = _c;
      const stage = util.el('main', 'ref-stage', motContent);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { util, side } = _c;
      const foot = document.querySelector('.ref-foot') || util.el('footer', 'ref-foot', document.body);
      util.el('span', 'win-item-count', foot, '');
      const nav = util.el('nav', 'win-dock', foot);
      const dockIcons = {
        Home:'<svg viewBox="0 0 36 36"><path d="m3 16 15-13 15 13v17H23V23H13v10H3z" fill="#d9e0e5"/><path d="m2 16 16-14 16 14-3 4L18 8 5 20z" fill="#df8a4c"/></svg>',
        Gallery:'<svg viewBox="0 0 36 36"><rect x="2" y="1" width="32" height="34" rx="4" fill="#008de4"/><rect x="5" y="5" width="26" height="26" rx="1" fill="#006cc0" stroke="#7edaff"/><circle cx="25" cy="11" r="3" fill="#e5f6ff"/><path d="m6 29 8-13 7 9 4-5 6 9z" fill="#f0f8ff"/></svg>',
        OneDrive:'<svg viewBox="0 0 40 32"><path d="M11 27a9 9 0 0 1-2-18 12 12 0 0 1 23 1 8 8 0 0 1 0 17z" fill="#00a8ef"/><path d="M8 27h24a8 8 0 0 0 5-14L18 19z" fill="#078de0"/></svg>',
        'This PC':'<svg viewBox="0 0 36 36"><defs><linearGradient id="win-monitor" x2="1" y2="1"><stop stop-color="#22d5e9"/><stop offset="1" stop-color="#008ee7"/></linearGradient></defs><rect x="2" y="2" width="32" height="24" rx="2" fill="url(#win-monitor)"/><path d="M15 27h6v5h7v2H8v-2h7z" fill="#008aca"/></svg>',
        Network:'<svg viewBox="0 0 36 36"><circle cx="18" cy="17" r="16" fill="#00a5f0"/><path d="M2 17h32M5 7h26M5 27h26M18 1v32M18 1c-12 8-12 24 0 32M18 1c12 8 12 24 0 32" fill="none" stroke="#143c59" stroke-width="1.8"/><path d="M12 35h12" stroke="#00a5f0" stroke-width="2"/></svg>'
      };
      for (const label of ['Home','Gallery','OneDrive','This PC','Network']) {
        const item = util.el('div', 'win-dock-item' + (label === 'This PC' ? ' current' : ''), nav);
        util.el('span', 'win-dock-icon', item).innerHTML=dockIcons[label];
        util.el('span', '', item, label);
      }
      const views=util.el('div','win-view-controls',foot);
      util.el('span','current',views).innerHTML=icon('<path d="M7 5h14M7 12h14M7 19h14M2 5h1M2 12h1M2 19h1"/>');
      util.el('span','',views).innerHTML=icon('<rect x="2" y="2" width="8" height="8"/><rect x="14" y="2" width="8" height="8"/><rect x="2" y="14" width="8" height="8"/><rect x="14" y="14" width="8" height="8"/>');
      util.el('span','',views,'⌄');
      if (side) {
        const more = util.el('details', 'win-more', foot);
        util.el('summary', '', more, '⋯');
        more.append(side);
      }
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if(_c.placement === 'floating' && _c.submit) {
        _c.submit.className='ref-submit';
        _c.headerTools.append(_c.submit);
        const dock=document.querySelector('.ref-float-dock');if(dock)dock.remove();
      }
    },
  };

  env.site({
    name: 'design-use-file-manager-multimove-05',
    template: 'site/base',
    design: { parts },
  });

})();
