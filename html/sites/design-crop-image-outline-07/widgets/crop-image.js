env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-07',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { aspect: 1024 / 644 },
  template: 'crop-image/box',
  design: {
    fitMode: 'floor-height',
    insetX: 20,
    insetY: 20,
    inspectorTitle: 'Crop Controls',
    measurementSuffix: ':',
    parts: {
      inspectorTools: (base, S) => (ctx, inspector) => {
        const nudges = ctx.util.el('div', 'crop-nudges', inspector);
        for (const direction of ['Left', 'Right', 'Up', 'Down']) {
          const button = ctx.util.el('button', 'crop-nudge', nudges, 'Nudge ' + direction);
          button.type = 'button';
          button.onclick = () => S.els.nudgeCrop(direction.toLowerCase());
        }
      },
      controls: (base, S) => (ctx) => {
        S.els.nudgeCrop = (direction) => {
          const m = { ...ctx.model }, step = 0.02;
          if (direction === 'left' || direction === 'right') {
            const delta = direction === 'left' ? -Math.min(step, m.l) : Math.min(step, 1 - m.r);
            m.l += delta;
            m.r += delta;
          } else {
            const delta = direction === 'up' ? -Math.min(step, m.t) : Math.min(step, 1 - m.b);
            m.t += delta;
            m.b += delta;
          }
          S.crop.set(m);
          S.els.commit(m);
          env.log('nudge-crop', { direction });
        };
      },
    },
  },
});
