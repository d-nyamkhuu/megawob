// Unicode editor design; sends an overflowing end control to the page footer.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-12',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  template: 'handle-text/editor',
  design: {
    parts: {
      afterRender: (base, S) => (ctx, view, look, box) => {
        base(ctx, view, look, box);
        const end = document.querySelector('.unicode-actions .submit');
        if (!end) return;
        const er = end.getBoundingClientRect();
        const sr = ctx.stage.getBoundingClientRect();
        if (er.bottom > sr.bottom || er.right > sr.right || er.left < sr.left) {
          end.className = 'end-control end-footer';
          document.querySelector('.footer').append(end);
        }
      },
    },
  },
});
