env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-multicursor-03',
  name: 'design',
  split: 'train',
  scenarios: ['multicursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    minLineHeight: 6,
    minFontSize: 4,
    parts: {
      tabs: (base) => (ctx, look) => {
        const result = base(ctx, look);
        result.tabs.className = 'repo-tabs';
        result.tabs.replaceChildren('Source       Commits       Branches       Tags       Versions', result.dirty);
        return result;
      },
      findStrip: (base) => (ctx) => {
        const result = base(ctx);
        result.crumbs.textContent = `InventoryWeb   /   app   /   ${ctx.spec.file}`;
        return result;
      },
      build: (base, S) => (ctx, box) => {
        const view = base(ctx, box);
        const { strip, status, find } = S.els;
        // Use the strip's reserved second row for the live line/column status.
        status.style.cssText = 'position:absolute; left:0; right:0; bottom:0;';
        find.style.zIndex = '1';
        strip.append(status);
        return view;
      },
      metrics: (base, S) => (ctx, box, controls) => {
        // Fit the full seeded file, including the requested edits, in the stage.
        const lines = [ctx.spec.base, ctx.spec.target].map(text => text.split('\n'));
        const rows = Math.max(...lines.map(list => list.length)) + 3;
        const columns = Math.max(...lines.flat().map(line => line.length)) + 2;
        let metrics = base(ctx, box, controls);
        const available = metrics.codeW - 2 * metrics.PAD;
        if (columns * metrics.cw > available) {
          const scale = available / (columns * metrics.cw);
          const lineHeight = Math.max(S.D.minLineHeight, Math.floor(metrics.lh * scale));
          metrics = base(ctx, {
            ...box,
            h: Math.min(box.h, 12 + 119 + rows * lineHeight),
          }, controls);
        }
        return metrics;
      },
    },
  },
});
