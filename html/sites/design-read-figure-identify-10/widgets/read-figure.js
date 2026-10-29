// Design: larger framed figure, colored answer glyphs, and an answer row in the optional slot.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-10',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    parts: {
      // The frame's slot starts empty; a re-render (pageFaults) empties it before the options go in again.
      optionParent: (base) => (parent) => {
        const slot = document.querySelector('.optslot');
        if (!slot) return base(parent);
        slot.replaceChildren();
        return slot;
      },
      optionIcon: (base, S) => (button, key) => {
        const u = S.ctx.util;
        const icon = u.svg(
          'svg',
          { width: 60, height: 60, viewBox: '0 0 60 60', style: 'display:block;flex:none' },
          button,
        );
        if (['circle', 'square', 'triangle', 'diamond', 'star', 'pentagon', 'hexagon'].includes(key)) {
          S.P.figure(u, icon, { kind: 'shape', text: key }, 30, 30, 45, 'none');
          icon.querySelectorAll('*').forEach((el) => {
            el.setAttribute(
              'fill',
              {
                circle: '#72b8fa',
                triangle: '#f96a66',
                square: '#cfa8f0',
                diamond: '#f6b84a',
                star: '#f6b84a',
                pentagon: '#4cbd8c',
                hexagon: '#4cbd8c',
              }[key] || '#4cbd8c',
            );
          });
        } else {
          const text = u.svg(
            'text',
            { x: 30, y: 44, 'text-anchor': 'middle', fill: '#ff796e', 'font-size': 42 },
            icon,
          );
          text.textContent = key === 'letter' ? 'A' : '2';
        }
        button.prepend(icon);
      },
      identifySize: (base) => (ctx) => ({
        W: Math.min(680, ctx.size.width - 40),
        H: Math.max(80, Math.min(580, ctx.size.height - 70)),
      }),
      identifyFrame: (base, S) => (ctx, W, H) =>
        S.ctx.util.svg(
          'svg',
          { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'frame' },
          S.scene,
        ),
    },
  },
});
