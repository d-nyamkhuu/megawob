// Design on templates/reorder-items/cards.js.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-11',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    gridCols: 3,
    numericClass: false,
    parts: {
      available: (base, S) => (ctx) => ({
        availW: ctx.size.width - (ctx.size.width > 800 ? 120 : 60) - (S.spec.legend ? 190 : 0),
        availH: ctx.size.height - 36 - (ctx.size.width > 800 ? 148 : 98),
      }),
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { size, rng } = ctx, geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const sampledGap = rng.int(8, 16);
        const gap = Math.max(sampledGap, Math.round(size.width * .02));
        const columnGap = Math.round(size.width * .093);
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (geo.cols - 1) * columnGap) / geo.cols);
        geo.h = Math.max(40, Math.min(138, maxH));
        geo.w = maxW;
        geo.pitchX = geo.w + columnGap;
        geo.pitchY = geo.h + gap;
        geo.font = Math.max(18, Math.min(42, Math.floor(geo.h * .35)));
      },
      orderedBoard: (base, S) => () => {
        const progress = document.querySelector('.prog-n');
        if (progress) progress.textContent = '0/' + S.spec.items.length + ' placed';
        const textLength = Math.max(...S.spec.items.map((id) => String(S.spec.labels[id].value || S.spec.labels[id].title).length));
        S.geo.textFont = Math.max(12, Math.min(34, (S.geo.w - 60) / (textLength * .65)));
        S.board.style.setProperty('--tile-font', S.geo.textFont + 'px');
      },
      gridTitle: (base, S) => (ctx, card, lab) => {
        const title = base(ctx, card, lab);
        title.style.setProperty('font-size', S.geo.textFont + 'px', 'important');
        return title;
      },
    },
  },
});
