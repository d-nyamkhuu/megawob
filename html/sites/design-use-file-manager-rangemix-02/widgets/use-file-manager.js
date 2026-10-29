// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rangemix-02',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'use-file-manager/explorer',
  design: {
    // Include the decorative frame in the template's own space calculations.
    titleHeight: 179,
    statusHeight: 34,
    parts: {
      tileSize: (base, S) => (model, groups) => {
        const fitted = base(model, groups);
        // The Open Look pane presents every tile as one details row. Fit that
        // single column, rather than the template's multi-column icon grid.
        const rows = Math.max(1, groups.reduce((n, group) => n + group.ids.length, 0));
        const pane = S.els.pane;
        const spacing = getComputedStyle(pane);
        const available = pane.clientHeight - parseFloat(spacing.paddingTop)
          - parseFloat(spacing.paddingBottom);
        const preferred = parseFloat(spacing.getPropertyValue('--ol-row-height'));
        return { ...fitted, tileH: Math.min(preferred, Math.floor(available / rows)) };
      },
      tileDrag: (base, S) => {
        let cancelPrevious = () => {};
        return (e, id, collapse, alt0) => {
          cancelPrevious();
          const ctx = S.ctx;
          const spec = ctx.spec;
          const fam = env.taskDef.helpers;
          const win = S.els.win;
          const x0 = e.clientX;
          const y0 = e.clientY;
          const ids = (ctx.model.drag && ctx.model.drag.ids) || [id];
          let active = false;
          // A gesture owns its ghost. A fit/reset may replace the window while
          // pointer events are still queued for the previous rendered window.
          let ghost = null;
          const current = () => win.isConnected && S.els.win === win;
          const cleanup = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            window.removeEventListener('pointercancel', up);
            if (ghost) ghost.remove();
            if (S.els.ghost === ghost) S.els = { ghost: null };
            ghost = null;
          };
          const move = (ev) => {
            if (!current()) { cleanup(); return; }
            if (!active && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
            if (!active) {
              active = true;
              ghost = S.P.dragGhost(id, ids, fam.effective(spec) === 'copy' && (alt0 || ev.altKey));
              ctx.log('grab', { what: 'files', n: ids.length });
            }
            const wr = win.getBoundingClientRect();
            ghost.style.left = ev.clientX - wr.left + 12 + 'px';
            ghost.style.top = ev.clientY - wr.top + 10 + 'px';
            const over = S.P.dropAt(ev.clientX, ev.clientY, ids, true);
            const cur = ctx.model.drag;
            if (!cur || !cur.active || JSON.stringify(cur.over) !== JSON.stringify(over)) {
              S.act(fam.dragOver(ctx.model, over), true);
            }
          };
          const up = (ev) => {
            cleanup();
            if (!current()) return;
            if (active) {
              const over = ev.type === 'pointerup' ? S.P.dropAt(ev.clientX, ev.clientY, ids) : null;
              ctx.log('release', { what: 'files', to: over && over.id });
              S.act(fam.dragEnd(ctx.model, spec, over ? over.id : null, !!(alt0 || ev.altKey)));
            } else {
              let m = { ...ctx.model, drag: null };
              if (collapse) m = fam.selectOnly(m, id);
              S.act(m, true);
            }
          };
          cancelPrevious = cleanup;
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', up);
          window.addEventListener('pointercancel', up);
        };
      },
      sizes: (base, S) => (ctx) => {
        base(ctx);
        // The taller title can leave less than 20 px per folder. Keep the
        // entire spring-loaded tree above the status bar when it expands.
        S.sizes = {
          treeRowH: Math.min(S.sizes.treeRowH,
            Math.max(1, Math.floor((S.geo.paneH - 16) / S.spec.folders.length))),
        };
      },
    },
  },
});
