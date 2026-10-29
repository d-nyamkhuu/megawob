// This design gives the addition cubes blue gradient faces with distinct outlines.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-addition-10',
  name: 'design',
  split: 'train',
  scenarios: ['addition'],
  template: 'read-figure/scene',
  design: {
    parts: {
      cube: (base, S) => (ctx, group, i, k) => {
        const u = S.ctx.util;
        const b = u.el('span', 'cube', group);
        const svg = u.svg('svg', { viewBox: '0 0 100 100' }, b);
        const defs = u.svg('defs', {}, svg);
        [
          ['top', '#65b0eb', '#3b8fd2'],
          ['front', '#3696da', '#2476b6'],
          ['side', '#287cb6', '#155886'],
        ].forEach(([face, from, to]) => {
          const grad = u.svg('linearGradient', { id: `block-${face}-${i}-${k}`, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
          if (face === 'front') {
            [
              ['0%', '#3696da'],
              ['32%', '#358fD1'],
              ['37%', '#3692d4'],
              ['67%', '#348ccd'],
              ['72%', '#3691d2'],
              ['100%', to],
            ].forEach(([offset, color]) => u.svg('stop', { offset, 'stop-color': color }, grad));
          } else {
            u.svg('stop', { offset: '0%', 'stop-color': from }, grad);
            u.svg('stop', { offset: '100%', 'stop-color': to }, grad);
          }
        });
        u.svg('polygon', {
          points: '0,22 22,0 100,0 78,22',
          fill: `url(#block-top-${i}-${k})`,
          stroke: '#286a9f',
          'stroke-width': 1.5,
        }, svg);
        u.svg('polygon', {
          points: '0,22 78,22 78,100 0,100',
          fill: `url(#block-front-${i}-${k})`,
          stroke: '#175a91',
          'stroke-width': 1.5,
        }, svg);
        u.svg('polygon', {
          points: '78,22 100,0 100,78 78,100',
          fill: `url(#block-side-${i}-${k})`,
          stroke: '#124b77',
          'stroke-width': 1.5,
        }, svg);
      },
    },
  },
});
