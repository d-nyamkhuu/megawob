// Keep carousel buttons separate from the chase widget's hidden SVG dot class.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-carousel-03',
  name: 'design',
  split: 'train',
  scenarios: ['carousel'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildCarousel: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        frame.body.querySelectorAll('.ut-dot').forEach((dot) => {
          dot.classList.replace('ut-dot', 'sw-slide-dot');
        });
        return view;
      },
    },
  },
});
