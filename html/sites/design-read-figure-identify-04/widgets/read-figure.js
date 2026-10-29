// Organizer design: larger framed figures, corner ornaments, and a styled reset control.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-04',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    figureScale: 0.82,
    resetLabel: 'Reset',
    resetParent: '.bottom',
    parts: {
      identifySize: () => () => ({ W: 686, H: 476 }),
      identifyFrame: (base, S) => (ctx, W, H) => {
        const u = S.ctx.util;
        const frame = u.el('div', 'figure-frame', S.scene);
        const svg = u.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, frame);
        for (const corner of ['tl', 'tr', 'bl', 'br']) {
          const cap = u.svg('svg', { viewBox: '0 0 38 38', class: 'frame-corner ' + corner, 'aria-hidden': 'true' }, frame);
          u.svg('path', { d: 'M2 2H36Q33 17 17 17Q17 33 2 36Z', fill: '#aa8c52', stroke: '#594528', 'stroke-width': 1.5 }, cap);
          u.svg('path', { d: 'M5 5H31Q27 13 13 13Q13 27 5 31Z', fill: 'none', stroke: '#d1bb8b', 'stroke-width': 1 }, cap);
        }
        return svg;
      },
      reset: (base, S) => (ctx) => {
        if (!S.D.resetLabel) return;
        const first = JSON.parse(JSON.stringify(ctx.model));
        const reset = S.ctx.util.el('button', 'organizer-reset', document.querySelector(S.D.resetParent), S.D.resetLabel);
        reset.type = 'button';
        const icon = S.ctx.util.el('span', 'reset-icon', reset, '⟳');
        reset.prepend(icon);
        reset.addEventListener('click', () => {
          ctx.update(JSON.parse(JSON.stringify(first)));
          S.P.sync(ctx.model);
        });
      },
    },
  },
});
