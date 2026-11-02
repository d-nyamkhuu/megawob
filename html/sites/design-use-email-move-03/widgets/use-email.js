// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-move-03',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-email/base',
  design: {
    parts: {
      // A window filling the stage, split into list and reader (stacked only when narrow), the list 37-40% wide.
      'mailGeometry': (base) => (ctx, ads) => {
        const g = base(ctx, ads);
        const mx = 10;
        const appW = Math.floor(ctx.size.width - 2 * mx);
        const rail = appW < 820;
        const sideW = rail ? 58 : appW >= 1100 ? Math.round(appW * 0.20) : 164;
        const mainW = appW - sideW - 1;
        const stack = mainW < 700;
        const listW = stack ? mainW : Math.round(Math.max(420, Math.min(540, mainW * ctx.rng.fork('list-width').float(0.37, 0.40))));
        return { ...g, appW, appH: ctx.size.height - 2 * mx, rail, sideW, stack, adCol: false, listW,
          readW: stack ? mainW : mainW - listW, left: mx, top: mx };
      },
    },
  },
});
