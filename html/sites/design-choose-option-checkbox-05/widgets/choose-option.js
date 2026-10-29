// This design caps checkbox row height to the remaining stage space.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-05',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      decorated: (base, S) => (ctx, card, field, wrap) => {
        base(ctx, card, field, wrap);
        const rows = card.querySelectorAll('.fp-choice');
        if (rows.length) {
          const rect = card.getBoundingClientRect();
          const stageRect = ctx.stage.getBoundingClientRect();
          const pitch = parseFloat(getComputedStyle(rows[0]).height);
          const overhead = rect.height - rows.length * pitch;
          const available = ctx.size.height - (rect.top - stageRect.top) - overhead - 2;
          card.style.setProperty('--fp-row-height', Math.min(pitch, available / rows.length) + 'px');
        }
      },
    },
  },
});
