// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-precheck-03',
  name: 'design',
  split: 'train',
  scenarios: ['precheck'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '16px/1.3 Arial, Helvetica, sans-serif',
    windowRadius: '0px',
    windowShadow: 'none',
    geometry: { margin: 0, minWidth: 0, minHeight: 0, widthBreakpoint: 900, widthMin: 0, widthMax: 2000, widthScale: [1, 1], heightBreakpoint: 560, heightMin: 0, heightMax: 2000, heightScale: [1, 1], sideBreakpoint: 900, sideNarrow: 180, sideRange: [210, 250] },
    colors: { '--b': '#07377f', '--bs': '#e2edfb', '--bfg': '#fff', '--ad': '#1765c0', '--warn': '#c22516', '--bad': '#c22516', '--good': '#1765c0' },
    parts: {
      screenBody: (base, S) => (sc, parent, m) => {
        const blocks = sc.blocks || [];
        const extras = blocks.filter((b) => ['check', 'radios', 'opts', 'chips', 'also', 'ad', 'banner', 'notice'].includes(b.t));
        if (!extras.length || !sc.side) {
          const normal = S.ctx.util.el('div', 'sd-body', parent);
          if (S.look.sideLeft && sc.side) normal.style.flexDirection = 'row-reverse';
          S.P.main(sc, normal, m);
          if (sc.side) S.P.side(sc, normal, m);
          return normal;
        }
        const details = blocks.filter((b) => !extras.includes(b));
        const el = S.ctx.util.el;
        const body = el('div', 'sd-body sd-threecol', parent);
        Object.assign(body.style, {
          display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr) minmax(0,.68fr)',
          gridTemplateRows: 'minmax(0,1fr)', minHeight: '0',
          gap: S.ctx.size.width < 1000 ? '6px' : '12px', padding: '8px 10px',
        });
        const left = el('section', 'sd-main sd-trip-details', body);
        const detailsTitle = el('h2', 'sd-h', left, 'Your Flight Details');
        S.P.blocks(details, left, m);
        const middle = el('section', 'sd-main sd-trip-extras', body);
        const extrasTitle = el('h2', 'sd-h', middle, 'Add Extras to Your Trip');
        S.P.blocks(extras, middle, m);
        S.P.side(sc, body, m);
        for (const title of [detailsTitle, extrasTitle]) {
          Object.assign(title.style, { margin: '0', padding: '6px 10px' });
        }
        for (const column of [left, middle, body.lastElementChild]) {
          Object.assign(column.style, {
            display: 'flex', flexDirection: 'column', width: 'auto', minWidth: '0',
            minHeight: '0', gap: '7px', overflow: 'auto',
          });
        }
        return body;
      },
    },
  },
});
