// Grid tiles use this site's Bauhaus slots, padded stage measurements, and compact square sizing.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-06',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      orderedBegin: (base, S) => (ctx) => {
        const responseSlots = document.querySelector('.bh-slots');
        if (responseSlots) {
          responseSlots.replaceChildren();
          for (let i = 1; i <= S.spec.items.length; i++) {
            ctx.util.el('div', 'bh-slot', responseSlots, String(i));
          }
        }
      },
      available: (base, S) => (ctx, wrap) => {
        const { size } = ctx;
        const stageStyle = getComputedStyle(ctx.stage);
        const wrapStyle = getComputedStyle(wrap);
        const px = (style, key) => parseFloat(style[key]) || 0;
        const legendW = S.spec.legend ? 190 : 0;
        return {
          availW: Math.min(
            size.width - 60 - legendW,
            size.width -
              px(stageStyle, 'paddingLeft') -
              px(stageStyle, 'paddingRight') -
              px(wrapStyle, 'marginLeft') -
              px(wrapStyle, 'marginRight') -
              legendW -
              (legendW ? 22 : 0) -
              2,
          ),
          availH: Math.min(
            size.height - 36,
            size.height -
              px(stageStyle, 'paddingTop') -
              px(stageStyle, 'paddingBottom') -
              px(wrapStyle, 'marginTop') -
              px(wrapStyle, 'marginBottom') -
              2,
          ),
        };
      },
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { size, rng } = ctx;
        const geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const gapDraw = rng.int(8, 16);
        const gap = Math.max(gapDraw, Math.round(size.width * 0.031));
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (geo.cols - 1) * gap) / geo.cols);
        geo.w = Math.min(maxW, Math.floor((size.width * 0.86 - (geo.cols - 1) * gap) / geo.cols));
        geo.h = Math.max(40, Math.min(Math.floor(maxH * 0.98), Math.round(geo.w * 1.02)));
        geo.w = Math.min(geo.w, Math.floor(geo.h / 1.02));
        geo.pitchX = geo.w + gap;
        geo.pitchY = geo.h + gap;
        geo.font = Math.max(18, Math.min(42, Math.floor(geo.h * 0.35)));
      },
      gridTitle: (base, S) => (ctx, card, lab, longest) => {
        const title = base(ctx, card, lab);
        title.style.setProperty(
          'font-size',
          Math.min(S.geo.w * 0.46, S.geo.w / (longest * 0.55 + 0.5)) + 'px',
          'important',
        );
        return title;
      },
    },
  },
});
