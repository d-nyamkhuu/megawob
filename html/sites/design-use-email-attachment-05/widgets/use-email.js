// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-email',
  site: 'design-use-email-attachment-05',
  name: 'design',
  split: 'train',
  scenarios: ['attachment'],
  template: 'use-email/base',
  design: {
    parts: {
      'BRANDS': () => ['MacMail'],
      'mailGeometry': (base) => (ctx, ads) => {
        const g = base(ctx, ads);
        const W = ctx.size.width;
        const H = ctx.size.height;
        const appW = Math.max(620, W - 300);
        const sideW = appW >= 1120 ? 224 : 154;
        const mainW = appW - sideW - 1;
        const rowH = Math.max(25, Math.min(30, Math.floor((H - 370) / Math.max(1, ctx.spec.rows))));
        const top = H < 700 ? 72 : 56;
        return { ...g, appW, appH: H - (top === 72 ? 84 : 68), rail: false, sideW, stack: W < 1100, adCol: false, bannerH: 0, sponsorK: 0,
          chromeH: 50 + 34 + 46 + 2, listW: mainW, readW: mainW, rowH, rowKind: 'compact', left: 8, top };
      },
    },
  },
});
