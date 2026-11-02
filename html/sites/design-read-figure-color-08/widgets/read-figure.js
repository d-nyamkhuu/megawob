// Matches this site's lowercase caption, answer status display, and answer-only Clear behavior.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-08',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    sampleLabel: 'Sample color',
    resetLabel: 'Clear',
    parts: {
      widget: (base, S) => (ctx) => {
        base(ctx);
        const preview = document.querySelector('.answer-preview');
        const aside = document.querySelector('.aside');
        const progress = document.querySelector('.progress-count');
        S.paints.push((m) => {
          const selected = Number.isInteger(m.answer) && m.answer >= 0 && m.answer < S.spec.hex.length;
          preview.textContent = selected ? '' : '–';
          preview.style.background = selected ? S.spec.hex[m.answer] : '';
          preview.setAttribute('aria-label', selected ? S.spec.colors[m.answer] : 'No answer selected');
          aside.dataset.answered = String(selected);
          progress.textContent = selected ? 'Answer recorded' : '1 of 5';
        });
      },
      resetModel: (base, S) => (first) => ({ ...S.ctx.model, answer: null }),
    },
  },
});
