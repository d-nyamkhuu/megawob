// Use a narrower four-column board, compact glyphs, centered partial rows, and the site's shorter answer labels.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-11',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    boardColumns: 4,
    smallScale: 0.32,
    largeScale: 0.55,
    answerCaption: 'Answer:',
    typedLabel: 'Answer:',
    parts: {
      itemGeometry: (base, S) => (it, i, geo) => {
        const q = base(it, i, geo),
          count = geo.items.length % geo.cols,
        cell = Math.min(geo.cw, geo.ch, geo.W * 0.16);
        if (it.r === geo.rows - 1 && count) q.cx = ((it.c + 0.5) * geo.W) / count;
        q.sz = it.size === 'tiny' ? 14 : cell * (it.size === 'small' ? S.D.smallScale : S.D.largeScale);
        return q;
      },
    },
  },
});
