// Publishing studio design; page canvas first, then the block library and the page settings.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-page-01',
  name: 'design',
  split: 'train',
  scenarios: ['page'],
  template: 'use-site-builder/studio',
  design: {
    parts: {
      composer: (base, S) => () => {
        const { P, D } = S;
        // Without room for the page settings the template's own order stays.
        if (S.spec.scenario !== 'page' || S.ctx.size.width < D.pageInspectorWidth) return base();
        P.document();
        P.library();
        P.pageInspector();
        const work = S.els.work;
        const room = Math.max(0, S.ctx.size.width - 2 * D.inset);
        const side = work.querySelector(':scope > .ab-side');
        const details = work.querySelector(':scope > .ab-inspector');
        if (side) side.style.width = Math.max(165, Math.round(room * 0.19)) + 'px';
        if (details) details.style.width = Math.max(190, Math.round(room * 0.22)) + 'px';
      },
    },
  },
});
