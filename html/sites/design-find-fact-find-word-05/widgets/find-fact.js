// Adds live passage counts and fits the full reading text into the document pane.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-05',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      counters: (base, S) => (ctx) => {
        const sourceText = ctx.spec.paragraphs.join(' ');
        const counters = document.querySelectorAll('.ds-status > span:not(.ds-zoom)');
        if (counters[0]) counters[0].textContent = 'Words: ' + sourceText.trim().split(/\s+/).length;
        if (counters[1]) counters[1].textContent = 'Characters: ' + sourceText.length;
      },
      fit: (base, S) => (ctx, B) => {
        base(ctx, B);
        const { rc } = B;
        for (const fs of [30, 28, 26, 24, 22, 20, 18, 17, 16, 15, 14, 13]) {
          rc.style.setProperty('--office-reading-size', fs + 'px');
          if (rc.scrollHeight <= rc.clientHeight + 1) break;
        }
      },
    },
  },
});
