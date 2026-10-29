// Keep the reference interactions; size the Lisa file grid within the stage.
env.widget({
  task: 'click-control',
  site: 'design-click-control-context-04',
  name: 'design',
  split: 'train',
  scenarios: ['context'],
  template: 'click-control/base',
  design: {
    parts: {
      fileView: (base) => function (ctx, parent, items, layout, avail) {
        const view = base(ctx, parent, items, layout, avail);
        if (layout !== 'grid') return view;

        const stage = ctx.stage.getBoundingClientRect();
        const bounds = parent.getBoundingClientRect();
        const padding = getComputedStyle(parent.parentElement);
        const height = Math.min(ctx.size.height, stage.bottom - bounds.top)
          - parseFloat(padding.paddingBottom) - 2;
        const compact = parseFloat(padding.paddingLeft) < 48;
        // Preserve the original sizes whenever the complete grid already fits.
        function sizeGrid(scale) {
          Object.assign(view.host.style, {
            width: '100%',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gridAutoRows: `minmax(${(compact ? 130 : 175) * scale}px, auto)`,
            gap: `${(compact ? 12 : 30) * scale}px ${(compact ? 8 : 34) * scale}px`,
            alignContent: 'start',
          });
          for (const tile of Object.values(view.els)) {
            Object.assign(tile.style, {
              width: '100%', minWidth: '0', gap: `${12 * scale}px`,
              padding: `${8 * scale}px ${4 * scale}px`,
              fontSize: `${(compact ? 21 : 29) * scale}px`,
            });
            Object.assign(tile.firstElementChild.style, {
              width: `${(compact ? 110 : 170) * scale}px`,
              height: `${(compact ? 96 : 145) * scale}px`, maxWidth: '92%',
              flex: 'none',
            });
          }
        }
        sizeGrid(1);
        const naturalHeight = view.host.getBoundingClientRect().height;
        if (naturalHeight > height) sizeGrid(height / naturalHeight);
        return view;
      },
    },
  },
});
