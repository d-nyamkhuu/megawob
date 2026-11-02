// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-archive-01',
  name: 'design',
  split: 'train',
  scenarios: ['archive'],
  template: 'use-email/base',
  design: {
    parts: {
      // A centred window at most 1,020 px wide: no folder rail, the reader stacked over the list, compact rows.
      'mailGeometry': (base) => (ctx, ads) => {
        const g = base(ctx, ads);
        const W = ctx.size.width;
        const H = ctx.size.height;
        const appW = Math.min(1020, Math.floor(W * 0.62));
        const mainW = appW - 164 - 1;
        const rows = ctx.spec.rows + g.sponsorK;
        const rowH = Math.max(63, Math.min(68, Math.floor((H - 170) / rows)));
        const appH = Math.min(H - 24, Math.max(g.chromeH + rows * rowH, Math.min(656, H - 24)));
        return { ...g, appW, appH, rail: false, sideW: 164, stack: true, adCol: false, listW: mainW, readW: mainW, rowH,
          rowKind: 'compact', left: (W - appW) / 2, top: Math.max(12, Math.min(30, (H - appH) / 2)) };
      },
    },
  },
});
