env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-03',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {
    parts: {
      marker:
        (base, S) =>
        ({ u, v, i, fb, x, y, lastOne, ps, sx, sy, width: paintW, height: paintH }) => {
          const parts = [];
          const radius = lastOne ? 24 : 10;
          const cross = lastOne ? 10 : 4;
          parts.push(
            `<circle cx="${x}" cy="${y}" r="${radius}" fill="#3c6886" opacity="${lastOne ? '.72' : '.5'}" stroke="none"/>`,
          );
          parts.push(
            `<path d="M${+x - cross} ${+y - cross}l${cross * 2} ${cross * 2}m0 -${cross * 2}l-${cross * 2} ${cross * 2}" fill="none" stroke="white" stroke-width="${lastOne ? 5 : 2}"/>`,
          );
          return parts.join('');
        },
      prepared: (base, S) => (ctx, geo) => {
        const boardWidth = geo.board.getBoundingClientRect().width,
          boardHeight = geo.board.getBoundingClientRect().height;
        geo.svg.setAttribute('viewBox', `0 0 ${boardWidth} ${boardHeight}`);
        geo.paintW = boardWidth;
        geo.paintH = boardHeight;
      },
      scale: (base, S) => (geo) => {
        return {
          sx: geo.paintW / geo.spec.W,
          sy: geo.paintH / geo.spec.H,
          width: geo.paintW,
          height: geo.paintH,
        };
      },
      panel: (base, S) => (m, last, geo) => {
        const ps = m.probes,
          panel = geo.panel,
          boardWidth = geo.paintW,
          boardHeight = geo.paintH,
          sx = boardWidth / geo.spec.W,
          sy = boardHeight / geo.spec.H;
        panel.classList.toggle('no-probes', !last);
        if (last) {
          const point = ps[ps.length - 1];
          panel.style.left = `${Math.max(8, Math.min(boardWidth - 126, point[0] * sx + 41))}px`;
          panel.style.top = `${Math.max(25, Math.min(boardHeight - 25, point[1] * sy))}px`;
        }
      },
      trend: (base, S) => (last) => {
        S.st.trend.textContent =
          last.trend === 'warmer'
            ? 'Keep going. You’re getting warmer.'
            : 'Keep going. You’re getting colder.';
      },
      status: (base, S) => (m) => {
        const ps = m.probes;
        S.st.status.textContent = `◉　${ps.length} click${ps.length === 1 ? '' : 's'} so far`;
      },
    },
  },
});
