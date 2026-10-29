// This design keeps delay cards above the footer when a long instruction reduces the stage height.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-01',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      card: (base, S) => (ctx, layout) => {
        const mainRect = layout.main.getBoundingClientRect();
        const cardRect = layout.card.getBoundingClientRect();
        if (cardRect.bottom > mainRect.bottom) {
          layout.card.style.setProperty('top', Math.max(0, mainRect.height - cardRect.height) + 'px', 'important');
        }
      },
    },
  },
});
