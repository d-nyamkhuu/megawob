// Design on the shared use-file-manager/explorer template.
let cancelFileDrag = () => {};
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rangemix-03',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#f1f1f1', fg: '#111', muted: '#666', line: '#aaa',
    accent: '#2878bd', windowRadius: 0, titleHeight: 0,
    parts: {
      begin: (base, S) => (ctx) => {
        cancelFileDrag();
        base(ctx);
      },
      fit: (base, S) => (ctx) => {
        // Keep the template's random draws, then fit the native docked window.
        base(ctx);
        S.geo = { winW: ctx.size.width, winH: ctx.size.height, left: 0, top: 0 };
      },
      title: (base, S) => (ctx) => {
        base(ctx);
        // The site supplies the desktop title bar; account for it in paneSize too.
        S.els.title.style.display = 'none';
      },
      sizes: (base, S) => (ctx) => {
        base(ctx);
        const fam = env.taskDef.helpers;
        const empty = { names: {}, parent: {}, deleted: [] };
        let items = 1;
        let groups = 1;
        for (const folder of ctx.spec.folders) {
          items = Math.max(items, fam.childrenOf(empty, ctx.spec, folder.id).length);
          if (ctx.spec.grouped) groups = Math.max(groups, fam.groups(empty, ctx.spec, folder.id).length);
        }
        const available = S.geo.paneH - 20 - 28 - groups * 8 - (ctx.spec.grouped ? groups * 26 : 0);
        S.sizes = {
          rowH: Math.min(S.sizes.rowH, Math.floor(available / items)),
          treeRowH: Math.min(S.sizes.treeRowH, Math.floor((S.geo.paneH - 16) / ctx.spec.folders.length)),
        };
      },
      tileDrag: (base, S) => (event, id, collapse, alt) => {
        cancelFileDrag();
        const ctx = S.ctx;
        const spec = ctx.spec;
        const fam = env.taskDef.helpers;
        const P = S.P;
        const x = event.clientX;
        const y = event.clientY;
        const ids = (ctx.model.drag && ctx.model.drag.ids) || [id];
        let active = false;
        let ghost = null;
        const cleanup = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          window.removeEventListener('pointercancel', up);
          if (ghost) ghost.remove();
          ghost = null;
          S.els = { ghost: null };
        };
        const move = (ev) => {
          if (!active && Math.hypot(ev.clientX - x, ev.clientY - y) < 6) return;
          if (!active) {
            active = true;
            ghost = P.dragGhost(id, ids, fam.effective(spec) === 'copy' && (alt || ev.altKey));
            ctx.log('grab', { what: 'files', n: ids.length });
          }
          const bounds = P.winRect();
          ghost.style.left = ev.clientX - bounds.left + 12 + 'px';
          ghost.style.top = ev.clientY - bounds.top + 10 + 'px';
          const over = P.dropAt(ev.clientX, ev.clientY, ids, true);
          const current = ctx.model.drag;
          if (!current || !current.active || JSON.stringify(current.over) !== JSON.stringify(over)) P.act(fam.dragOver(ctx.model, over), true);
        };
        const up = (ev) => {
          cleanup();
          if (active) {
            const over = ev.type === 'pointerup' ? P.dropAt(ev.clientX, ev.clientY, ids) : null;
            ctx.log('release', { what: 'files', to: over && over.id });
            P.act(fam.dragEnd(ctx.model, spec, over ? over.id : null, !!(alt || ev.altKey)));
          } else {
            let model = { ...ctx.model, drag: null };
            if (collapse) model = fam.selectOnly(model, id);
            P.act(model, true);
          }
        };
        cancelFileDrag = cleanup;
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', up);
      },
    },
  },
});
