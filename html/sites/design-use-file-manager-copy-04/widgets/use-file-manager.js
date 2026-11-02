// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-copy-04',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 16, nameFontSize: 16, detailFontSize: 15, windowRadius: 0, margin: 0,
    titleHeight: 0, toolbarHeight: 114, statusHeight: 24, tileGap: 0,
    folderTone: '#efbd2e', titleLabels: ['Documents'], separators: ['›'], lightsChance: 0,
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          S.geo = { ...S.geo, fullW: S.geo.W, fullH: S.geo.H, winW: S.geo.W, winH: S.geo.H, left: 0, top: 0 };
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const inspectorW = Math.max(245, Math.round(S.geo.winW * 0.238));
          const treeW = Math.max(190, Math.round(S.geo.winW * 0.174));
          S.geo = { ...S.geo, treeW, paneW: S.geo.winW - treeW - inspectorW - 2,
            paneH: S.geo.winH - 114 - 24 };
        };
      },
      body(base, S) {
        return (ctx) => {
          const { util } = S.ctx;
          const win = S.els.win;
          base(ctx);
          S.els.tree.style.width = S.geo.treeW + 'px';
          const bar = S.els.bar;
          const toolbar = util.el('div', 'aero-toolbar', win);
          win.insertBefore(toolbar, bar);
          const key = (letter, extra={}) => document.dispatchEvent(new KeyboardEvent('keydown', {key:letter, code:'Key'+letter.toUpperCase(), ctrlKey:true, bubbles:true, ...extra}));
          const tool = (icon, label, handler, cls='', nativeButton=null) => {
            const b = nativeButton || util.el('button', 'aero-tool '+cls, toolbar);
            if (nativeButton) {
              b.className = 'fm-ib aero-tool '+cls;
              toolbar.appendChild(b);
            }
            b.type='button'; b.innerHTML = `<span class="aero-tool-icon">${icon}</span><span>${label}</span>`;
            if (handler) b.addEventListener('click', handler);
            return b;
          };
          const folderIcon = S.P.folderSvg(30, 'fi');
          const docIcon = '<svg viewBox="0 0 28 32" width="28" height="32"><path d="M4 1h14l6 6v23H4z" fill="#fff" stroke="#4a9cdb"/><path d="M18 1v6h6" fill="none" stroke="#4a9cdb"/><path d="M8 13h12M8 17h12M8 21h10" stroke="#6aaed8"/></svg>';
          const clipIcon = '<svg viewBox="0 0 30 34" width="29" height="32"><rect x="4" y="5" width="23" height="27" rx="2" fill="#e4a839" stroke="#98722b"/><rect x="7" y="8" width="17" height="21" fill="#fff"/><rect x="10" y="2" width="11" height="6" rx="2" fill="#c8d3de" stroke="#788a9b"/></svg>';
          const [backBtn, upBtn, undoBtn, trashBtn] = [
            bar.querySelector('button[title="Back"]'),
            bar.querySelector('button[title="Up one level"]'),
            bar.querySelector('button[title="Undo"]'),
            bar.querySelector('button[title^="Delete"]'),
          ];
          tool('⬅', 'Back <small>▼</small>', null, 'aero-back', backBtn);
          tool('➜', 'Forward <small>▼</small>', null, 'aero-forward');
          tool('⬆', 'Up', null, 'aero-up', upBtn);
          tool(folderIcon, 'New Folder', () => key('n'), 'aero-divider');
          tool(docIcon, 'Copy', () => key('c'), 'aero-divider');
          tool(clipIcon, 'Paste', () => key('v'));
          tool('✖', 'Delete', null, 'aero-divider aero-delete', trashBtn);
          tool('↶', 'Undo <small>▼</small>', null, 'aero-divider aero-undo', undoBtn);
          const search = util.el('div', 'aero-search', toolbar, 'Search Documents');
          const crumbs = bar.querySelector('.fm-crumbs');
          if (crumbs) {
            const home = util.el('span', 'aero-home', bar);
            home.innerHTML = folderIcon;
            bar.insertBefore(home, crumbs);
          }
          const main = S.els.bodyEl.querySelector('.fm-main');
          if (main) {
            const cols = util.el('div', 'aero-columns', main);
            main.insertBefore(cols, main.firstChild);
            for (const label of ['Name','Size','Type','Date modified']) util.el('span', 'aero-column', cols, label);
            const types = {doc:'Microsoft Word Document',docx:'Microsoft Word Document',xls:'Microsoft Excel Worksheet',xlsx:'Microsoft Excel Worksheet',csv:'Microsoft Excel Comma Separated...',txt:'Text Document',odt:'OpenDocument Text',ods:'OpenDocument Spreadsheet',ppt:'Microsoft PowerPoint Presentation',pdf:'PDF Document'};
            const decorateRows = () => { main.querySelectorAll('.fm-tile:not(:has(.aero-file-name))').forEach(tile => {
              tile.classList.add('aero-detailed');
              const name = tile.textContent.trim();
              const ext = (name.match(/\.([a-z0-9]+)$/i)||[])[1]?.toLowerCase();
              const cell = util.el('span', 'aero-file-name', tile);
              while (tile.firstChild !== cell) cell.appendChild(tile.firstChild);
              const hash = [...name].reduce((a,c)=>a+c.charCodeAt(0),0);
              util.el('span', 'aero-file-size', tile, ext ? `${(hash%88)+4} KB` : '');
              util.el('span', 'aero-file-type', tile, ext ? (types[ext]||`${ext.toUpperCase()} File`) : 'File folder');
              util.el('span', 'aero-file-date', tile, `4/${7+(hash%8)}/2024 ${1+(hash%12)}:${String(hash%60).padStart(2,'0')} PM`);
            });
              const count = main.querySelectorAll('.fm-tile').length;
              const footText = document.querySelector('.ref-foot-text');
              if (footText) footText.textContent = `${count} items`;
            };
            decorateRows();
            new MutationObserver(decorateRows).observe(main, {childList:true, subtree:true});
          }
          const inspector = util.el('aside', 'fm-inspector', S.els.bodyEl);
          util.el('h2', 'aero-help-title', inspector, 'File Explorer Help');
          const art = util.el('div', 'aero-help-art', inspector);
          art.innerHTML = '<div class="aero-hill"></div><div class="aero-folder-art">'+S.P.folderSvg(100,'fi')+'</div><div class="aero-glass one"></div><div class="aero-glass two"></div><div class="aero-star">✦</div>';
          const note = document.querySelector('.ref-panel');
          if (note) { inspector.insertBefore(note, art); art.remove(); }
          util.el('h3', 'aero-help-subtitle', inspector, 'Common tasks');
          const tips = [
            [folderIcon,'Open a folder or file','Double-click to open.'],
            [docIcon,'Select multiple items','Hold Ctrl to select individually, or Shift to select a range.'],
            ['➜','Copy files to another folder','Select the files, then drag and drop them into the destination folder (for example, Downloads).'],
            ['✖','Delete files','Select the files, and press Delete. You can undo a delete with the Undo button.'],
            ['↶','Rename a file','Right-click the file and choose Rename, or press F2.'],
          ];
          for (const [icon, head, info] of tips) {
            const row = util.el('div', 'aero-help-tip', inspector);
            util.el('span', 'aero-help-tip-icon', row).innerHTML = icon;
            const copy = util.el('div', 'aero-help-tip-copy', row);
            util.el('strong', '', copy, head);
            util.el('span', '', copy, info);
          }
        };
      },
    },
  },
});
