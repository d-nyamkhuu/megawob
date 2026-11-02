// This design anchors blank-space clicks to the form title and compresses crowded widget rows.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-04',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        frame.h1 = ctx.stage.parentElement.querySelector('.formtitle');
        return frame;
      },
      widgetsBuilt: () => (ctx, card, rows, r) => {
        const style = getComputedStyle(card);
        const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        const gap = parseFloat(style.rowGap) || 0;
        const heights = rows.map((row) => Math.max(...Array.from(row.children, (el) => el.getBoundingClientRect().height)));
        const total = heights.reduce((sum, h) => sum + h, 0);
        if (total + padding + gap * (rows.length - 1) > r.height) {
          card.style.paddingTop = '8px';
          card.style.paddingBottom = '4px';
          const available = r.height - 12;
          if (total + 4 * (rows.length - 1) <= available) {
            card.style.gap = Math.max(4, Math.min(gap, (available - total) / Math.max(1, rows.length - 1))) + 'px';
            rows.forEach((row) => {
              row.style.flexShrink = '0';
            });
          } else {
            card.classList.add('widget-dense');
            card.style.gap = '4px';
            card.style.setProperty(
              '--widget-row-height',
              Math.floor((available - 4 * (rows.length - 1)) / rows.length) + 'px',
            );
          }
        }
      },
    },
  },
});
