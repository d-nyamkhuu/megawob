// Uses the larger, shorter tiles and docks recovery controls beside the page tools.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-05',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    recoveryParent: '.bottom',
    parts: {
      numberGeometry: (base, S) => (ctx, board, button, cell) => {
        const cw = (ctx.size.width - 35) / S.spec.gw;
        const ch = (ctx.size.height - 70) / S.spec.gh;
        const width = Math.min(190, cw - 12, ch - 10);
        const height = Math.min(110, ch - 10);
        button.style.cssText = `left:${6 + cell.c * cw + cell.jx * (cw - width - 8)}px;top:${5 + cell.r * ch + cell.jy * (ch - height - 8)}px;width:${width}px;height:${height}px`;
      },
      widget: (base, S) => (ctx) => {
        base(ctx);
        const initial = JSON.parse(JSON.stringify(ctx.model));
        const clear = document.querySelector('.clear-all');
        if (clear) {
          clear.addEventListener('click', () => {
            S.ctx.update(JSON.parse(JSON.stringify(initial)));
            S.P.sync(S.ctx.model);
          });
        }
      },
    },
  },
});
