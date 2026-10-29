// Preserve the hot-cold SVG's aspect ratio behavior from this site's original widget.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-11',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {
    parts: {
      svgAttrs: (base) => (bw, bh) => ({ ...base(bw, bh), preserveAspectRatio: 'none' }),
      marker: () => ({ x, y, fb, lastOne }) => {
        const color = fb.band === 'cold' || fb.band === 'ice' ? '#c9202b' : fb.band === 'hot' ? '#df352b' : '#e98508';
        const px = Number(x), py = Number(y);
        const label = lastOne ? `<path d="M${px+8} ${py-10}l13-13h68l9 10v18l-9 9h-68l-13-13" fill="#fffdf3" stroke="${color}" stroke-width="2.5"/><text x="${px+58}" y="${py+4}" text-anchor="middle" font-size="15" font-weight="800" fill="${color}">${String(fb.label).toUpperCase()}</text>` : '';
        return `${lastOne ? `<circle cx="${px}" cy="${py}" r="15" fill="none" stroke="${color}" stroke-width="2" opacity=".65"/>` : ''}<path d="M${px-9} ${py-9}L${px+9} ${py+9}M${px+9} ${py-9}L${px-9} ${py+9}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M${px-9} ${py-9}L${px+9} ${py+9}M${px+9} ${py-9}L${px-9} ${py+9}" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>${label}`;
      },
    },
  },
});
