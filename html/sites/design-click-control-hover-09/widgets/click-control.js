// Design of this site on click-control/controls: squares stay within their own bounds, with a scene pointer.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-09',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      hoverSize: (base) => (r) => ({
        W: Math.max(200, r.width - 20),
        H: Math.max(80, r.height * 0.77),
      }),
      hoverRect: (base) => (s, W, H) => {
        const size = Math.max(24, s.size * 2 * (Math.min(W, H) - 30));
        return {
          x: 15 + s.x * (W - 30 - size),
          y: 15 + s.y * (H - 30 - size),
          width: size,
          height: size,
          rx: 1,
          class: 'uc-sq',
        };
      },
      hoverBefore: () => (ctx, b) => {
        const pointer = ctx.util.el('div', 'scene-pointer', b);
        pointer.innerHTML = '<svg viewBox="0 0 28 38"><path d="M3 2v29l7-6 6 11 5-3-6-10 10-2Z" fill="#fff" stroke="#111b30" stroke-width="2" stroke-linejoin="round"/></svg>';
      },
    },
  },
});
