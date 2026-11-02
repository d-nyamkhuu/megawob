// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-undo-02',
  name: 'design',
  split: 'train',
  scenarios: ['undo'],
  template: 'use-email/base',
  design: {
    parts: {
      // Full-bleed window with a persistent folder rail, the reader stacked over the list.
      'mailGeometry': (base) => (ctx, ads) => {
        const appW = Math.floor(ctx.size.width);
        const sideW = appW >= 1100 ? 234 : 184;
        const mainW = appW - sideW - 1;
        return { ...base(ctx, ads), appW, appH: ctx.size.height, rail: false, sideW, stack: true, adCol: false,
          listW: mainW, readW: mainW, left: 0, top: 0 };
      },
    },
  },
});
