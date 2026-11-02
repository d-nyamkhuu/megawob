// This design adds the Clear control and resets only the current answer, matching the original site.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-07',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear',
    parts: {
      reset: (base, S) => (ctx) => {
        const reset = S.ctx.util.el(
          'button',
          'control reference-reset',
          document.querySelector('.bottom'),
          S.D.resetLabel,
        );
        reset.type = 'button';
        reset.onclick = () => {
          if (S.spec.answer === 'typed') S.P.set({ text: '' });
          else S.P.set({ answer: null });
        };
      },
    },
  },
});
