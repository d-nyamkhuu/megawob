// Design on color/reference: keep its behavior and size the palette from the stage.
function paletteGeometry(ctx) {
  const { width, height } = ctx.size;
  const compact = width <= 1100;
  const targetHeight = compact ? 32 : 54;
  const top = Math.max(Math.round(height * .18), Math.round(height * .04) + 23 + targetHeight + 12);
  const edge = Math.floor(Math.min(width * (compact ? .39 : .272), height - top - 124));
  return { compact, targetHeight, top, edge, left: width * (compact ? .30 : .252) };
}
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-palette-04',
  name: 'design',
  split: 'train',
  scenarios: ['palette'],
  template: 'pick-color/base',
  design: {
    parts: {
      buildPicker: (base) => function (ctx, card) {
        const layout = paletteGeometry(ctx);
        // Keep every template draw, while making its control geometry match the design's size.
        let first = true;
        const rng = new Proxy(ctx.rng, {
          get(target, key) {
            if (key === 'int') return (...args) => {
              const sampled = target.int(...args);
              if (first) { first = false; return layout.edge; }
              return sampled;
            };
            const value = target[key];
            return typeof value === 'function' ? value.bind(target) : value;
          },
        });
        const result = base({ ...ctx, rng }, card, layout.edge);
        const [square, hue] = result.anchors;
        const edge = parseFloat(square.style.width);
        Object.assign(square.parentElement.style, { position: 'absolute', left: layout.left + 'px', top: layout.top + 'px', padding: '0', zIndex: '2' });
        Object.assign(hue.parentElement.style, { position: 'absolute', left: layout.left + edge + ctx.size.width * .015 + 'px', top: layout.top + 'px', padding: '0', zIndex: '2' });
        return result;
      },
      buildSide: (base, S) => function (ctx, parent, width, options) {
        const result = base(ctx, parent, width, options);
        const layout = paletteGeometry(ctx);
        layout.edge = parseFloat(S.st.controls.anchors[0].style.width);
        const side = parent.lastElementChild;
        const current = side.querySelector('.cp-swatch.small');
        if (current) {
          Object.assign(current.parentElement.style, { left: layout.left + 'px', top: layout.top + layout.edge + 24 + 'px', bottom: 'auto', width: ctx.size.width * .36 + 'px' });
          Object.assign(current.parentElement.style, { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr)', columnGap: '12px', alignItems: 'center' });
          current.parentElement.firstElementChild.style.gridColumn = '1 / -1';
          Object.assign(current.style, { width: '100%', height: (layout.compact ? 42 : 60) + 'px' });
          const readout = current.parentElement.querySelector('.cp-hex');
          if (readout) Object.assign(readout.style, { height: (layout.compact ? 42 : 60) + 'px', margin: '0', minWidth: '0' });
        }
        const target = side.querySelector('.cp-swatch:not(.small), .cp-code');
        if (target) {
          Object.assign(target.parentElement.style, { left: layout.left + 'px', top: ctx.size.height * .04 + 'px', width: ctx.size.width * .19 + 'px' });
          target.style.height = layout.targetHeight + 'px';
        }
        const grid = result.anchors.find(node => node.classList.contains('cp-presets'));
        if (grid) {
          const gap = ctx.size.width <= 1100 ? 3 : 8;
          const count = ctx.spec.presets.length;
          const available = ctx.size.height * .92 - 30;
          const row = Math.min(68, Math.floor((available - gap * (count - 1)) / count));
          const swatch = Math.min(ctx.size.width <= 1100 ? 48 : 64, row);
          Object.assign(grid.style, { display: 'flex', flexDirection: 'column', gap: gap + 'px' });
          for (const cell of grid.children) {
            Object.assign(cell.style, { display: 'flex', alignItems: 'center', gap: '16px', minHeight: row + 'px' });
            Object.assign(cell.firstElementChild.style, { width: swatch + 'px', height: swatch + 'px', flex: 'none' });
          }
        }
        return result;
      },
    },
  },
});
