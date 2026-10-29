// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rangemix-04',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#fdfdfd', fg: '#10172f', line: '#9eafc4',
    accent: '#0642a2', muted: '#344360', windowRadius: 2,
    parts: {
      // Keep the drag image with its gesture, rather than shared render state.
      tileDrag: (base, S) => function (event, id, collapse, alt0) {
        const ctx = S.ctx;
        const spec = S.spec;
        const fam = env.taskDef.helpers;
        const P = S.P;
        const x0 = event.clientX;
        const y0 = event.clientY;
        const ids = (ctx.model.drag && ctx.model.drag.ids) || [id];
        let active = false;
        let ghost = null;
        const move = (ev) => {
          if (!active && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
          if (!active) {
            active = true;
            ghost = P.dragGhost(id, ids, fam.effective(spec) === 'copy' && (alt0 || ev.altKey));
            ctx.log('grab', { what: 'files', n: ids.length });
          }
          const wr = P.winRect();
          ghost.style.left = ev.clientX - wr.left + 12 + 'px';
          ghost.style.top = ev.clientY - wr.top + 10 + 'px';
          const over = P.dropAt(ev.clientX, ev.clientY, ids, true);
          const cur = ctx.model.drag;
          if (!cur || !cur.active || JSON.stringify(cur.over) !== JSON.stringify(over)) {
            P.act(fam.dragOver(ctx.model, over), true);
          }
        };
        const up = (ev) => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          window.removeEventListener('pointercancel', up);
          if (ghost) ghost.remove();
          ghost = null;
          S.els = { ghost: null };
          if (active) {
            const over = ev.type === 'pointerup' ? P.dropAt(ev.clientX, ev.clientY, ids) : null;
            ctx.log('release', { what: 'files', to: over && over.id });
            P.act(fam.dragEnd(ctx.model, spec, over ? over.id : null, !!(alt0 || ev.altKey)));
          } else {
            let model = { ...ctx.model, drag: null };
            if (collapse) model = fam.selectOnly(model, id);
            P.act(model, true);
          }
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', up);
      },
    },
  },
});
