// This design keeps the compact figure frame and live feedback used by this site.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-02',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    parts: {
      identifySize: (base, S) => (ctx) => {
        const W = Math.min(320, ctx.size.width - 40);
        return { W, H: (W * 245) / 320 };
      },
      synced: (base, S) => (m) => {
        base(m);
        const feedback = document.querySelector('.m-feedtext');
        if (feedback)
          feedback.textContent =
            m.answer === null || m.answer === undefined
              ? 'No answer yet.'
              : 'Answer recorded: ' + String(m.answer).replace(/^./, (x) => x.toUpperCase()) + '.';
      },
    },
  },
});
