// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-move-03',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-file-manager/explorer',
  design: {
    windowRadius: 8,
    titleHeight: 0,
    lightsChance: 0,
    parts: {
      fit: (base, S) => function (ctx) {
        // Preserve the template's sampled draws, then size the sheet from the stage.
        base(ctx);
        const { W, H } = S.geo;
        S.geo = { fullW: W, fullH: H, winW: W, winH: H, left: 0, top: 0 };
      },
      status: (base, S) => function (ctx) {
        base(ctx);
        // The outer window already has a title bar; keep the inner caption in its summary.
        const { title, status } = S.els;
        Object.assign(title.style, {
          height: 'auto', padding: '0', border: '0', background: 'transparent',
        });
        status.append(title);
      },
    },
  },
});
