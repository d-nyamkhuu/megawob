env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-09',
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
          const markerR = Math.max(16, Math.min(26, paintW * 0.022));
          const color = fb.band === 'cold' ? '#5c78ff' : S.D.colors[fb.band];
          if (lastOne)
            parts.push(
              `<circle cx="${x}" cy="${y}" r="${markerR}" fill="var(--panel)" stroke="${color}" stroke-width="3"/>`,
            );
          parts.push(
            `<circle cx="${x}" cy="${y}" r="${lastOne ? markerR * 0.45 : 7}" fill="${color}" stroke="var(--panel)" stroke-width="2"/>`,
          );
          if (lastOne) {
            const label = (fb.label + (fb.trend ? ' · ' + fb.trend : '')).toUpperCase(),
              pillW = Math.max(70, label.length * 11 + 24);
            const px = Math.max(6, Math.min(paintW - pillW - 6, Number(x) + markerR + 8));
            const py = Math.max(20, Math.min(paintH - 20, Number(y)));
            parts.push(
              `<rect x="${px}" y="${py - 18}" width="${pillW}" height="36" rx="18" fill="#4b5565"/><text x="${px + pillW / 2}" y="${py + 6}" text-anchor="middle" font-family="monospace" font-size="18" letter-spacing="2" fill="white">${label}</text>`,
            );
          }
          return parts.join('');
        },
      scale: (base, S) => (geo) => {
        const width = geo.board.clientWidth,
          height = geo.board.clientHeight;
        geo.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        return { sx: width / geo.spec.W, sy: height / geo.spec.H, width, height };
      },
      clearStage: (base, S) => (stage) => {
        const hero = document.querySelector('.kinetic-title');
        base(stage);
        if (hero) stage.appendChild(hero);
      },
    },
  },
});
