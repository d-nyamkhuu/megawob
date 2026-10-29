// This design uses a white canvas and reports crop width and height in the aside.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-07',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1072 / 735, placement: 'center', startBox: { x: 0.3, y: 0.244, w: 0.375, h: 0.438 } },
  template: 'crop-image/box',
  design: {
    background: '#ffffff',
    readoutParent: '.pastel-native .aside',
    parts: {
      readoutText: (base, S) => (ctx, m) => {
        const px = (v, size) => Math.round(v * size);
        return `Width: ${px(m.r - m.l, S.W)} px     Height: ${px(m.b - m.t, S.H)} px`;
      },
    },
  },
});
