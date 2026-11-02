// This design uses the sort preset: square corners and color-tinted labeled boxes.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-01',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  traits: { layout: 'rows', itemSize: .13 },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const { spec, model, size } = ctx;
        // Crop unused paper, keeping the model's aspect and every target intact.
        const edges = spec.containers.map(c => [c.y, c.y + c.h]);
        for (const item of spec.items) {
          const p = model.pos[item.id];
          edges.push([p[1] - spec.item.h / 2, p[1] + spec.item.h / 2]);
        }
        const top = Math.max(0, Math.min(...edges.map(e => e[0])) - .035);
        const bottom = Math.min(1, Math.max(...edges.map(e => e[1])) + .065);
        const span = bottom - top;
        const H = Math.floor(Math.min((size.height - 20) / span, (size.width - 24) / spec.aspect));
        const W = Math.round(H * spec.aspect);
        return { W, H, y: -top * H, boardW: W, boardH: Math.ceil(span * H) };
      },
      bounds: (base, S) => () => {
        const b = base(), g = S.geo, item = S.spec.item;
        return { x0: b.x0, x1: b.x1, y0: 0, y1: Math.min(b.y1, g.boardH - item.h * g.H) };
      },
      box: (base, S) => (ctx, el, container) => {
        base(ctx, el, container);
        const palette = {
          pink: { bc: '#ec5aa5', fill: '#f4bfd4', title: '#ed98bd', border: '#98285d', inner: '#c96d98' },
          purple: { bc: '#8644ca', fill: '#d2b6e2', title: '#b88cd8', border: '#51287c', inner: '#9460b5' },
        }[String(container.label).toLowerCase()];
        if (palette) for (const [key, value] of Object.entries(palette)) {
          el.style.setProperty(key === 'bc' ? '--bc' : '--bin-' + key, value);
        }
        const head = container.head * S.geo.H;
        el.style.setProperty('--label-h', head + 'px');
        el.style.setProperty('--label-font', Math.min(44, head * .73) + 'px');
      },
      shapeSvg: (base, S) => (content, item) => {
        const ink = { pink: '#ec5aa5', purple: '#8644ca' }[item.color] || content.COLORS[item.color];
        return `<svg viewBox="0 0 100 100" fill="url(#disc-${item.id})" stroke="color-mix(in srgb, ${ink} 58%, #26122c)" stroke-width="2.4"><defs><radialGradient id="disc-${item.id}" cx="40%" cy="35%" r="80%"><stop stop-color="color-mix(in srgb, ${ink} 95%, white)"/><stop offset="1" stop-color="${ink}"/></radialGradient></defs>${S.SHAPES[item.shape]}</svg>`;
      },
    },
  },
});
