// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-nested-03',
  name: 'design',
  split: 'train',
  scenarios: ['nested'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      away: (base) => (st) => {
        // The stage is cleared on re-render, but the body-mounted panel survives.
        // Replace it so its Back handler belongs to the current render.
        document.querySelectorAll('body > .ps-away').forEach((panel) => panel.remove());
        const view = base(st);
        // The fixed recovery screen must sit above the instruction panel,
        // outside the inset window's stacking context.
        document.body.append(view.away);
        return view;
      },
    },
  },
});
