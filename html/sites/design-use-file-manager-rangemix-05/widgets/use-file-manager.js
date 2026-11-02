// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rangemix-05',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#ffffff',
    fg: '#18243a',
    line: '#dce2e8',
    muted: '#78869a',
    accent: '#4b98ed',
    titleHeight: 54,
    toolbarHeight: 100,
    nameFontSize: 15,
    windowRadius: 0,
    titleLabels: ['📁  Files'],
    lightsChance: 0,
    parts: {
      tileDrag(base, S) {
        // Unlike the template's shared ghost, this reference stays with its gesture
        // when the checker resets or refits the window between episodes.
        return (event, id, collapse, alt) => {
          const ctx = S.ctx;
          const win = S.els.win;
          const ids = (ctx.model.drag && ctx.model.drag.ids) || [id];
          const task = env.taskDef.helpers;
          let ghost = null;
          const cleanup = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            window.removeEventListener('pointercancel', up);
            if (ghost) ghost.remove();
            if (S.els.ghost === ghost) S.els = { ghost: null };
          };
          const current = () => ctx === S.ctx && win.isConnected;
          const move = (ev) => {
            if (!current()) { cleanup(); return; }
            if (!ghost && Math.hypot(ev.clientX - event.clientX, ev.clientY - event.clientY) < 6) return;
            if (!ghost) {
              ghost = S.P.dragGhost(id, ids, task.effective(S.spec) === 'copy' && (alt || ev.altKey));
              ctx.log('grab', { what: 'files', n: ids.length });
            }
            const rect = S.P.winRect();
            ghost.style.left = `${ev.clientX - rect.left + 12}px`;
            ghost.style.top = `${ev.clientY - rect.top + 10}px`;
            const over = S.P.dropAt(ev.clientX, ev.clientY, ids, true);
            const drag = ctx.model.drag;
            if (!drag || !drag.active || JSON.stringify(drag.over) !== JSON.stringify(over)) S.act(task.dragOver(ctx.model, over), true);
          };
          const up = (ev) => {
            cleanup();
            if (!current()) return;
            if (ghost) {
              const over = ev.type === 'pointerup' ? S.P.dropAt(ev.clientX, ev.clientY, ids) : null;
              ctx.log('release', { what: 'files', to: over && over.id });
              S.act(task.dragEnd(ctx.model, S.spec, over ? over.id : null, !!(alt || ev.altKey)));
            } else {
              const model = { ...ctx.model, drag: null };
              S.act(collapse ? task.selectOnly(model, id) : model, true);
            }
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', up);
          window.addEventListener('pointercancel', up);
        };
      },
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          const { W, H } = S.geo;
          const winW = Math.floor(W);
          const winH = Math.floor(H);
          S.geo = { winW, winH, left: 0, top: 0 };
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const { winW, winH } = S.geo;
          const treeW = Math.max(250, Math.round(winW * .20));
          const inspectorH = 0;
          S.els.win.style.setProperty('--fm-inspector-height', '0px');
          S.geo = {
            treeW,
            paneW: winW - treeW - 3,
            paneH: winH - S.D.titleHeight - S.D.toolbarHeight - S.D.statusHeight - 2,
          };
        };
      },
      sizes(base, S) {
        return (ctx) => {
          base(ctx);
          const empty = { names: {}, parent: {}, deleted: [] };
          const counts = S.spec.folders.map((f) => env.taskDef.helpers.childrenOf(empty, S.spec, f.id).length);
          const headers = S.spec.grouped ? Math.max(...S.spec.folders.map((f) => env.taskDef.helpers.groups(empty, S.spec, f.id).length)) : 0;
          S.sizes = { rowH: Math.min(S.sizes.rowH, Math.floor((S.geo.paneH - 48 - headers * 26) / Math.max(1, ...counts))) };
        };
      },
      toolbar(base, S) {
        return (ctx) => {
          base(ctx);
          const bar = S.els.bar;
          const win = S.els.win;
          const search = document.createElement('div');
          search.className = 'fm-search';
          search.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2"/><path d="m15.4 15.4 4.2 4.2"/></svg><span>Search in this folder</span>';
          S.els.crumbs.after(search);
          const tools = document.createElement('div');
          tools.className = 'fm-commandbar';
          tools.setAttribute('aria-hidden', 'true');
          tools.innerHTML = '<span class="fm-command"><b class="fm-cmd-new">＋</b><i>New folder</i></span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-upload">⇧ <i>Upload</i></span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-cut">✂ <i>Cut</i></span><span class="fm-command fm-cmd-copy">▢ <i>Copy</i></span><span class="fm-command fm-cmd-paste">▤ <i>Paste</i></span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-delete">▤ <i>Delete</i></span><span class="fm-command fm-cmd-rename">↔ <i>Rename</i></span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-undo">↶ <i>Undo</i></span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-view">▦ <i>View⌄</i></span>';
          bar.after(tools);
          win.classList.add('fm-windows-tools');
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          // Reference-style left navigation summary, alongside the interactive tree.
          const summary = document.createElement('aside');
          summary.className = 'fm-location-summary';
          summary.setAttribute('aria-hidden', 'true');
          summary.innerHTML = '<div class="fm-ls-heading">Locations</div><div class="fm-ls-link active"><span class="fm-ls-icon">▰</span>My Files</div><div class="fm-ls-link"><span class="fm-ls-icon">♟</span>Shared with Me</div><div class="fm-ls-link"><span class="fm-ls-icon">★</span>Starred</div><div class="fm-ls-link"><span class="fm-ls-icon">▤</span>Recycle Bin</div><div class="fm-ls-summary"><b>Folder Summary</b><div><span>Total items</span><span>12</span></div><div><span>Folders</span><span>4</span></div><div><span>Files</span><span>8</span></div><div><span>Size</span><span>128 MB</span></div></div>';
          S.els.win.append(summary);
        };
      },
      status(base, S) {
        return (ctx) => {
          base(ctx);
          S.els.pane.after(S.els.status);
        };
      },
    },
  },
});
