// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-share-04',
  name: 'design',
  split: 'train',
  scenarios: ['share'],
  template: 'protect-privacy/classic',
  design: {
    font: '13px/1.35 Arial, "Segoe UI", sans-serif',
    minWindow: 0,
    parts: {
      // Keep the template's seeded draws, then fit the app to its actual stage.
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        return { ...geo, winW: geo.fullW, winH: geo.fullH };
      },
      // This app has its own menu and toolbar; omit browser-only decorations.
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
    },
  },
});
