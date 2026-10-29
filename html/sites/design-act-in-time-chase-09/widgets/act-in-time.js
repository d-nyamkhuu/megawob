// This design routes the inspector into the side panel and shows chase target radius details.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-09',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    sideTarget: '.ds-inspector',
    parts: {
      details: (base, S) => (ctx, details) => {
        const { util, spec } = ctx;
        [
          ['Radius:', `${Math.round(spec.r * ctx.size.height)} pixels`],
          ['Color:', 'Blue'],
          ['Movement:', 'Continuous'],
        ].forEach(([k, v]) => {
          const row = util.el('div', '', details);
          util.el('span', '', row, k);
          const value = util.el('span', '', row);
          if (k === 'Color:') {
            const swatch = util.el('i', 'ds-color-swatch', value);
            swatch.setAttribute('aria-hidden', 'true');
          }
          util.el('span', k === 'Color:' ? 'ds-color-name' : '', value, v);
        });
      },
      rendered: (base, S) => (ctx, f) => {
        base(ctx, f);
        const board = f.body.querySelector('.ut-board');
        if (board) {
          const w = Math.min(ctx.size.width, ctx.size.height * ctx.spec.A);
          const size = document.querySelector('.ds-chase-details>div:first-of-type span:last-child');
          if (size) size.textContent = Math.round((ctx.spec.r * w) / ctx.spec.A) + ' pixels';
        }
      },
    },
  },
});
