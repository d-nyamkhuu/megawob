// Centered full-stage board design, with the original figure scale and placement behavior.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-10',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { placement: 'center' },
  template: 'click-point/board',
  design: {
    parts: {
      layout: (base, S) => (ctx) => {
        const { size, rng } = ctx;
        rng.int(440, 600);
        S.scale = Math.min(size.width * 0.1386, size.height * 0.271) / S.spec.r;
        S.origin = [0, 0];
        S.offset = [
          size.width * 0.5 - S.spec.c[0] * S.scale,
          size.height * 0.471 - S.spec.c[1] * S.scale,
        ];
        return { W: size.width, H: size.height };
      },
      built: (base, S) => (ctx, { wrap }) => {
        wrap.style.left = '0px';
        wrap.style.top = '0px';
        S.svg.style.setProperty('--figure-stroke', `${(6 * ctx.size.height) / 852}px`);
      },
    },
  },
});
