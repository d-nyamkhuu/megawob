// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-select-05',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-file-manager/explorer',
  design: {
    titleHeight: 0,
    toolbarHeight: 56,
    statusHeight: 0,
    windowRadius: 3,
    parts: (() => {
      return {
        fit: (base, S) => (ctx) => {
          base(ctx);
          const W = Math.min(ctx.size.width, ctx.stage.clientWidth);
          const H = Math.min(ctx.size.height, ctx.stage.clientHeight);
          const compact = W < 1200 || H < 600;
          const recentH = compact ? 116 : 196;
          const winW = Math.round(compact ? W - 28 : Math.min(1200, W * .72));
          const winH = Math.max(140, H - recentH - 28);
          const left = Math.round((W - winW) / 2);
          S.geo = { winW, winH, left, top: 10 };
          ctx.stage.classList.toggle('fm-compact-layout', compact);
          ctx.stage.style.setProperty('--explorer-left', `${left}px`);
          ctx.stage.style.setProperty('--explorer-width', `${winW}px`);
          ctx.stage.style.setProperty('--recent-top', `${winH + 22}px`);
          ctx.stage.style.setProperty('--recent-height', `${recentH}px`);
          const note = ctx.stage.parentElement.querySelector('.ref-panel');
          if (note) note.style.height = `${winH}px`;
        },
        paneSize: (base, S) => (ctx) => {
          base(ctx);
          const treeW = Math.round(S.geo.winW * .23);
          S.geo = { treeW, paneW: S.geo.winW - treeW - 3, paneH: S.geo.winH - 58 };
          S.els.win.style.setProperty('--tree-width', `${treeW}px`);
        },
        tileSize: (base, S) => (model, groups) => {
          base(model, groups);
          const count = Math.max(1, groups.reduce((n, g) => n + g.ids.length, 0));
          const headers = S.spec.grouped ? groups.length : 0;
          const available = Math.max(60, S.geo.paneH - 34 - groups.length * 4 - 8);
          const headerH = Math.min(34, Math.max(12, Math.floor(available / (count + headers))));
          const tileH = Math.max(8, Math.min(29, Math.floor((available - headers * headerH) / count)));
          const iconPx = Math.max(7, Math.min(22, tileH - 2));
          S.els.pane.style.setProperty('--fm-header-height', `${headerH}px`);
          S.els.pane.style.setProperty('--fm-name-size', `${Math.min(15, Math.max(11, tileH - 5))}px`);
          S.els.pane.style.setProperty('--fm-row-height', `${tileH}px`);
          S.sizes = { rowH: tileH, listCols: 'minmax(0, 1fr) 27% 16%' };
          return { tileH, iconPx, lines: 1 };
        },
        tile: (_base, S) => (model, id, _height, _iconSize, _lines, box) => S.P.row(model, id, box),
        buildMain: (base, S) => (model) => {
          base(model);
          if (!S.els.pane.querySelector('.fm-lhead')) {
            const head = S.P.listHead(model);
            S.els.pane.prepend(head);
          }
        },
        drawBar: (base, S) => (model) => {
          base(model);
          const folder = document.createElement('span'); folder.className = 'fm-crumb-folder';
          folder.innerHTML = S.P.folderSvg(18);
          S.els.crumbs.prepend(folder);
          let search = S.els.bar.querySelector('.fm-folder-search');
          if (!search) {
            search = document.createElement('div'); search.className = 'fm-folder-search';
            search.innerHTML = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#596373" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg><span></span>';
            S.els.bar.appendChild(search);
          }
          search.lastElementChild.textContent = `Search ${S.P.itemName(model, model.cwd)}`;
        },
        fileSvg: (base) => (kind, extension, size) => {
          const ext = String(extension || '').toLowerCase();
          const style = /^(xlsx?|ods|csv)$/.test(ext) ? ['#17834b','X'] : /^(docx?|odt)$/.test(ext) ? ['#176bc4','W'] : /^(pptx?|odp|key)$/.test(ext) ? ['#df5222','P'] : ext === 'pdf' ? ['#e72c35','A'] : /^(txt|md)$/.test(ext) ? ['#9da3aa',''] : null;
          if (!style) return base(kind, extension, size);
          const [color, letter] = style;
          return `<svg width="${size}" height="${size}" viewBox="0 0 24 26" aria-hidden="true"><path fill="${color}" d="M6 1h12l5 5v18H6z"/><path fill="#fff" opacity=".6" d="M18 1v5h5z"/><path stroke="#fff" opacity=".55" d="M12 9h8M12 13h8M12 17h8M12 21h8"/><path fill="${color}" stroke="#fff" stroke-width=".5" d="M1 5l12-2v22L1 23z"/><text x="7" y="18" font-family="Arial,sans-serif" font-weight="bold" font-size="12" text-anchor="middle" fill="#fff">${letter}</text></svg>`;
        },
        title: (base, S) => (ctx) => {
          base(ctx);
          S.els.title.style.display = 'none';
        },
        css: (base) => (ctx) => base(ctx) + `
          .fm-bar { padding:0 18px; gap:9px; }
          .fm-crumbs { height:40px; }
          .fm-tree { padding:12px 8px; }
          .fm-tr { min-height:42px; }
          .fm-tr svg.fi { width:22px; height:22px; }
          .fm-pane { padding:0 0 4px; overflow:auto; }
          .fm-ghdr, .fm-pane.compact .fm-ghdr {
            height:var(--fm-header-height, 39px); margin:0; padding:0 18px;
          }
          .fm-tiles, .fm-pane.compact .fm-tiles { display:block; padding:6px; }
          .fm-tile, .fm-pane.compact .fm-tile {
            display:grid; grid-template-columns:40px minmax(0,1fr);
            align-items:center; justify-items:start; gap:0; padding:0 12px;
          }
          .fm-tile .ic { width:32px; justify-content:flex-start; }
          .fm-tile .nm, .fm-pane.compact .fm-tile .nm {
            text-align:left; font-size:var(--fm-name-size, 16px); line-height:1.2;
            display:block; white-space:nowrap; text-overflow:ellipsis;
          }
          .fm-status { padding:0 18px; }
          .fm-row { padding:0 18px; }
        `,
        rendered: (base, S) => (ctx) => {
          base(ctx);
          const actions = document.querySelector('.fm-actions');
          if (actions) {
            for (const [key, label] of [['backBtn','Back'],['upBtn','Up'],['trashBtn','Delete'],['undoBtn','Undo']]) {
              const button = S.els[key];
              const slot = actions.querySelector(`[data-command="${label}"]`);
              if (button && slot) {
                button.classList.add('fm-global-action'); button.dataset.command = label;
                if (!button.querySelector('span')) { const text = document.createElement('span'); text.textContent = label; button.appendChild(text); }
                slot.replaceWith(button);
              }
            }
            for (const old of actions.querySelectorAll('.fm-view-action')) old.remove();
            for (const button of S.els.bar.querySelectorAll('button[data-role="xtra"]')) {
              button.classList.add('fm-view-action'); actions.appendChild(button);
            }
          }
          const stage = S.els.win.parentElement;
          if (stage && !stage.querySelector('.fm-recent')) {
            const recent = document.createElement('section'); recent.className = 'fm-recent';
            const files = [
              ['Marketing Plan.xlsx','Documents/Project Alpha','Apr 30, 2014　11:02 AM','22 KB','xlsx'],
              ['Team Meeting Notes.docx','Documents/Project Alpha/Meetings','Apr 29, 2014　4:18 PM','18 KB','docx'],
              ['Product Overview.pptx','Documents/Project Alpha','Apr 28, 2014　9:11 AM','2.9 MB','pptx'],
              ['Specifications.pdf','Documents/Project Alpha/Research','Apr 21, 2014　2:07 PM','1.4 MB','pdf'],
              ['Todo.txt','Documents','Apr 18, 2014　8:33 AM','4 KB','txt']
            ];
            recent.innerHTML = '<h3>Recent Files</h3><div class="fm-recent-head"><span>Name</span><span>Location</span><span>Date modified</span><span>Size</span></div>' + files.map(([name,place,date,size,ext]) => `<div class="fm-recent-row"><b>${S.P.fileSvg('',ext,22)}</b><span>${name}</span><span>${place}</span><span>${date}</span><span>${size}</span></div>`).join('');
            stage.appendChild(recent);
          }
        },
      };
    })(),
  },
});
