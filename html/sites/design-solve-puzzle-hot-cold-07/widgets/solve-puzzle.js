// This design scales probe markers to the board's live rendered size.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-07',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {
    parts: {
      scale: (base, S) => (geo) => {
        const r = geo.board.getBoundingClientRect();
        geo.svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
        return {
          sx: r.width / geo.spec.W,
          sy: r.height / geo.spec.H,
          width: r.width,
          height: r.height,
        };
      },
    },
  },
});
