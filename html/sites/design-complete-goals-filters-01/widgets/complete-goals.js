// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-filters-01',
  name: 'design',
  split: 'train',
  scenarios: ['filters'],
  template: 'complete-goals/sections',
  design: {
    columnRange: [1420, 1500],
    gridMinWidth: 1240,
    gapRange: [14, 18],
    heightRange: [700, 720],
    heightInset: 24,
    minBoxHeight: 150,
    cardInset: 0,
    cardPadding: '0px',
    cardRadius: '6px',
    cardBackground: 'transparent',
    styles: ['ruled'],
    parts: {
      look: (base, S) => (ctx, W) => {
        const chosen = base(ctx, W);
        chosen.grid = false;
        return chosen;
      },
      heading: (base, S) => () => {},
      frame: (base, S) => (ctx, look, at, W) => {
        const { grid, colW } = at;
        const host = ctx.util.el('div', 'cp-wrap' + (grid ? ' grid' : ''), ctx.stage);
        host.style.setProperty('--cp-gap', `${look.gap}px`);
        host.style.setProperty('--cp-colw', `${colW}px`);
        host.style.width = `${grid ? 2 * colW + look.gap : Math.max(280, W - 32)}px`;
        host.style.marginLeft = '16px';
        host.style.marginRight = '16px';
        if (S.D.fontFamily) host.style.fontFamily = S.D.fontFamily;
        return host;
      },
    },
  },
});
