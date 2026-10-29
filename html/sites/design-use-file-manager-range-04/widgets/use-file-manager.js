// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-range-04',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      fit: (base, S) => function (ctx) {
        base(ctx);
        // Keep the sampled window inside shorter stages, including both margins.
        S.geo = { winH: Math.min(S.geo.winH, Math.max(0, ctx.size.height - 2 * S.D.margin)) };
      },
      sizes: (base, S) => function (ctx) {
        base(ctx);
        if (ctx.spec.view !== 'list') return;
        // Fit details rows inside the pane, including its heading and group padding.
        const task = env.taskDef.helpers;
        const empty = { names: {}, parent: {}, deleted: [] };
        let rowH = S.sizes.rowH;
        for (const folder of ctx.spec.folders) {
          const count = task.childrenOf(empty, ctx.spec, folder.id).length;
          if (!count) continue;
          const groups = ctx.spec.grouped ? task.groups(empty, ctx.spec, folder.id).length : 1;
          const overhead = 20 + 28 + groups * 8 + (ctx.spec.grouped ? groups * 26 : 0);
          rowH = Math.min(rowH, Math.floor((S.geo.paneH - overhead) / count));
        }
        S.sizes = { rowH };
      },
    },
  },
});
