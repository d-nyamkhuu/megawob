// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rangemix-01',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#191a2b',
    fg: '#e9e9f6',
    line: '#393b56',
    muted: '#b9bad0',
    accent: '#da7081',
    titleHeight: 48,
    toolbarHeight: 50,
    nameFontSize: 13,
    windowRadius: 11,
    titleLabels: ['📁  File Explorer'],
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
          const winW = Math.floor(W > 1100 ? W * .855 : W - 24);
          const winH = Math.floor(W > 1100 ? H * .91 : H - 12);
          S.geo = { winW, winH, left: Math.max(0, W - winW - 12), top: 0 };
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const { winW, winH } = S.geo;
          const treeW = Math.max(160, Math.round(winW * .184));
          const inspectorH = Math.round(Math.min(winH * .31, Math.max(100, (winH - 180) * .36)));
          S.els.win.style.setProperty('--fm-inspector-height', `${inspectorH}px`);
          S.geo = {
            treeW,
            paneW: winW - treeW - 3,
            paneH: winH - S.D.titleHeight - S.D.toolbarHeight - S.D.statusHeight - 54 - inspectorH - 2,
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
          search.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2"/><path d="m15.4 15.4 4.2 4.2"/></svg><span>Search Downloads</span>';
          S.els.crumbs.after(search);
          const tools = document.createElement('div');
          tools.className = 'fm-commandbar';
          tools.setAttribute('aria-hidden', 'true');
          tools.innerHTML = '<span class="fm-command"><b class="fm-cmd-new">＋</b><i>New⌄</i></span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-cut">✂</span><span class="fm-command fm-cmd-copy">▢</span><span class="fm-command fm-cmd-paste">▤</span><span class="fm-command fm-cmd-share">↗</span><span class="fm-command fm-cmd-delete">♜</span><span class="fm-cmd-sep"></span><span class="fm-command fm-cmd-sort">↕ <i>Sort⌄</i></span><span class="fm-command fm-cmd-view">☷ <i>View⌄</i></span><span class="fm-cmd-sep"></span><span class="fm-command">•••</span>';
          bar.after(tools);
          win.classList.add('fm-windows-tools');
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          const inspector = document.createElement('div');
          inspector.className = 'fm-inspector';
          inspector.setAttribute('aria-hidden', 'true');
          inspector.innerHTML = '<div class="fm-ins-empty"><svg class="fm-empty-file" viewBox="0 0 72 96"><path d="M8 1h39l24 24v64a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V7a6 6 0 0 1 6-6Z"/><path d="M47 2v23h23"/></svg><span>No item selected</span></div><div class="fm-ins-meta"><div><span>Type:</span><b>—</b></div><div><span>Size:</span><b>—</b></div><div><span>Date modified:</span><b>—</b></div><div><span>Dimensions:</span><b>—</b></div><div><span>Duration:</span><b>—</b></div><div><span>Title:</span><b>—</b></div><div><span>Authors:</span><b>—</b></div><div><span>Tags:</span><b>—</b></div></div>';
          S.els.main.append(inspector);
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
