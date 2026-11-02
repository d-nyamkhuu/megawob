// Keep the shared autocomplete behavior and size its form for the Travel stage.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-debounce-03',
  name: 'design',
  split: 'train',
  scenarios: ['debounce'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildDebounce: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        const card = frame.body.querySelector('.ut-trip');
        // The widget reserves 35% for the illustration. The template's 420px
        // card otherwise leaves too little room for distinct suggestion rows.
        card.style.left = '0px';
        card.style.top = '0px';
        card.style.width = '100%';
        return view;
      },
    },
  },
});
