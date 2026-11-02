// Drafting-panel design: fixed wide handles, scaled vertical tracks, and generic control help.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-07',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    thumb: 26,
    thumbBox: [34, 18],
    rail: 8,
    ticks: true,
    readout: true,
    parts: {
      rail: (base) => (ctx, w) => {
        base(ctx, w);
        if (w.g.vertical) ctx.util.el('div', 'cad-minor-ticks', w.hit);
      },
      card: (base) => (ctx, layout) => {
        const card = base(ctx, layout);
        if (layout.vertical && layout.n > 1) {
          card.classList.add('cad-multiple');
          card.style.width = Math.min(66, 16.45 * layout.n) + '%';
        }
        return card;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          const scale = layout.size.height / 693;
          g.length = layout.size.height * 0.585;
          g.thumb = 26;
          g.thumbBox = [46 * scale, 24 * scale];
          g.rail = 13 * scale;
        }
      },
      controlled: (base) => (ctx, ctl, s, i, layout) => {
        base(ctx, ctl, s, i, layout);
        if (!layout.vertical) return;
        const root = ctl.anchor.parentElement.parentElement;
        const side = ctx.util.el('div', 'cad-side', root);
        const readout = root.querySelector('.slc-readout');
        if (readout) side.append(readout);
        ctx.util.el('div', 'cad-help', side, 'Drag handle');
      },
    },
  },
});
