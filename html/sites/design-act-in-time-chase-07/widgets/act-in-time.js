// Adds duration summaries and live readouts, with the side panel in the overview header.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-07',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    elapsedLabel: 'Elapsed Time:',
    insideLabel: 'Pointer Inside:',
    sideTarget: '.ds-overview',
    parts: {
      extraMetrics: (base, S) => (ctx, main, metrics) => {
        const total = ctx.util.el('section', 'ds-chase-metric ds-chase-summary', metrics);
        ctx.util.el('div', 'ut-k', total, 'Total Duration:');
        ctx.util.el('div', 'ut-v', total, `${S.P.sec1(ctx.spec.dur)} seconds`);
        const required = ctx.util.el('section', 'ds-chase-metric ds-chase-summary', metrics);
        ctx.util.el('div', 'ut-k', required, 'Required Dwell:');
        ctx.util.el('div', 'ut-v', required, `${S.P.sec1(ctx.spec.need)} seconds`);
      },
      readout: (base, S) => (ctx, main) => {
        const boardReadout = ctx.util.el('div', 'ds-chase-boardreadout', main);
        const elapsedRow = ctx.util.el('div', '', boardReadout);
        ctx.util.el('span', '', elapsedRow, 'Elapsed Time:');
        S.els.elapsedReadout = ctx.util.el('span', '', elapsedRow);
        const dwellRow = ctx.util.el('div', '', boardReadout);
        ctx.util.el('span', '', dwellRow, 'Pointer Inside:');
        S.els.dwellReadout = ctx.util.el('span', '', dwellRow);
      },
      metricsSync: (base, S) => (ctx, m) => {
        S.els.elapsedReadout.textContent = `${S.P.sec1(Math.min(m.t, ctx.spec.dur))} / ${S.P.sec1(ctx.spec.dur)} s`;
        S.els.dwellReadout.textContent = `${S.P.sec1(m.inside)} / ${S.P.sec1(ctx.spec.need)} s`;
      },
    },
  },
});
