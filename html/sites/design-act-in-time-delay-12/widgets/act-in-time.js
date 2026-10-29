// Pads clock minutes, places the widget clock in the site footer, and omits the process strip.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-12',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    clockPad: true,
    process: false,
    parts: {
      frame: (base) => (ctx) => {
        const f = base(ctx);
        const clock = f.arena.querySelector('.ut-clock');
        const footerClock = document.querySelector('.ds-footer-clock > div');
        if (footerClock) footerClock.append(clock);
        return f;
      },
    },
  },
});
