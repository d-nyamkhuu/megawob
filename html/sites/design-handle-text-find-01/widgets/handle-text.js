// Design on templates/handle-text/base.js, restyled through site.css.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-find-01',
  name: 'design',
  split: 'train',
  scenarios: ['find'],
  template: 'handle-text/base',
  design: {
    parts: {
      buildFind: (base) => (ctx, look) => {
        const view = base(ctx, look);
        const pane = view.card.querySelector('.ut-doc');
        if (pane) {
          // The compact pane can be shorter than a wheel delta. Keep overlap
          // between successive views so a phrase cannot be skipped both ways.
          pane.addEventListener('wheel', (event) => {
            event.preventDefault();
            const unit = event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? pane.clientHeight : 1;
            const limit = pane.clientHeight * 0.65;
            pane.scrollTop += Math.max(-limit, Math.min(limit, event.deltaY * unit));
          }, { passive: false });
        }
        return view;
      },
    },
  },
});
