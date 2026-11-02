env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-01',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {
    minHeight: 1,
    minWidth: 1,
    parts: {
      marker:
        (base, S) =>
        ({ u, v, i, fb, x, y, lastOne, ps, sx, sy, width: paintW, height: paintH }) => {
          const parts = [];
          parts.push(
            `<circle cx="${x}" cy="${y}" r="${lastOne ? 15 : 13}" fill="none" stroke="${S.D.colors[fb.band]}" stroke-width="2.5" opacity=".9"/>`,
          );
          parts.push(
            `<path d="M${(u * sx - 7).toFixed(1)} ${(v * sy - 7).toFixed(1)}L${(u * sx + 7).toFixed(1)} ${(v * sy + 7).toFixed(1)}M${(u * sx + 7).toFixed(1)} ${(v * sy - 7).toFixed(1)}L${(u * sx - 7).toFixed(1)} ${(v * sy + 7).toFixed(1)}" fill="none" stroke="${S.D.colors[fb.band]}" stroke-width="2.4" stroke-linecap="round"/>`,
          );
          return parts.join('');
        },
      rect: (base, S) => (board) => {
        const r = board.getBoundingClientRect();
        return {
          left: r.left + board.clientLeft,
          top: r.top + board.clientTop,
          width: board.clientWidth,
          height: board.clientHeight,
        };
      },
    },
  },
});
