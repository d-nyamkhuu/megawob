// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-align-04',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'align-layout/canvas',
  design: {
    cardGap: 0,
    cardPadding: '0',
    bodyGap: 0,
    rulerWidth: 0,
    rulerHeight: 0,
    insetX: 0,
    insetY: 0,
    panel: '#f5f5f5',
    fg: '#080808',
    accent: '#111111',
    parts: {
      style(base) {
        return (ctx) => {
          base(ctx);
          // The studio uses the page toolbar instead of an editor frame.
          // Keep the actual card box: it is the template's stable anchor.
          ctx.css('studio-layout-frame', `
            .lo-card { border:0; background:transparent; border-radius:0; box-shadow:none; }
            .lo-bar,.lo-cap,.lo-rt,.lo-rl,.lo-guide span { display:none; }
            .lo-canvas { outline:0; background:transparent; background-image:none; }
          `);
        };
      },
      item(base) {
        return (ctx, canvas, item, index, locked) => {
          const el = base(ctx, canvas, item, index, locked);
          if (locked) return el;
          el.classList.add('studio-card', 'studio-card-' + (index % 4));
          return el;
        };
      },
    },
  },
});
