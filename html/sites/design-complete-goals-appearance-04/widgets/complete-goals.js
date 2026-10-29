// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-appearance-04',
  name: 'design',
  split: 'train',
  scenarios: ['appearance'],
  template: 'complete-goals/sections',
  design: {
    parts: {
      look: (base) => (ctx, W) => {
        const look = base(ctx, W);
        look.grid = true;
        look.style = 'cards';
        look.head = false;
        look.numbered = false;
        look.gap = 12;
        return look;
      },
      // The stage pads its content for the Tips column: lay the cards out in what is left.
      fit: (base) => (ctx) => {
        const fit = base(ctx);
        const cs = getComputedStyle(ctx.stage);
        const room = ctx.stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return { ...fit, W: Math.min(fit.W, Math.floor(room)) };
      },
    },
  },
});
