// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-retention-04',
  name: 'design',
  split: 'train',
  scenarios: ['retention'],
  template: 'protect-privacy/classic',
  design: {
    font: '13px/1.35 "Lucida Grande", "Lucida Sans Unicode", Arial, sans-serif',
    parts: {
      fit: (base) => (ctx) => {
        const geo = base(ctx); // Preserve the template's seeded geometry draws.
        const width = Math.max(1, ctx.size.width - 16);
        const height = Math.max(1, ctx.size.height - 16);
        return { ...geo, M: 8, fullW: width, fullH: height, winW: width, winH: height };
      },
      tabs: (base, S) => (ctx) => {
        base(ctx); // Native window frame replaces the decorative browser tabs.
        S.win.lastElementChild.remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx); // Keep the address builder's RNG draw before removing its frame.
        S.win.lastElementChild.remove();
      },
      navigation: () => () => {},
      styles: (base) => () => base() + `
        .sp-acct-main { min-height: 0; overflow: auto; }
        .sp-cols { flex: none; display: grid; grid-template-columns: minmax(0, 2.35fr) minmax(150px, .9fr); gap: 0; }
        .sp-cols > .sp-card { border: 0; border-radius: 0; background: transparent; }
        .sp-cols > .sp-card:first-child { border-right: 1px solid #b5cce8; }
        .sp-cols .sp-cb { min-height: 48px; gap: 12px; padding: 8px 10px; font-size: 15px; }
        .sp-cols > .sp-card:first-child .sp-cb { flex-direction: row-reverse; justify-content: space-between; }
        .sp-req { flex: none; }
      `,
    },
  },
});
