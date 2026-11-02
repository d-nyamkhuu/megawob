// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-signup-03',
  name: 'design',
  split: 'train',
  scenarios: ['signup'],
  template: 'complete-wizard/stepper',
  design: {
    title: 'Create your account',
    titleSize: 'clamp(32px,4.7vw,78px)',
    look: {
      ind: 'circles', flat: true, title: true, stepHead: false,
      cols: 2, inline: false, h: 64, r: 10, pad: 16, gap: 20,
      width: 1600, hints: false, stars: false, foot: 'right',
    },
    parts: {
      indicator: (base) => (ctx, s, look) => {
        const main = base(ctx, s, look);
        const title = s.card.querySelector('.wz-title');
        if (title) main.append(title);
        return main;
      },
    },
  },
});
