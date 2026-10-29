// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-align-01',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'align-layout/canvas',
  design: {
    fillMix: 52, fillSaturation: 72, fillLightness: 62, borderSaturation: 55, borderLightness: 38,
    cardGap: 0, cardPadding: '0', bodyGap: 0, insetX: 1, insetY: 1,
    rulerWidth: 0, rulerHeight: 0, guideLabel: '',
    parts: {
      // The application's own toolbar and window title supply this decoration.
      // Consume the original title draw so task randomness stays unchanged.
      toolbar: (base, S) => (ctx) => {
        ctx.rng.pick(S.D.titles[ctx.spec.scenario]);
        return null;
      },
      pane: (base, S) => (ctx, parent) => ctx.util.el('div', 'lo-pane', parent),
      ruler: (base, S) => () => null,
    },
  },
});
